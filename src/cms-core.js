export const money = value => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const validPhone = phone => /^55\d{10,11}$/.test(phone || '')
export function safeUrl(value) {
  if (!value || [...value].some(char => char.charCodeAt(0) < 32 || char === String.fromCharCode(92))) return ''
  if (/^\/(?!\/)/.test(value)) return value
  try { return new URL(value).protocol === 'https:' ? value : '' } catch { return '' }
}
export function whatsappUrl(phone, text) {
  return validPhone(phone) ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : ''
}
export function validateContent(data) {
  if (!data?.loja || !Array.isArray(data.produtos) || !Array.isArray(data.secoes)) throw new Error('Dados do site incompletos.')
  if (!validPhone(data.loja.whatsapp)) throw new Error('Informe o WhatsApp com 55, DDD e número, apenas dígitos.')
  for (const key of ['instagram', 'facebook']) if (data.loja[key] && (!safeUrl(data.loja[key]) || !data.loja[key].startsWith('https://'))) throw new Error(`Link de ${key} inválido. Use https://.`)
  const ids = new Set()
  for (const p of data.produtos) {
    if (!p.id || ids.has(p.id)) throw new Error('Os produtos precisam de identificadores únicos.')
    ids.add(p.id)
    if (!p.nome?.trim()) throw new Error('Preencha o nome de todos os produtos.')
    if (!Number.isFinite(p.preco) || p.preco < 0 || p.preco > 1000000) throw new Error(`Preço inválido: ${p.nome}`)
    if (!p.sobConsulta && p.preco <= 0) throw new Error(`Defina um preço positivo ou marque Sob consulta: ${p.nome}`)
    if (!Number.isInteger(p.estoque) || p.estoque < 0 || p.estoque > 1000000) throw new Error(`Estoque inválido: ${p.nome}`)
    if (p.imagem && !safeUrl(p.imagem)) throw new Error(`URL de imagem inválida: ${p.nome}`)
  }
  const sections = new Set()
  for (const s of data.secoes) {
    if (!s.id || sections.has(s.id)) throw new Error('Identificadores de seção duplicados.')
    sections.add(s.id)
    if (!s.titulo?.trim()) throw new Error('Preencha os títulos das seções.')
    if (s.link && !safeUrl(s.link)) throw new Error(`Link inválido na seção ${s.titulo}`)
  }
  return data
}
export function availableProducts(data) { return data.produtos.filter(p => p.ativo !== false) }
