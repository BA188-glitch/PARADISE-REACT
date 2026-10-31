import { Children, createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { safeUrl } from './cms-core'
import initialData from './store-defaults.json'
const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState({ data: initialData, revision: 0, loading: true, error: '' })
  async function reload() {
    try {
      const { data, error } = await supabase.from('store_documents').select('*').eq('site_id', initialData.siteId).single()
      if (error) throw error
      setState({ data: data.content, revision: data.revision, loading: false, error: '' })
      return data
    } catch {
      setState(s => ({ ...s, loading: false, error: 'Não foi possível carregar o catálogo atualizado. Tente novamente.' }))
      return null
    }
  }
  useEffect(() => {
    let alive = true
    const load = async () => {
      const { data, error } = await supabase.from('store_documents').select('*').eq('site_id', initialData.siteId).single()
      if (!alive) return
      if (error) setState(s => ({ ...s, loading: false, error: 'Catálogo online indisponível. Exibindo a apresentação inicial; consulte preços pelo atendimento.' }))
      else setState({ data: data.content, revision: data.revision, loading: false, error: '' })
    }
    load().catch(() => { if (alive) setState(s => ({ ...s, loading: false, error: 'Sem conexão com o catálogo online.' })) })
    const focus = () => { load().catch(() => {}) }
    window.addEventListener('focus', focus)
    return () => { alive = false; window.removeEventListener('focus', focus) }
  }, [])
  return <StoreContext.Provider value={{ ...state, siteId: initialData.siteId, reload, accept: row => setState({ data: row.content, revision: row.revision, loading: false, error: '' }) }}>{children}</StoreContext.Provider>
}
// Shared context used by storefront, checkout and administration.
// eslint-disable-next-line react-refresh/only-export-components
export function useStore() { return useContext(StoreContext) }

export function ManagedSections({ page, children }) {
  const { data } = useStore()
  const entries = Children.toArray(children)
  const known = new Map(entries.map(child => [child.props?.id, child]))
  const sections = data.secoes.filter(s => s.pagina === page)
  return <>{sections.filter(s => s.ativo !== false).map(s => {
    if (s.tipo !== 'texto') return known.get(s.id) || null
    return <section key={s.id} id={s.id} className="cms-custom-section"><span>{s.supertitulo}</span><h2>{s.titulo}</h2><p>{s.texto}</p>{s.link && safeUrl(s.link) && <a href={safeUrl(s.link)}>{s.botao || 'Saiba mais'} ↗</a>}</section>
  })}</>
}
export function CatalogStatus() {
  const { error, loading } = useStore()
  return loading || error ? <p className="cms-catalog-status" role="status">{loading ? 'Atualizando catálogo…' : error}</p> : null
}
