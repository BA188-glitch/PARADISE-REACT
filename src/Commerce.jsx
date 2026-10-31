import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './Login.css'
import RequestCheckout from './RequestCheckout'

export default function Commerce({ mode }) {
 return mode === 'checkout' ? <RequestCheckout /> : <AccountCommerce mode={mode} />
}
function AccountCommerce({ mode }) {
 const [message,setMessage] = useState('')
 const [busy,setBusy] = useState(false)
 const [orders,setOrders] = useState([])
 const [products,setProducts] = useState([])
 const [user,setUser] = useState(null)
 const [loaded,setLoaded] = useState(false)
 const [product,setProduct] = useState(new URLSearchParams(location.search).get('produto') || 'barber')
 useEffect(() => {
  let alive=true
  Promise.all([supabase.auth.getUser(),mode==='checkout'?supabase.from('products').select('*'):Promise.resolve({data:[],error:null})]).then(async ([auth,catalog]) => {
   if(!alive) return
   setUser(auth.data.user); setProducts(catalog.data || []); setLoaded(true)
   if(catalog.error) setMessage('Catálogo indisponível. Tente novamente mais tarde.')
   if(auth.data.user && mode==='account') {
    const result=await supabase.from('orders').select('*').order('created_at',{ascending:false})
    if(alive) {setOrders(result.data || []); if(result.error) setMessage('Não foi possível carregar os pedidos.')}
   }
  }).catch(() => {if(alive){setLoaded(true);setMessage('Não foi possível conectar. Atualize a página para tentar novamente.')}})
  return () => {alive=false}
 },[mode])
 async function submit(e) {
  e.preventDefault();setBusy(true);setMessage('')
  const data=new FormData(e.currentTarget)
  try {
   if(mode==='signup') {
    const password=data.get('password')
    if(password !== data.get('confirm')) throw new Error('As senhas não coincidem.')
    const {error}=await supabase.auth.signUp({email:data.get('email'),password,options:{emailRedirectTo:`${location.origin}/login`}})
    if(error) throw new Error('Não foi possível cadastrar. Verifique os dados ou tente recuperar sua conta.')
    setMessage('Se o cadastro puder ser concluído, você receberá um e-mail de confirmação.')
   } else if(mode==='reset') {
    if(data.get('password') !== data.get('confirm')) throw new Error('As senhas não coincidem.')
    const {error}=await supabase.auth.updateUser({password:data.get('password')})
    if(error) throw new Error('Link inválido ou senha recusada. Solicite uma nova recuperação.')
    await supabase.auth.signOut();location.assign('/login')
   } else {
    if(!user) {location.assign('/login');return}
    const key=`checkout-${user.id}-${product}`
    const requestId=sessionStorage.getItem(key) || crypto.randomUUID()
    sessionStorage.setItem(key,requestId)
    const {data:result,error}=await supabase.functions.invoke('checkout',{body:{productId:product,requestId}})
    if(error || result?.error) throw new Error(result?.error || 'Checkout indisponível. Confirme seu e-mail e tente novamente.')
    const url=new URL(result.url)
    if(url.protocol!=='https:' || url.hostname!=='checkout.stripe.com') throw new Error('Endereço de pagamento inválido.')
    location.assign(url.href)
   }
  } catch(error) {setMessage(error.message)} finally {setBusy(false)}
 }
 return <main className="login-page"><a href="/">PARADISE</a><section className="login-card">
  <h1>{mode==='signup'?'Crie sua conta':mode==='reset'?'Nova senha':mode==='account'?'Minha conta':'Checkout'}</h1>
  {mode==='account' ? <>
   {!loaded ? <p>Carregando…</p> : !user ? <a href="/login">Entre para acessar seus pedidos</a> : <><p>{user.email}</p><p>O pagamento só aparece como confirmado após validação. Atualize esta página para consultar.</p>{orders.length===0 && <p>Nenhum pedido encontrado.</p>}{orders.map(o=><p key={o.id}>{o.product_id} · {(o.amount/100).toLocaleString('pt-BR',{style:'currency',currency:o.currency})} · {o.status==='paid'?'Pagamento confirmado':'Aguardando pagamento'}<br/><small>{o.id}</small></p>)}<button onClick={async()=>{await supabase.auth.signOut();location.assign('/login')}}>Sair</button></>}
  </> : <form onSubmit={submit}>
   {mode==='signup' && <label>E-mail<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>}
   {(mode==='signup' || mode==='reset') ? <><label>Senha (mínimo 12 caracteres)<input name="password" type="password" minLength={12} maxLength={128} autoComplete="new-password" required/></label><label>Confirme a senha<input name="confirm" type="password" minLength={12} maxLength={128} autoComplete="new-password" required/></label></> : <><label>Modelo<select value={product} onChange={e=>setProduct(e.target.value)}>{products.map(p=><option value={p.id} key={p.id}>{p.name} — {(p.amount/100).toLocaleString('pt-BR',{style:'currency',currency:p.currency})}</option>)}</select></label>{!products.length && <p>Produtos sob consulta. Os preços ainda não foram liberados.</p>}<p>Pagamento processado pela Stripe. Não armazenamos dados do cartão.</p></>}
   <button disabled={busy || (mode==='checkout' && !products.some(p=>p.id===product))}>{busy?'Aguarde…':mode==='signup'?'Criar conta':mode==='reset'?'Salvar senha':'Continuar para pagamento'}</button>
  </form>}
  <p role="status">{message}</p><a href="/login">Entrar</a> · <a href="/criar-conta">Criar conta</a> · <a href="/sites-premium">Vitrine</a>
 </section></main>
}
