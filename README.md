# PARADISE React

Site em React e Vite para apresentar serviços, demonstrar modelos e preparar projetos digitais.

## Executar

```sh
npm ci
npm run dev
npm run build
npm run preview
npm run lint
```

O build fica em `dist/`. O arquivo `public/_redirects` mantém o acesso direto às rotas na hospedagem Netlify.

## O que está disponível

- Página inicial, serviços e vitrine de modelos.
- Demonstrações Barber, Beauty e Food, com retorno à vitrine.
- On-Demand: elaboração e download local de um briefing em texto. Não gera sites por IA nem envia solicitações.
- Cadastro, login, recuperação e redefinição de senha via Supabase.
- Conta e checkout integrados ao código de backend Supabase/Stripe. A operação depende da configuração descrita em `BACKEND.md`.
- Página de erro para endereços desconhecidos.

## Organização

`src/` contém a aplicação e os estilos. `public/` contém o favicon e regras de hospedagem. `supabase/` contém as funções e a migração do comércio. Não coloque chaves privadas no frontend. A chave publishable usada em `src/supabase.js` é pública; permissões são responsabilidade das políticas no backend.

## Limpeza realizada

Removidos: protótipo Projeto sem rota funcional, script WebGL legado duplicado, folha CSS antiga com estilos globais conflitantes, imagens React/Vite e hero não utilizadas, sprite de ícones sem referências. A documentação padrão do Vite foi substituída por esta documentação do projeto.

Navegação corrigida: Sobre, Minha conta, retorno do login, menu móvel e retorno dos modelos à vitrine. Os links de contato fictícios nos modelos agora levam ao briefing. Os exemplos continuam explicitamente demonstrativos.

O backend foi preservado porque é utilizado. Não foram executados pagamentos, criação de contas ou publicação remota nesta revisão. Autenticação, permissões, webhooks e cobrança precisam dos testes integrados descritos em `BACKEND.md` antes de liberar vendas reais.
