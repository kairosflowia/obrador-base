-- FASE 15: auditoria final white-label. El prefijo "FZ-" (probablemente de
-- "FUERZA") de los códigos públicos de pedido (public_code) queda hardcoded
-- en varias funciones ya aplicadas. Esta migración las redefine con un
-- prefijo genérico "OB-" para los pedidos NUEVOS; el histórico de pedidos ya
-- creados con "FZ-" no se toca (nunca se actualiza public_code de un pedido
-- existente).
--
-- Definiciones extraídas literalmente de pg_get_functiondef() sobre el
-- estado real de la base remota, para garantizar que no se pierde ninguna
-- corrección aplicada por migraciones posteriores a la creación original de
-- cada función.

CREATE OR REPLACE FUNCTION public.create_checkout_order(p_items jsonb, p_pickup_point_id uuid, p_collection_date date, p_session_key text, p_customer_id uuid, p_name text, p_email text, p_phone text, p_terms_version text, p_privacy_version text, p_marketing boolean, p_lookup_hash text)
 RETURNS TABLE(ok boolean, reason text, order_id uuid, public_code text, total_cents integer, expires_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare i jsonb;v record;av record;o public.orders;oid uuid;rid uuid;code text;subtotal integer:=0;tax integer:=0;line integer;line_tax integer;expiry timestamptz:=now()+interval '15 minutes';qty integer;vid uuid;v_email text:=nullif(lower(trim(coalesce(p_email,''))),'');
begin
 select * into o from public.orders where checkout_key=p_session_key;if found then return query select true,'already_created',o.id,o.public_code,o.total_cents,o.payment_expires_at;return;end if;
 if jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items)=0 or trim(coalesce(p_name,''))='' or trim(coalesce(p_phone,''))='' or p_terms_version is null or p_privacy_version is null then return query select false,'invalid_checkout',null::uuid,null::text,null::integer,null::timestamptz;return;end if;
 if v_email is not null and position('@' in v_email)<2 then return query select false,'invalid_email',null::uuid,null::text,null::integer,null::timestamptz;return;end if;
 if p_customer_id is not null and p_customer_id<>auth.uid() and auth.role()<>'service_role' then raise exception 'insufficient_privilege' using errcode='42501';end if;
 perform public.expire_stock_reservations();
 for i in select value from jsonb_array_elements(p_items) order by value->>'variant_id' loop
  vid:=(i->>'variant_id')::uuid;qty:=(i->>'quantity')::integer;if qty<=0 then return query select false,'invalid_quantity',null::uuid,null::text,null::integer,null::timestamptz;return;end if;
  perform pg_advisory_xact_lock(1,hashtext(vid::text||p_collection_date::text));perform pg_advisory_xact_lock(2,hashtext(p_pickup_point_id::text||p_collection_date::text));
  select pv.*,p.name product_name,p.status product_status into v from public.product_variants pv join public.products p on p.id=pv.product_id where pv.id=vid;
  if not found or v.status<>'active' or v.product_status not in('active','seasonal') or v.price_cents is null then return query select false,'variant_unavailable',null::uuid,null::text,null::integer,null::timestamptz;return;end if;
  select * into av from app_private.variant_availability(vid,p_pickup_point_id,p_collection_date);if not av.is_available or qty>av.remaining then return query select false,coalesce(av.reason,'sold_out'),null::uuid,null::text,null::integer,null::timestamptz;return;end if;
 end loop;
 code:='OB-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
 insert into public.orders(public_code,customer_id,customer_name,customer_email,customer_phone,pickup_point_id,collection_date,status,payment_status,payment_expires_at,subtotal_cents,tax_cents,total_cents,currency,terms_version,privacy_version,marketing_consent,lookup_token_hash,checkout_key)
 values(code,p_customer_id,trim(p_name),v_email,trim(p_phone),p_pickup_point_id,p_collection_date,'pending_payment','pending',expiry,0,0,0,'EUR',p_terms_version,p_privacy_version,coalesce(p_marketing,false),p_lookup_hash,p_session_key) returning id into oid;
 for i in select value from jsonb_array_elements(p_items) loop vid:=(i->>'variant_id')::uuid;qty:=(i->>'quantity')::integer;select pv.*,p.id product_id,p.name product_name into v from public.product_variants pv join public.products p on p.id=pv.product_id where pv.id=vid;line:=v.price_cents*qty;line_tax:=round(line*(v.vat_rate/(100+v.vat_rate)));subtotal:=subtotal+line-line_tax;tax:=tax+line_tax;
  insert into public.stock_reservations(token,session_key,customer_id,product_variant_id,pickup_point_id,collection_date,quantity,status,expires_at,order_id) values(encode(extensions.gen_random_bytes(32),'hex'),p_session_key,p_customer_id,vid,p_pickup_point_id,p_collection_date,qty,'active',expiry,oid) returning id into rid;
  if (select reservation_id is null from public.orders where id=oid) then update public.orders set reservation_id=rid where id=oid;end if;
  insert into public.order_items(order_id,product_id,product_variant_id,product_name_snapshot,variant_name_snapshot,approximate_weight_snapshot,unit_price_cents,vat_rate_snapshot,tax_cents,quantity,line_total_cents) values(oid,v.product_id,vid,v.product_name,v.name,v.approximate_weight_grams,v.price_cents,v.vat_rate,line_tax,qty,line);
 end loop;
 update public.orders set subtotal_cents=subtotal,tax_cents=tax,total_cents=subtotal+tax where id=oid;insert into public.order_status_history(order_id,new_status,actor_id,source,reason) values(oid,'pending_payment',p_customer_id,'customer','checkout_created');insert into public.audit_logs(actor_id,action,entity_type,entity_id,new_data) values(p_customer_id,'order.created','orders',oid::text,jsonb_build_object('public_code',code,'total_cents',subtotal+tax));return query select true,'pending_payment',oid,code,subtotal+tax,expiry;
end$function$;

CREATE OR REPLACE FUNCTION public.convert_reservation_to_order(p_token text, p_guest_email text DEFAULT NULL::text, p_guest_phone text DEFAULT NULL::text)
 RETURNS TABLE(ok boolean, reason text, order_id uuid, public_code text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_reservation public.stock_reservations;
  v_variant public.product_variants;
  v_product public.products;
  v_order_id uuid;
  v_public_code text;
  v_line_total integer;
begin
  select * into v_reservation from public.stock_reservations where token = p_token for update;

  if not found then
    return query select false, 'not_found', null::uuid, null::text; return;
  end if;

  if v_reservation.status = 'converted' then
    select o.id, o.public_code into v_order_id, v_public_code
      from public.orders o where o.id = v_reservation.converted_order_id;
    return query select true, 'already_converted', v_order_id, v_public_code; return;
  end if;

  if v_reservation.status <> 'active' then
    return query select false, 'not_active', null::uuid, null::text; return;
  end if;
  if v_reservation.expires_at < now() then
    update public.stock_reservations set status = 'expired' where id = v_reservation.id;
    return query select false, 'expired', null::uuid, null::text; return;
  end if;

  select * into v_variant from public.product_variants where id = v_reservation.product_variant_id;
  select * into v_product from public.products where id = v_variant.product_id;

  v_line_total := coalesce(v_variant.price_cents, 0) * v_reservation.quantity;
  v_public_code := 'OB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  insert into public.orders (public_code, customer_id, guest_email, guest_phone, pickup_point_id, collection_date, status, total_cents, currency, confirmed_at)
  values (v_public_code, v_reservation.customer_id, p_guest_email, p_guest_phone, v_reservation.pickup_point_id, v_reservation.collection_date, 'confirmed', v_line_total, 'EUR', now())
  returning id into v_order_id;

  insert into public.order_items (order_id, product_variant_id, product_name_snapshot, variant_name_snapshot, unit_price_cents, quantity, line_total_cents)
  values (v_order_id, v_variant.id, v_product.name, v_variant.name, coalesce(v_variant.price_cents, 0), v_reservation.quantity, v_line_total);

  update public.stock_reservations
    set status = 'converted', converted_order_id = v_order_id
    where id = v_reservation.id;

  insert into public.audit_logs (action, entity_type, entity_id, new_data)
  values ('reservation.converted', 'orders', v_order_id::text, jsonb_build_object('reservation_id', v_reservation.id, 'public_code', v_public_code));

  return query select true, 'confirmed', v_order_id, v_public_code;
end;
$function$;

CREATE OR REPLACE FUNCTION public.create_staff_order(p_items jsonb, p_pickup_point_id uuid, p_collection_date date, p_customer_name text, p_customer_phone text, p_customer_email text DEFAULT NULL::text, p_channel text DEFAULT 'phone'::text, p_payment_status text DEFAULT 'paid'::text, p_notes text DEFAULT NULL::text)
 RETURNS TABLE(ok boolean, reason text, order_id uuid, public_code text, total_cents integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  i jsonb;
  v record;
  av record;
  oid uuid;
  code text;
  subtotal integer := 0;
  tax integer := 0;
  line integer;
  line_tax integer;
  qty integer;
  vid uuid;
  v_source public.order_event_source;
begin
  if not (app_private.has_role('owner') or app_private.has_role('admin') or app_private.has_role('operator')) then
    raise exception 'insufficient_privilege' using errcode = '42501';
  end if;

  if p_channel not in ('whatsapp', 'phone', 'in_person') then
    return query select false, 'invalid_channel', null::uuid, null::text, null::integer; return;
  end if;
  if p_payment_status not in ('paid', 'pending') then
    return query select false, 'invalid_payment_status', null::uuid, null::text, null::integer; return;
  end if;
  if trim(coalesce(p_customer_name, '')) = '' or trim(coalesce(p_customer_phone, '')) = '' then
    return query select false, 'invalid_customer', null::uuid, null::text, null::integer; return;
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    return query select false, 'invalid_checkout', null::uuid, null::text, null::integer; return;
  end if;

  v_source := case when app_private.has_role('operator') and not (app_private.has_role('owner') or app_private.has_role('admin')) then 'operator' else 'admin' end;

  for i in select value from jsonb_array_elements(p_items) order by value ->> 'variant_id' loop
    vid := (i ->> 'variant_id')::uuid;
    qty := (i ->> 'quantity')::integer;
    if qty <= 0 then
      return query select false, 'invalid_quantity', null::uuid, null::text, null::integer; return;
    end if;

    perform pg_advisory_xact_lock(1, hashtext(vid::text || p_collection_date::text));
    perform pg_advisory_xact_lock(2, hashtext(p_pickup_point_id::text || p_collection_date::text));

    select pv.*, p.name product_name, p.status product_status
      into v
      from public.product_variants pv
      join public.products p on p.id = pv.product_id
      where pv.id = vid;
    if not found or v.status <> 'active' or v.product_status not in ('active', 'seasonal') or v.price_cents is null then
      return query select false, 'variant_unavailable', null::uuid, null::text, null::integer; return;
    end if;

    select * into av from app_private.variant_availability(vid, p_pickup_point_id, p_collection_date);
    if not av.is_available or qty > av.remaining then
      return query select false, coalesce(av.reason, 'sold_out'), null::uuid, null::text, null::integer; return;
    end if;
  end loop;

  code := 'OB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  insert into public.orders (
    public_code, customer_name, customer_email, customer_phone, pickup_point_id, collection_date,
    status, payment_status, confirmed_at, subtotal_cents, tax_cents, total_cents, currency, channel, internal_note
  )
  values (
    code, trim(p_customer_name), nullif(lower(trim(coalesce(p_customer_email, ''))), ''), trim(p_customer_phone), p_pickup_point_id, p_collection_date,
    'confirmed', p_payment_status::public.payment_status, now(), 0, 0, 0, 'EUR', p_channel, p_notes
  )
  returning id into oid;

  for i in select value from jsonb_array_elements(p_items) loop
    vid := (i ->> 'variant_id')::uuid;
    qty := (i ->> 'quantity')::integer;
    select pv.*, p.id product_id, p.name product_name
      into v
      from public.product_variants pv
      join public.products p on p.id = pv.product_id
      where pv.id = vid;
    line := v.price_cents * qty;
    line_tax := round(line * (v.vat_rate / (100 + v.vat_rate)));
    subtotal := subtotal + line - line_tax;
    tax := tax + line_tax;

    insert into public.order_items (
      order_id, product_id, product_variant_id, product_name_snapshot, variant_name_snapshot,
      approximate_weight_snapshot, unit_price_cents, vat_rate_snapshot, tax_cents, quantity, line_total_cents
    )
    values (oid, v.product_id, vid, v.product_name, v.name, v.approximate_weight_grams, v.price_cents, v.vat_rate, line_tax, qty, line);
  end loop;

  update public.orders set subtotal_cents = subtotal, tax_cents = tax, total_cents = subtotal + tax where id = oid;

  insert into public.product_stock_movements (product_variant_id, type, quantity, order_id, notes, created_by)
  select oi.product_variant_id, 'venta', -oi.quantity, oid, 'Venta confirmada manualmente (' || p_channel || ')', (select auth.uid())
  from public.order_items oi
  join public.product_variants pv on pv.id = oi.product_variant_id
  where oi.order_id = oid and pv.stock_tracking;

  insert into public.order_status_history (order_id, previous_status, new_status, actor_id, source, reason)
  values (oid, null, 'confirmed', (select auth.uid()), v_source, 'Pedido manual (' || p_channel || ')');

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, new_data)
  values ((select auth.uid()), 'order.created_manual', 'orders', oid::text, jsonb_build_object('public_code', code, 'channel', p_channel, 'total_cents', subtotal + tax));

  return query select true, 'confirmed', oid, code, subtotal + tax;
end;
$function$;

CREATE OR REPLACE FUNCTION public.process_subscription_invoice(p_event_id text, p_invoice_id text, p_stripe_subscription text, p_payment_intent text, p_amount integer, p_currency text, p_payload_hash text)
 RETURNS TABLE(ok boolean, reason text, order_id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  s public.subscriptions;
  c public.subscription_cycles;
  o uuid;
  code text;
begin
  if auth.role() <> 'service_role' then raise exception 'service_role_required' using errcode = '42501'; end if;
  if exists (select 1 from public.payment_events where stripe_event_id = p_event_id) then
    select sc.order_id into o from public.subscription_cycles sc where sc.stripe_invoice_id = p_invoice_id;
    return query select true, 'already_processed', o; return;
  end if;

  select * into s from public.subscriptions where stripe_subscription_id = p_stripe_subscription for update;
  if not found then
    insert into public.payment_events (stripe_event_id, event_type, payment_intent_id, processing_status, payload_hash, error_message, processed_at)
    values (p_event_id, 'invoice.paid', p_payment_intent, 'failed', p_payload_hash, 'subscription_not_found', now());
    return query select false, 'subscription_not_found', null::uuid; return;
  end if;

  select * into c from public.subscription_cycles where subscription_id = s.id and status in ('planned', 'capacity_reserved', 'invoiced') order by collection_date limit 1 for update;
  if not found then
    update public.subscriptions set status = 'requires_attention', requires_attention_reason = 'paid_invoice_without_cycle' where id = s.id;
    return query select false, 'cycle_not_found', null::uuid; return;
  end if;

  code := 'OB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  insert into public.orders (public_code, customer_id, pickup_point_id, collection_date, status, payment_status, total_cents, subtotal_cents, tax_cents, currency, confirmed_at, order_type, subscription_id, subscription_cycle_id)
  values (code, s.customer_id, s.pickup_point_id, c.collection_date, 'confirmed', 'paid', p_amount, p_amount, 0, 'EUR', now(), 'subscription', s.id, c.id)
  returning id into o;
  insert into public.order_items (order_id, product_id, product_variant_id, product_name_snapshot, variant_name_snapshot, approximate_weight_snapshot, unit_price_cents, vat_rate_snapshot, tax_cents, quantity, line_total_cents)
  select o, v.product_id, i.product_variant_id, i.product_name_snapshot, i.variant_name_snapshot, v.approximate_weight_grams, i.unit_price_cents_snapshot, i.vat_rate_snapshot, 0, i.quantity, i.quantity * i.unit_price_cents_snapshot
  from public.subscription_items i join public.product_variants v on v.id = i.product_variant_id where i.subscription_id = s.id;

  update public.subscription_cycles set status = 'order_created', stripe_invoice_id = p_invoice_id, stripe_payment_intent_id = p_payment_intent, order_id = o where id = c.id;
  update public.subscriptions set status = 'active', requires_attention_reason = null where id = s.id;
  insert into public.payment_events (stripe_event_id, event_type, payment_intent_id, order_id, processing_status, payload_hash, processed_at)
  values (p_event_id, 'invoice.paid', p_payment_intent, o, 'processed', p_payload_hash, now());
  insert into public.subscription_status_history (subscription_id, previous_status, new_status, source, reason)
  values (s.id, s.status, 'active', 'stripe_webhook', 'invoice.paid');
  return query select true, 'order_created', o;
end;
$function$;

