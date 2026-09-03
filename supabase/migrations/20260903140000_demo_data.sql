-- Fase 9: datos de demostración neutrales para obrador-base.
-- Todos los registros creados aquí llevan is_demo=true y pueden coexistir
-- con datos reales sin compartir identificadores ni credenciales externas.

alter table public.product_families add column if not exists is_demo boolean not null default false;
alter table public.products add column if not exists is_demo boolean not null default false;
alter table public.product_variants add column if not exists is_demo boolean not null default false;
alter table public.pickup_points add column if not exists is_demo boolean not null default false;
alter table public.production_dates add column if not exists is_demo boolean not null default false;
alter table public.product_stock_movements add column if not exists is_demo boolean not null default false;
alter table public.subscription_plans add column if not exists is_demo boolean not null default false;
alter table public.subscription_plan_items add column if not exists is_demo boolean not null default false;
alter table public.subscriptions add column if not exists is_demo boolean not null default false;
alter table public.subscription_items add column if not exists is_demo boolean not null default false;
alter table public.subscription_cycles add column if not exists is_demo boolean not null default false;
alter table public.subscription_capacity_allocations add column if not exists is_demo boolean not null default false;
alter table public.orders add column if not exists is_demo boolean not null default false;
alter table public.order_items add column if not exists is_demo boolean not null default false;
alter table public.product_pickup_points add column if not exists is_demo boolean not null default false;
alter table public.product_production_weekdays add column if not exists is_demo boolean not null default false;
alter table public.pickup_point_opening_hours add column if not exists is_demo boolean not null default false;
alter table public.pickup_point_collection_windows add column if not exists is_demo boolean not null default false;
alter table public.pickup_point_capacity_defaults add column if not exists is_demo boolean not null default false;

comment on column public.product_families.is_demo is 'Registro creado por el seed neutral de demostración.';
comment on column public.products.is_demo is 'Registro creado por el seed neutral de demostración.';
comment on column public.product_variants.is_demo is 'Registro creado por el seed neutral de demostración.';
comment on column public.orders.is_demo is 'Pedido simulado, nunca asociado a un pago real.';

create table if not exists public.demo_customers (
  id uuid primary key,
  full_name text not null,
  email text not null,
  phone text,
  is_demo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.demo_customers enable row level security;
drop policy if exists demo_customers_staff_read on public.demo_customers;
create policy demo_customers_staff_read on public.demo_customers for select to authenticated
  using (app_private.has_role('owner') or app_private.has_role('admin') or app_private.has_role('operator'));
revoke all on public.demo_customers from anon, authenticated;
grant select on public.demo_customers to authenticated;

insert into public.demo_customers (id, full_name, email, phone, is_demo)
values ('77777777-7777-4777-8777-777777777701', 'Cliente demo', 'cliente.demo@example.invalid', '+34 600 000 000', true)
on conflict (id) do update set full_name = excluded.full_name, email = excluded.email, phone = excluded.phone, is_demo = true, updated_at = now();

insert into public.product_families (id, name, slug, description, color_key, display_order, status, is_demo)
values
  ('11111111-1111-4111-8111-111111111101', 'Panes artesanales', 'panes-artesanales', 'Panes de fermentación lenta y elaboración diaria.', 'terracota', 1, 'active', true),
  ('11111111-1111-4111-8111-111111111102', 'Especialidades', 'especialidades', 'Piezas saladas para compartir.', 'amarillo', 2, 'active', true),
  ('11111111-1111-4111-8111-111111111103', 'Dulces del obrador', 'dulces-del-obrador', 'Bollería y galletas artesanales.', 'verde', 3, 'active', true)
on conflict (id) do update set name = excluded.name, slug = excluded.slug, description = excluded.description, color_key = excluded.color_key, display_order = excluded.display_order, status = excluded.status, is_demo = true;

insert into public.products (id, family_id, name, slug, short_description, long_description, flour_type, flour_origin, fermentation_hours, status, display_order, is_demo)
values
  ('22222222-2222-4222-8222-222222222201', '11111111-1111-4111-8111-111111111101', 'Hogaza de masa madre', 'hogaza-masa-madre', 'Corteza crujiente y miga alveolada.', 'Una hogaza de fermentación lenta, horneada cada día.', 'Trigo ecológico', 'Molino local', 24, 'active', 1, true),
  ('22222222-2222-4222-8222-222222222202', '11111111-1111-4111-8111-111111111101', 'Pan integral', 'pan-integral', 'Pan de trigo integral con sabor profundo.', 'Elaborado con harina integral y masa madre.', 'Trigo integral', 'Molino local', 18, 'active', 2, true),
  ('22222222-2222-4222-8222-222222222203', '11111111-1111-4111-8111-111111111101', 'Pan de semillas', 'pan-de-semillas', 'Mezcla tostada de semillas y cereales.', 'Una pieza aromática con semillas de calabaza, lino y sésamo.', 'Trigo', 'Molino local', 20, 'active', 3, true),
  ('22222222-2222-4222-8222-222222222204', '11111111-1111-4111-8111-111111111102', 'Focaccia', 'focaccia', 'Focaccia esponjosa con aceite de oliva.', 'Masa hidratada, reposada y terminada con aceite de oliva.', 'Trigo', 'Molino local', 12, 'active', 1, true),
  ('22222222-2222-4222-8222-222222222205', '11111111-1111-4111-8111-111111111103', 'Cookies artesanales', 'cookies-artesanales', 'Cookies tiernas con chocolate y frutos secos.', 'Horneadas en pequeñas tandas para conservar su textura.', 'Trigo', 'Molino local', 0, 'active', 1, true),
  ('22222222-2222-4222-8222-222222222206', '11111111-1111-4111-8111-111111111103', 'Bollería', 'bolleria', 'Bollería del día, ligera y hojaldrada.', 'Una selección de piezas dulces elaboradas en el obrador.', 'Trigo', 'Molino local', 8, 'active', 2, true)
on conflict (id) do update set family_id = excluded.family_id, name = excluded.name, slug = excluded.slug, short_description = excluded.short_description, long_description = excluded.long_description, status = excluded.status, display_order = excluded.display_order, is_demo = true;

insert into public.product_variants (id, product_id, name, approximate_weight_grams, price_cents, vat_rate, status, display_order, stock_tracking, is_demo)
values
  ('33333333-3333-4333-8333-333333333201', '22222222-2222-4222-8222-222222222201', 'Pieza 450 g', 450, 550, 4, 'active', 1, true, true),
  ('33333333-3333-4333-8333-333333333202', '22222222-2222-4222-8222-222222222202', 'Pieza 450 g', 450, 500, 4, 'active', 1, true, true),
  ('33333333-3333-4333-8333-333333333203', '22222222-2222-4222-8222-222222222203', 'Pieza 450 g', 450, 650, 4, 'active', 1, true, true),
  ('33333333-3333-4333-8333-333333333204', '22222222-2222-4222-8222-222222222204', 'Pieza 500 g', 500, 700, 10, 'active', 1, true, true),
  ('33333333-3333-4333-8333-333333333205', '22222222-2222-4222-8222-222222222205', 'Caja de 4', 250, 450, 10, 'active', 1, true, true),
  ('33333333-3333-4333-8333-333333333206', '22222222-2222-4222-8222-222222222205', 'Caja de 8', 400, 800, 10, 'active', 2, true, true),
  ('33333333-3333-4333-8333-333333333207', '22222222-2222-4222-8222-222222222206', 'Unidad', 120, 280, 10, 'active', 1, true, true),
  ('33333333-3333-4333-8333-333333333208', '22222222-2222-4222-8222-222222222206', 'Caja de 4', 420, 950, 10, 'active', 2, true, true)
on conflict (id) do update set product_id = excluded.product_id, name = excluded.name, approximate_weight_grams = excluded.approximate_weight_grams, price_cents = excluded.price_cents, vat_rate = excluded.vat_rate, status = excluded.status, display_order = excluded.display_order, stock_tracking = true, is_demo = true;

insert into public.pickup_points (id, name, slug, type, is_main_bakery, accepts_all_products, address_line_1, postal_code, city, province, country_code, public_instructions, internal_notes, contact_name, contact_phone, contact_email, display_order, is_public, status, is_demo)
values ('44444444-4444-4444-8444-444444444401', 'Punto de recogida principal', 'punto-de-recogida-principal', 'bakery', true, true, 'Calle del Horno 1', '00000', 'Ciudad Demo', 'Provincia Demo', 'ES', 'Te esperamos en el obrador durante tu ventana de recogida.', 'Punto creado para demostración.', 'Equipo del obrador', '+34 600 000 000', 'hola@example.invalid', 1, true, 'active', true)
on conflict (id) do update set name = excluded.name, slug = excluded.slug, type = excluded.type, is_main_bakery = true, accepts_all_products = true, address_line_1 = excluded.address_line_1, postal_code = excluded.postal_code, city = excluded.city, province = excluded.province, country_code = excluded.country_code, public_instructions = excluded.public_instructions, internal_notes = excluded.internal_notes, is_public = true, status = 'active', is_demo = true;

insert into public.pickup_point_opening_hours (pickup_point_id, weekday, opens_at, closes_at, is_closed, is_demo)
select '44444444-4444-4444-8444-444444444401', d, '08:00', '14:00', false, true from generate_series(1,6) d
on conflict (pickup_point_id, weekday) do update set opens_at = excluded.opens_at, closes_at = excluded.closes_at, is_closed = false, is_demo = true;
insert into public.pickup_point_collection_windows (id, pickup_point_id, weekday, starts_at, ends_at, is_active, is_demo)
select ('88888888-8888-4888-8888-' || lpad(d::text, 12, '0'))::uuid, '44444444-4444-4444-8444-444444444401', d, '10:00', '14:00', true, true from generate_series(1,6) d
on conflict (pickup_point_id, weekday) do update set starts_at = excluded.starts_at, ends_at = excluded.ends_at, is_active = true, is_demo = true;
insert into public.pickup_point_capacity_defaults (pickup_point_id, weekday, max_units, is_demo)
select '44444444-4444-4444-8444-444444444401', d, 30, true from generate_series(1,6) d
on conflict (pickup_point_id, weekday) do update set max_units = 30, is_demo = true;

insert into public.product_pickup_points (product_id, pickup_point_id, is_available, is_demo)
select p.id, '44444444-4444-4444-8444-444444444401', true, true from public.products p where p.is_demo
on conflict (product_id, pickup_point_id) do update set is_available = true, is_demo = true;
insert into public.product_production_weekdays (product_id, weekday, is_active, is_demo)
select p.id, d, true, true from public.products p cross join generate_series(1,7) d where p.is_demo
on conflict (product_id, weekday) do update set is_active = true, is_demo = true;

insert into public.production_dates (product_variant_id, production_date, total_capacity, reserved_for_subscriptions, status, notes, is_demo)
select v.id, current_date + d, 24, 0, 'open', 'Calendario de demostración.', true
from public.product_variants v cross join generate_series(1,14) d where v.is_demo
on conflict (product_variant_id, production_date) do update set total_capacity = 24, status = 'open', notes = 'Calendario de demostración.', is_demo = true;

insert into public.product_stock_movements (id, product_variant_id, type, quantity, notes, is_demo)
values
  ('99999999-9999-4999-8999-999999999201', '33333333-3333-4333-8333-333333333205', 'entrada', 40, 'Stock inicial de demostración.', true),
  ('99999999-9999-4999-8999-999999999202', '33333333-3333-4333-8333-333333333206', 'entrada', 24, 'Stock inicial de demostración.', true),
  ('99999999-9999-4999-8999-999999999203', '33333333-3333-4333-8333-333333333207', 'entrada', 36, 'Stock inicial de demostración.', true),
  ('99999999-9999-4999-8999-999999999204', '33333333-3333-4333-8333-333333333208', 'entrada', 20, 'Stock inicial de demostración.', true)
on conflict (id) do nothing;

insert into public.orders (id, public_code, guest_email, guest_phone, customer_name, customer_email, customer_phone, pickup_point_id, collection_date, status, payment_status, total_cents, subtotal_cents, tax_cents, currency, confirmed_at, channel, order_type, internal_note, lookup_token_hash, checkout_key, stripe_payment_intent_id, is_demo)
values ('55555555-5555-4555-8555-555555555501', 'DEMO-0001', 'cliente.demo@example.invalid', '+34 600 000 000', 'Cliente demo', 'cliente.demo@example.invalid', '+34 600 000 000', '44444444-4444-4444-8444-444444444401', current_date + 2, 'confirmed', 'paid', 1000, 937, 63, 'EUR', now(), 'web', 'one_off', 'Pedido creado por el seed de demostración.', repeat('d', 64), 'demo-seed-order-0001', 'demo_pi_seed_0001', true)
on conflict (id) do update set status = 'confirmed', payment_status = 'paid', is_demo = true, internal_note = 'Pedido creado por el seed de demostración.';
insert into public.order_items (id, order_id, product_id, product_variant_id, product_name_snapshot, variant_name_snapshot, approximate_weight_snapshot, unit_price_cents, vat_rate_snapshot, tax_cents, quantity, line_total_cents, is_demo)
values
  ('55555555-5555-4555-8555-555555555511', '55555555-5555-4555-8555-555555555501', '22222222-2222-4222-8222-222222222201', '33333333-3333-4333-8333-333333333201', 'Hogaza de masa madre', 'Pieza 450 g', 450, 550, 4, 21, 1, 550, true),
  ('55555555-5555-4555-8555-555555555512', '55555555-5555-4555-8555-555555555501', '22222222-2222-4222-8222-222222222205', '33333333-3333-4333-8333-333333333205', 'Cookies artesanales', 'Caja de 4', 250, 450, 10, 41, 1, 450, true)
on conflict (id) do nothing;
insert into public.product_stock_movements (id, product_variant_id, type, quantity, order_id, notes, is_demo)
values ('99999999-9999-4999-8999-999999999205', '33333333-3333-4333-8333-333333333205', 'venta', -1, '55555555-5555-4555-8555-555555555501', 'Venda simulada no pedido DEMO-0001.', true)
on conflict (id) do nothing;

insert into public.subscription_plans (id, name, slug, description, status, billing_interval, billing_interval_count, price_cents, currency, display_order, is_public, stripe_product_id, stripe_price_id, is_demo)
values ('66666666-6666-4666-8666-666666666601', 'Plan de Pan Demo', 'plan-de-pan-demo', 'Uma seleção semanal de pães artesanais para experimentar o sistema.', 'active', 'weekly', 1, 5000, 'EUR', 1, true, 'demo_product_plan', 'demo_price_plan', true)
on conflict (id) do update set name = excluded.name, description = excluded.description, status = 'active', price_cents = excluded.price_cents, is_public = true, stripe_product_id = excluded.stripe_product_id, stripe_price_id = excluded.stripe_price_id, is_demo = true;
insert into public.subscription_plan_items (subscription_plan_id, product_variant_id, quantity, display_order, is_demo)
values ('66666666-6666-4666-8666-666666666601', '33333333-3333-4333-8333-333333333201', 1, 1, true), ('66666666-6666-4666-8666-666666666601', '33333333-3333-4333-8333-333333333202', 1, 2, true)
on conflict (subscription_plan_id, product_variant_id) do update set quantity = excluded.quantity, is_demo = true;

-- Uma subscrição operacional requer auth.users. Em ambientes demo sem utilizador
-- autenticado o plano e os seus itens continuam disponíveis; após criar o primeiro
-- utilizador, este bloco pode ser executado novamente para completar o exemplo.
do $$
declare
  v_customer uuid;
  v_subscription uuid := '66666666-6666-4666-8666-666666666611';
  v_cycle uuid := '66666666-6666-4666-8666-666666666612';
  v_window uuid;
begin
  select id into v_customer from auth.users order by created_at limit 1;
  select id into v_window from public.pickup_point_collection_windows where pickup_point_id = '44444444-4444-4444-8444-444444444401' and weekday = 1 limit 1;
  if v_customer is not null then
    insert into public.subscriptions (id, customer_id, subscription_plan_id, pickup_point_id, preferred_weekday, preferred_collection_window_id, status, internal_note, is_demo)
    values (v_subscription, v_customer, '66666666-6666-4666-8666-666666666601', '44444444-4444-4444-8444-444444444401', 1, v_window, 'active', 'Subscrição de demonstração.', true)
    on conflict (id) do update set status = 'active', internal_note = 'Subscrição de demonstração.', is_demo = true;
    insert into public.subscription_items (subscription_id, product_variant_id, product_name_snapshot, variant_name_snapshot, quantity, unit_price_cents_snapshot, vat_rate_snapshot, is_demo)
    select v_subscription, v.id, p.name, v.name, i.quantity, v.price_cents, v.vat_rate, true
    from public.subscription_plan_items i join public.product_variants v on v.id = i.product_variant_id join public.products p on p.id = v.product_id
    where i.subscription_plan_id = '66666666-6666-4666-8666-666666666601'
    on conflict (subscription_id, product_variant_id) do update set quantity = excluded.quantity, is_demo = true;
    insert into public.subscription_cycles (id, subscription_id, cycle_start, cycle_end, collection_date, status, capacity_reserved, is_demo)
    values (v_cycle, v_subscription, current_date + 7, current_date + 13, current_date + 7, 'planned', false, true)
    on conflict (id) do update set status = 'planned', is_demo = true;
    insert into public.subscription_capacity_allocations (product_variant_id, pickup_point_id, allocation_date, quantity, source_reference, subscription_cycle_id, is_demo)
    select i.product_variant_id, '44444444-4444-4444-8444-444444444401', current_date + 7, i.quantity, v_subscription::text, v_cycle, true
    from public.subscription_items i where i.subscription_id = v_subscription
    on conflict do nothing;
  end if;
end $$;
