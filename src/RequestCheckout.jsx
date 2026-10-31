import { useState } from 'react'
import { supabase } from './supabase'
import { useStore, CatalogStatus } from './StoreContext'
import { availableProducts, money, whatsappUrl } from './cms-core'
import './Login.css'

export default function RequestCheckout() {
  const store = useStore()
  const products = availableProducts(store.data).filter(p=>!p.demonstrativo&&p.estoque>0)
  const [id,setId]=useState(new URLSearchParams(location.search).get('produto') || '')
  const [summary,setSummary]=useState(null)
  const [message,setMessage]=useState('')
  const [busy,setBusy]=useState(false)
  const chosen=products.find(p=>p.id===id)
  async function review(event) {
    event.preventDefault(); setBusy(true); setMessage(''); setSummary(null)
    const values=new FormData(event.currentTarget)
    try {
      const {data,error}=await supabase.from('store_documents').select('content,revision').eq('site_id',store.siteId).single()
      if(error) throw new Error('Não foi possível verificar o catálogo. Tente novamente antes de enviar seu pedido.')
      if(data.revision!==store.revision) {await store.reload();throw new Error('O catálogo foi atualizado. Confira o modelo e o preço e revise novamente.')}
      const p=data.content.produtos.find(p=>p.id===id&&p.ativo!==false&&!p.demonstrativo&&p.estoque>0)
      if(!p) throw new Error('Selecione um modelo disponível.')
      if(data.content.loja.demonstracao) throw new Error('O site está em modo demonstrativo. Os pedidos ainda não foram liberados.')
      const text=`Olá, PARADISE! Gostaria de solicitar este serviço:\n\n${p.nome}\nValor: ${p.sobConsulta?'Sob consulta':money(p.preco)}\n\nNome: ${values.get('nome')}\nMeu WhatsApp: ${values.get('telefone')}\nSobre o projeto: ${values.get('descricao')}\n\nAguardo confirmação de escopo, prazo e pagamento. Este envio é uma solicitação, não uma compra paga.`
      const url=whatsappUrl(data.content.loja.whatsapp,text)
      if(!url) throw new Error('O atendimento ainda não foi configurado.')
      setSummary({text,url})
    } catch(error) {setMessage(error.message)} finally {setBusy(false)}
  }
  return <main className="login-page"><a href="/">PARADISE</a><section className="login-card cms-checkout"><h1>Seu próximo <span>projeto.</span></h1><p>Escolha um serviço e revise sua solicitação antes de conversar com nossa equipe.</p><CatalogStatus /><form onSubmit={review} onChange={()=>setSummary(null)}><label>Modelo / serviço<select required value={id} onChange={e=>setId(e.target.value)}><option value="">Selecione um serviço</option>{products.map(p=><option key={p.id} value={p.id}>{p.nome} — {p.sobConsulta?'Sob consulta':money(p.preco)}</option>)}</select></label>{!products.length&&<p>Nenhum serviço disponível no momento.</p>}<label>Seu nome<input name="nome" autoComplete="name" maxLength="100" required /></label><label>WhatsApp com DDD<input name="telefone" type="tel" autoComplete="tel" pattern="[0-9()+ \-]{10,20}" required /></label><label>O que você precisa?<textarea name="descricao" rows="4" maxLength="2000" required /></label><p>Sem cobrança nesta etapa. Escopo, prazo e condições de pagamento serão combinados pelo WhatsApp. Seus dados não são salvos neste formulário.</p><button disabled={busy||store.loading||!!store.error||!chosen||store.data.loja.demonstracao}>{busy?'Conferindo catálogo…':'Revisar solicitação →'}</button></form><p role="status">{message}</p>{summary&&<section><h2>Confira sua solicitação</h2><pre className="cms-order-summary">{summary.text}</pre><a className="cms-whatsapp-button" href={summary.url} target="_blank" rel="noreferrer">Abrir WhatsApp e enviar →</a><p>A mensagem só será enviada quando você confirmar no WhatsApp.</p></section>}<a href="/sites-premium">← Voltar à vitrine</a></section></main>
}
