alter table public.orders add column if not exists is_demo boolean not null default false;
create index if not exists orders_demo_idx on public.orders(is_demo) where is_demo;

create or replace function app_private.forbid_confirmed_order_item_change()
returns trigger language plpgsql set search_path='' as $$
begin
  if exists(select 1 from public.orders where id=old.order_id and status not in ('draft','pending_payment') and not is_demo) then raise exception 'confirmed_order_items_immutable' using errcode='0A000'; end if;
  return old;
end$$;

create or replace function public.reset_demo_data()
returns integer language plpgsql security definer set search_path='' as $$
declare removed integer;
begin
  if not (select app_private.has_role('owner') or app_private.has_role('admin')) then raise exception 'insufficient_privilege' using errcode='42501'; end if;
  delete from public.notification_deliveries where notification_event_id in (select id from public.notification_events where entity_type='orders' and entity_id in (select id::text from public.orders where is_demo));
  delete from public.notification_events where entity_type='orders' and entity_id in (select id::text from public.orders where is_demo);
  delete from public.payment_events where order_id in (select id from public.orders where is_demo);
  delete from public.order_status_history where order_id in (select id from public.orders where is_demo);
  insert into public.product_stock_movements(product_variant_id,type,quantity,notes)
  select product_variant_id,'devolucion',-sum(quantity),'Restablecimiento de datos demo'
  from public.product_stock_movements where order_id in (select id from public.orders where is_demo)
  group by product_variant_id having sum(quantity)<0;
  delete from public.stock_reservations where order_id in (select id from public.orders where is_demo);
  delete from public.order_items where order_id in (select id from public.orders where is_demo);
  delete from public.orders where is_demo;
  get diagnostics removed = row_count;
  insert into public.audit_logs(actor_id,action,entity_type,new_data) values ((select auth.uid()),'demo.reset','demo',jsonb_build_object('orders_removed',removed));
  return removed;
end$$;
revoke all on function public.reset_demo_data() from public;
grant execute on function public.reset_demo_data() to authenticated;
