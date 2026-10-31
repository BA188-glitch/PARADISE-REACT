import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useStore } from './StoreContext'
import { money, safeUrl, validateContent } from './cms-core'
import './admin.css'

const lines = ['', 'Mainline', 'Premium', 'RLC', 'Silver Series', 'Treasure Hunt', 'Super Treasure Hunt']
const clone = data => JSON.parse(JSON.stringify(data))
export default function Admin() {
  const store = useStore()
  const [auth, setAuth] = useState({ loading: true, user: null, allowed: false })
  const [draft, setDraft] = useState(null)
  const [revision, setRevision] = useState(0)
  const [tab, setTab] = useState('produtos')
  const [selected, setSelected] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [page, setPage] = useState('home')
  const [recovery, setRecovery] = useState(false)
  const isSpeed = store.siteId === 'speed-diecast'

  useEffect(() => {
    let alive = true
    let generation = 0
    async function inspect() {
      const current = ++generation
      try {
        const { data, error } = await supabase.auth.getUser()
        if (!alive || current !== generation) return
        if (error || !data.user) { setAuth({ loading: false, user: null, allowed: false }); return }
        const permissions = await supabase.rpc('is_store_admin', { p_site_id: store.siteId })
        if (!alive || current !== generation) return
        setAuth({ loading: false, user: data.user, allowed: !permissions.error && permissions.data === true })
      } catch { if (alive) { setAuth({ loading: false, user: null, allowed: false }); setMessage('Não foi possível verificar o acesso. Tente novamente.') } }
    }
    inspect()
    const { data: listener } = supabase.auth.onAuthStateChange(event => {
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
      // Query after the authentication callback releases the session lock.
      setTimeout(() => { if (alive) inspect() }, 0)
    })
    return () => { alive = false; listener.subscription.unsubscribe() }
  }, [store.siteId])

  useEffect(() => {
    if (!dirty) return
    const warn = event => { event.preventDefault(); event.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  async function openEditor() {
    setBusy(true); setMessage('')
    const row = await store.reload()
    if (row) { setDraft(clone(row.content)); setRevision(row.revision); setSelected(row.content.produtos[0]?.id || ''); setDirty(false) }
    else setMessage('O banco do painel ainda não está disponível. Não é possível publicar alterações até ativá-lo.')
    setBusy(false)
  }
  function edit(fn) { setDraft(old => fn(clone(old))); setDirty(true); setMessage('') }
  function productField(key, value) { edit(d => { const p = d.produtos.find(p => p.id === selected); p[key] = value; return d }) }
  function addProduct() {
    const id = crypto.randomUUID()
    edit(d => { d.produtos.push({ id, nome: 'Novo produto', descricao: '', marca: isSpeed ? 'Hot Wheels' : 'PARADISE', categoria: isSpeed ? 'JDM' : 'Site profissional', linha: '', escala: isSpeed ? '1:64' : '', preco: 0, sobConsulta: true, estoque: 1, cor: '#c65331', imagem: '', destaque: '', estilo: '', ativo: false, demonstrativo: false }); return d })
    setSelected(id); setFilter('')
  }
  function moveProduct(id, direction) {
    edit(d => { const i = d.produtos.findIndex(p => p.id === id); const next = i + direction; if (next >= 0 && next < d.produtos.length) [d.produtos[i], d.produtos[next]] = [d.produtos[next], d.produtos[i]]; return d })
  }
  function moveSection(id, direction) {
    edit(d => {
      const scoped = d.secoes.filter(s => s.pagina === page)
      const i = scoped.findIndex(s => s.id === id), next = i + direction
      if (next >= 0 && next < scoped.length) {
        const a = d.secoes.findIndex(s => s.id === id), b = d.secoes.findIndex(s => s.id === scoped[next].id)
        ;[d.secoes[a], d.secoes[b]] = [d.secoes[b], d.secoes[a]]
      }
      return d
    })
  }
  async function save(event) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      validateContent(draft)
      const { data, error } = await supabase.rpc('save_store_document', { p_site_id: store.siteId, p_content: draft, p_revision: revision })
      if (error) throw new Error(error.code === '40001' ? 'Outra sessão alterou o site. Recarregue os dados e reaplique suas alterações.' : 'Não foi possível publicar. Verifique sua conexão e permissão administrativa.')
      setRevision(data.revision); store.accept(data); setDirty(false); setMessage('Publicado! As alterações estão disponíveis para os visitantes, sem novo deploy.')
    } catch (error) { setMessage(error.message) } finally { setBusy(false) }
  }
  async function login(event) {
    event.preventDefault(); setBusy(true); setMessage('')
    const values = new FormData(event.currentTarget)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: String(values.get('email')).trim(), password: values.get('password') })
      if (error) throw error
    } catch { setMessage('Não foi possível entrar. Confira e-mail e senha ou recupere seu acesso.') } finally { setBusy(false) }
  }
  async function recover(event) {
    event.preventDefault(); setBusy(true)
    const email = new FormData(event.currentTarget).get('email')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(String(email).trim(), { redirectTo: `${location.origin}/admin` })
      if (error) throw error
      setMessage('Se o e-mail estiver cadastrado, você receberá instruções para recuperar o acesso.')
    } catch { setMessage('Não foi possível enviar a recuperação. Tente novamente.') } finally { setBusy(false) }
  }
  async function createAccess(event) {
    event.preventDefault(); setBusy(true)
    const values = new FormData(event.currentTarget)
    try {
      if(values.get('password') !== values.get('confirm')) throw new Error('As senhas não coincidem.')
      const { error } = await supabase.auth.signUp({ email:String(values.get('email')).trim(), password:values.get('password'), options:{emailRedirectTo:`${location.origin}/admin`} })
      if(error) throw new Error('Não foi possível cadastrar. Tente novamente ou recupere sua senha se já tiver uma conta.')
      setMessage('Confira sua caixa de e-mail para confirmar a conta. Apenas o endereço autorizado para este site poderá administrar o conteúdo.')
    } catch(error) {setMessage(error.message)} finally {setBusy(false)}
  }
  async function resetPassword(event) {
    event.preventDefault(); setBusy(true)
    const values = new FormData(event.currentTarget)
    try {
      if (values.get('password') !== values.get('confirm')) throw new Error('As senhas não coincidem.')
      const { error } = await supabase.auth.updateUser({ password: values.get('password') })
      if (error) throw new Error('Não foi possível atualizar a senha. Solicite um novo link.')
      setRecovery(false); setMessage('Senha atualizada.')
    } catch (error) { setMessage(error.message) } finally { setBusy(false) }
  }
  async function logout() {
    if (dirty && !window.confirm('Descartar as alterações que ainda não foram publicadas?')) return
    const { error } = await supabase.auth.signOut()
    if (error) { setMessage('Não foi possível sair. Tente novamente.'); return }
    setDraft(null); setDirty(false)
  }

  const product = draft?.produtos.find(p => p.id === selected)
  return <main className="cms-admin"><header className="cms-top"><a href="/" className="cms-brand">{isSpeed ? 'SPEED DIECAST' : 'PARADISE'}<span>ADMINISTRAÇÃO</span></a><a href="/" target="_blank" rel="noreferrer">Ver site ↗</a>{auth.user && <button type="button" onClick={logout}>Sair</button>}</header>
    {message && <p role="status" className="cms-message">{message}</p>}
    {auth.loading ? <p className="cms-access">Verificando acesso…</p> : recovery ? <form className="cms-access" onSubmit={resetPassword}><h1>Definir nova senha</h1><label>Nova senha<input name="password" type="password" minLength="12" maxLength="128" autoComplete="new-password" required /></label><label>Repita a senha<input name="confirm" type="password" minLength="12" maxLength="128" autoComplete="new-password" required /></label><button disabled={busy}>Salvar senha</button></form> : !auth.user ? <div className="cms-access"><span>ACESSO RESTRITO</span><h1>Sua loja, sob seu controle.</h1><p>Entre com a conta autorizada para gerenciar este site.</p><form onSubmit={login}><label>E-mail<input name="email" type="email" autoComplete="username" required /></label><label>Senha<input name="password" type="password" autoComplete="current-password" required /></label><button disabled={busy}>Entrar no painel →</button></form><details><summary>Primeiro acesso: criar minha conta</summary><p>Use o e-mail autorizado para este site. A confirmação do e-mail é obrigatória.</p><form onSubmit={createAccess}><label>E-mail<input name="email" type="email" autoComplete="username" required /></label><label>Senha (mínimo de 12 caracteres)<input name="password" type="password" minLength="12" maxLength="128" autoComplete="new-password" required /></label><label>Repita a senha<input name="confirm" type="password" minLength="12" maxLength="128" autoComplete="new-password" required /></label><button disabled={busy}>Criar conta e confirmar e-mail</button></form></details><details><summary>Esqueci minha senha</summary><form onSubmit={recover}><label>E-mail de recuperação<input name="email" type="email" autoComplete="email" required /></label><button disabled={busy}>Enviar recuperação</button></form></details></div> : !auth.allowed ? <div className="cms-access"><h1>Acesso não autorizado</h1><p>{auth.user.email} não tem permissão administrativa neste site. O cadastro de cliente não concede acesso ao painel.</p><button onClick={logout}>Entrar com outra conta</button></div> : !draft ? <div className="cms-access"><span>ACESSO AUTORIZADO</span><h1>Bem-vindo ao seu painel.</h1><p>Carregue os dados atuais para começar a editar.</p><button disabled={busy} onClick={openEditor}>{busy ? 'Carregando…' : 'Abrir editor'}</button></div> : <>
    <div className="cms-heading"><div><span>CONTROLE DA LOJA</span><h1>Do seu jeito.</h1><p>Produtos, conteúdo e atendimento em um só lugar.</p></div><span className="cms-status">{dirty ? '● Alterações não publicadas' : `✓ Publicado · versão ${revision}`}</span></div>
    <nav className="cms-tabs" aria-label="Áreas do painel">{[['produtos','Produtos'],['secoes','Seções'],['config','Configurações']].map(([id,label])=><button key={id} type="button" aria-pressed={tab===id} onClick={()=>setTab(id)}>{label}</button>)}</nav>
    <form onSubmit={save}><fieldset disabled={busy} className="cms-fieldset">
      {tab === 'produtos' && <div className="cms-layout"><aside className="cms-products"><button type="button" className="cms-primary" onClick={addProduct}>+ Adicionar produto</button><input aria-label="Buscar produtos no painel" placeholder="Buscar por nome ou marca" value={filter} onChange={e=>setFilter(e.target.value)} /><p>{draft.produtos.length} produtos cadastrados</p>{draft.produtos.filter(p=>`${p.nome} ${p.marca}`.toLowerCase().includes(filter.toLowerCase())).map(p=><button key={p.id} type="button" className={`cms-product-item ${selected===p.id?'selected':''}`} onClick={()=>setSelected(p.id)}><b>{p.nome}</b><span>{p.sobConsulta?'Sob consulta':money(p.preco)} · {p.ativo===false?'Oculto':'Visível'}</span></button>)}</aside><section className="cms-editor">{product ? <><div className="cms-editor-title"><h2>Editar produto</h2><span>{product.ativo===false?'Rascunho':'Na vitrine'}</span></div><div className="cms-fields"><label className="cms-wide">Nome<input value={product.nome} maxLength="120" onChange={e=>productField('nome',e.target.value)} required /></label><label>Preço (R$)<input type="number" step="0.01" min="0" max="1000000" value={product.preco} onChange={e=>productField('preco',e.target.value===''?'':Number(e.target.value))} required /></label><label>Estoque / vagas<input type="number" step="1" min="0" max="1000000" value={product.estoque} onChange={e=>productField('estoque',e.target.value===''?'':Number(e.target.value))} required /></label><label>Marca<input value={product.marca||''} maxLength="80" onChange={e=>productField('marca',e.target.value)} /></label><label>Categoria<input value={product.categoria||''} maxLength="60" onChange={e=>productField('categoria',e.target.value)} /></label>{isSpeed ? <><label>Escala<input value={product.escala||''} maxLength="20" onChange={e=>productField('escala',e.target.value)} /></label><label>Linha Hot Wheels<select value={product.linha||''} onChange={e=>productField('linha',e.target.value)}>{lines.map(line=><option key={line} value={line}>{line||'Não se aplica'}</option>)}</select></label></> : <label>Demonstração do modelo<select value={product.estilo||''} onChange={e=>productField('estilo',e.target.value)}><option value="">Sem demonstração</option><option value="barber">Barbearia</option><option value="beauty">Beleza</option><option value="food">Restaurante</option></select></label>}<label>Etiqueta<input value={product.destaque||''} maxLength="40" onChange={e=>productField('destaque',e.target.value)} /></label><label className="cms-wide">Foto (URL HTTPS)<input type="url" placeholder="https://…" value={product.imagem||''} onChange={e=>productField('imagem',e.target.value)} /></label>{safeUrl(product.imagem)&&<img className="cms-photo" src={safeUrl(product.imagem)} alt="Prévia da foto do produto" />}<label className="cms-wide">Descrição<textarea rows="4" maxLength="2000" value={product.descricao||''} onChange={e=>productField('descricao',e.target.value)} /></label></div><div className="cms-checks"><label><input type="checkbox" checked={product.ativo!==false} onChange={e=>productField('ativo',e.target.checked)} />Visível na vitrine</label><label><input type="checkbox" checked={!!product.sobConsulta} onChange={e=>productField('sobConsulta',e.target.checked)} />Preço sob consulta</label><label><input type="checkbox" checked={!!product.demonstrativo} onChange={e=>productField('demonstrativo',e.target.checked)} />Produto demonstrativo (não aceitar pedidos)</label></div><p className="cms-help">Ocultar preserva o cadastro. Estoque zero impede novos pedidos. Fotos são cadastradas por URL; não há upload de arquivos neste painel.</p><div className="cms-actions"><button type="button" disabled={draft.produtos[0]?.id===selected} onClick={()=>moveProduct(selected,-1)}>↑ Mover para cima</button><button type="button" disabled={draft.produtos.at(-1)?.id===selected} onClick={()=>moveProduct(selected,1)}>↓ Mover para baixo</button></div></> : <p>Selecione ou adicione um produto.</p>}</section></div>}
      {tab==='secoes' && <section className="cms-editor"><div className="cms-editor-title"><div><h2>Organizar seções</h2><p>A ordem abaixo é a ordem exibida na página.</p></div><button type="button" onClick={()=>edit(d=>{d.secoes.push({id:`sec-${crypto.randomUUID()}`,pagina:page,tipo:'texto',titulo:'Nova seção',texto:'',ativo:false,link:'',botao:'Saiba mais'});return d})}>+ Seção de texto</button></div><label>Página<select value={page} onChange={e=>setPage(e.target.value)}><option value="home">Página inicial</option>{!isSpeed&&<><option value="premium">Vitrine de modelos</option><option value="servicos">Serviços</option></>}</select></label><div className="cms-sections">{draft.secoes.filter(s=>s.pagina===page).map((s,index,all)=><article key={s.id} className="cms-section-row"><div className="cms-section-bar"><b>{String(index+1).padStart(2,'0')} · {s.titulo}</b><div><button type="button" aria-label={`Subir ${s.titulo}`} disabled={index===0} onClick={()=>moveSection(s.id,-1)}>↑</button><button type="button" aria-label={`Descer ${s.titulo}`} disabled={index===all.length-1} onClick={()=>moveSection(s.id,1)}>↓</button></div></div><label className="cms-check"><input type="checkbox" checked={s.ativo!==false} onChange={e=>edit(d=>{d.secoes.find(x=>x.id===s.id).ativo=e.target.checked;return d})} />Mostrar seção</label>{s.tipo==='texto'?<div className="cms-fields">{[['titulo','Título'],['supertitulo','Chamada curta'],['botao','Texto do botão'],['link','Link do botão']].map(([key,label])=><label key={key}>{label}<input maxLength="300" value={s[key]||''} onChange={e=>edit(d=>{d.secoes.find(x=>x.id===s.id)[key]=e.target.value;return d})} /></label>)}<label className="cms-wide">Texto<textarea rows="4" maxLength="5000" value={s.texto||''} onChange={e=>edit(d=>{d.secoes.find(x=>x.id===s.id).texto=e.target.value;return d})} /></label></div>:<p className="cms-help">Seção original do site: você pode movê-la ou ocultá-la.</p>}</article>)}</div></section>}
      {tab==='config'&&<section className="cms-editor"><h2>Atendimento e redes sociais</h2><div className="cms-fields">{[['whatsapp','WhatsApp Business (55 + DDD + número)'],['email','E-mail de contato'],['instagram','Instagram (URL completa)'],['facebook','Facebook (URL completa)']].map(([key,label])=><label key={key}>{label}<input type={key==='email'?'email':'text'} maxLength="300" value={draft.loja[key]||''} onChange={e=>edit(d=>{d.loja[key]=e.target.value;return d})} /></label>)}</div><label className="cms-check"><input type="checkbox" checked={!!draft.loja.demonstracao} onChange={e=>edit(d=>{d.loja.demonstracao=e.target.checked;return d})} />Modo demonstrativo: bloquear envio de pedidos</label><p className="cms-help">Os pedidos são revisados pelo cliente e enviados por ele no WhatsApp. Abrir a conversa não confirma compra, estoque nem pagamento. Nenhuma cobrança automática é realizada.</p></section>}
      <div className="cms-savebar"><span>{dirty?'Você tem alterações para publicar.':'Tudo salvo.'}</span><div><button type="button" onClick={()=>{if(!dirty||window.confirm('Descartar alterações locais e carregar a versão publicada?'))openEditor()}}>Recarregar dados</button><button className="cms-primary" disabled={!dirty||busy} type="submit">{busy?'Publicando…':'Publicar alterações'}</button></div></div>
    </fieldset></form></>}
  </main>
}
