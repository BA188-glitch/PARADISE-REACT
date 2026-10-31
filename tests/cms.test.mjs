import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { safeUrl, validateContent, whatsappUrl } from '../src/cms-core.js'
const defaults=()=>JSON.parse(readFileSync(new URL('../src/store-defaults.json',import.meta.url),'utf8'))
test('catalog validates, negative prices and duplicate IDs are rejected',()=>{
 assert.doesNotThrow(()=>validateContent(defaults()))
 const d=defaults();d.produtos[0].preco=-1;assert.throws(()=>validateContent(d),/Preço inválido/)
 const duplicate=defaults();duplicate.produtos.push({...duplicate.produtos[0]});assert.throws(()=>validateContent(duplicate),/únicos/)
})
test('stored content cannot turn a link into executable JavaScript or a protocol-relative URL',()=>{
 for(const url of ['javascript:alert(1)','data:text/html,test','//evil.example','http://example.com']) assert.equal(safeUrl(url),'')
 assert.equal(safeUrl('https://example.com/a'),'https://example.com/a')
 assert.equal(safeUrl('/sites-premium'),'/sites-premium')
})
test('message is encoded and invalid business phone cannot generate checkout link',()=>{
 assert.equal(whatsappUrl('','teste'),'')
 const url=new URL(whatsappUrl('5511970581625','Preço R$ 10 & entrega?'))
 assert.equal(url.hostname,'wa.me');assert.equal(url.searchParams.get('text'),'Preço R$ 10 & entrega?')
})
test('free-price product requires explicit consultation and stock is a nonnegative integer',()=>{
 const d=defaults();d.produtos[0].sobConsulta=false;assert.throws(()=>validateContent(d),/positivo/)
 const stock=defaults();stock.produtos[0].estoque=1.5;assert.throws(()=>validateContent(stock),/Estoque/)
})
