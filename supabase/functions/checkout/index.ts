import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@18';
const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
const origin = Deno.env.get('SITE_URL')!;
const headers = { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
Deno.serve(async req => {
 const reply = (data: unknown, status=200) => new Response(JSON.stringify(data), {status, headers});
 if(req.headers.get('origin') !== origin) return reply({error:'Origem inválida'},403);
 if(req.method === 'OPTIONS') return new Response(null,{headers});
 if(req.method !== 'POST') return reply({error:'Método inválido'},405);
 try {
  const token = req.headers.get('authorization')?.replace(/^Bearer /,'');
  if(!token) return reply({error:'Entre na sua conta'},401);
  const {data:{user},error} = await db.auth.getUser(token);
  if(error || !user?.email_confirmed_at) return reply({error:'Confirme seu e-mail e entre novamente'},401);
  const raw = await req.text();
  if(raw.length > 2048) return reply({error:'Requisição inválida'},413);
  const {productId, requestId} = JSON.parse(raw);
  if(!['barber','beauty','food'].includes(productId) || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) return reply({error:'Dados inválidos'},400);
  const {data:order,error:reserveError} = await db.rpc('reserve_order',{uid:user.id,pid:productId,rid:requestId});
  if(reserveError) return reply({error:'Produto indisponível ou limite de tentativas atingido'},409);
  if(order.status === 'paid') return reply({error:'Pedido já pago'},409);
  if(Date.now()-new Date(order.created_at).getTime()>23*3600000) return reply({error:'Tentativa expirada. Inicie outra compra.'},409);
  const session = await stripe.checkout.sessions.create({mode:'payment',client_reference_id:order.id,customer_email:user.email,
   line_items:[{quantity:1,price_data:{currency:order.currency,unit_amount:order.amount,product_data:{name:`PARADISE ${productId.toUpperCase()}`}}}],
   metadata:{order_id:order.id},payment_method_types:['card'],payment_method_options:{card:{request_three_d_secure:'automatic'}},
   success_url:`${origin}/minha-conta?checkout=retorno`,cancel_url:`${origin}/checkout?produto=${productId}`
  },{idempotencyKey:order.id});
  const {error:saveError} = await db.from('orders').update({stripe_session:session.id}).eq('id',order.id);
  if(saveError) throw saveError;
  return reply({url:session.url});
 } catch { return reply({error:'Não foi possível abrir o checkout. Tente novamente.'},500); }
});
