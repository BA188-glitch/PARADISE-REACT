import Stripe from 'npm:stripe@18';
import { createClient } from 'npm:@supabase/supabase-js@2';
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!);
const db = createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
Deno.serve(async req => {
 if(req.method !== 'POST') return new Response('Method not allowed',{status:405});
 let event;
 try { event = await stripe.webhooks.constructEventAsync(await req.text(),req.headers.get('stripe-signature') || '',Deno.env.get('STRIPE_WEBHOOK_SECRET')!); }
 catch { return new Response('Invalid signature',{status:400}); }
 try {
  if(['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type)) {
   const session = event.data.object as Stripe.Checkout.Session;
   if(session.payment_status !== 'paid') return new Response('Ignored');
   const {data:order,error} = await db.from('orders').select('*').eq('id',session.metadata?.order_id).single();
   if(error || !order) throw new Error('Missing order');
   if(session.client_reference_id !== order.id || session.amount_total !== order.amount || session.currency !== order.currency || (order.stripe_session && order.stripe_session !== session.id)) return new Response('Mismatch',{status:400});
   const {error:saveError} = await db.from('orders').update({status:'paid',stripe_session:session.id}).eq('id',order.id).eq('status','pending');
   if(saveError) throw saveError;
  }
  return new Response('OK');
 } catch { return new Response('Retry later',{status:500}); }
});
