# Ativação do backend

1. Execute supabase/migrations/202610300001_commerce.sql no Supabase vinculado ao site.
2. Auth: configure SMTP, confirmação obrigatória de e-mail, senha mínima de 12 caracteres, proteção contra senhas vazadas e limites de cadastro/login/recuperação. Cadastre redirects /login e /redefinir-senha na origem do site.
3. Secrets das funções: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET e SITE_URL (origem exata sem barra final, HTTPS em produção). Nunca exponha service_role ou secrets Stripe no frontend.
4. Publique com supabase functions deploy checkout --no-verify-jwt e supabase functions deploy stripe-webhook --no-verify-jwt. Ambas validam autenticação dentro da função.
5. Registre webhook Stripe em https://SEU-PROJETO.supabase.co/functions/v1/stripe-webhook para checkout.session.completed e checkout.session.async_payment_succeeded.
6. Substitua amount na tabela products pelos preços reais em centavos ANTES de ativar active=true. Os valores iniciais são placeholders inativos.
7. Execute npm install e npm run build. Publique dist com fallback SPA e HTTPS.

Validação obrigatória antes de produção: cadastro/confirmacão, recuperação, login incorreto; compras Stripe teste (sucesso, recusa, 3DS); assinatura inválida recusada; webhook repetido sem duplicação; usuário B sem acesso aos pedidos de A; alteração de preço/status via cliente recusada; limite de dez pedidos/hora; cancelamento e repetição após falhas.

Não houve deploy nem testes integrados contra Stripe/Supabase. Entrega manual. Reembolsos e disputas são tratados no painel Stripe e ainda não sincronizam. MFA e CAPTCHA não estão integrados. Configure Radar, backups, monitoramento, CSP e HSTS na hospedagem. Tokens são geridos pelo SDK Supabase no navegador. Nenhum sistema elimina todas as fraudes. Páginas HTML legadas não foram migradas: esta implementação atende PARADISE-REACT.

Documentação: https://supabase.com/docs/guides/auth/password-security e https://docs.stripe.com/api/checkout/sessions/create e https://docs.stripe.com/webhooks
