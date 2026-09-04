-- FASE 12: /admin/configuracion/funcionalidades. Los overrides de feature
-- flags se guardan en app_settings (namespace "features."); el valor de
-- fábrica de cada clave es el resultado del preset FULL (el más permisivo),
-- consistente con defaultFeatureFlags en feature-config.ts. El env/preset
-- sigue gobernando el middleware (Edge Runtime, no puede leer DB de forma
-- barata); estas claves solo afectan la capa de negocio/UI resuelta vía
-- getBrandSettings().
--
-- Las claves usan snake_case (constraint app_settings_key_check exige
-- minúsculas): "onlineOrders" en TypeScript -> "features.online_orders" aquí.
-- El mapeo vive en src/lib/brand/get-brand-settings.ts (FEATURE_SETTING_KEY).

insert into public.app_settings (key, value, description, is_public) values
  ('features.catalog', 'true'::jsonb, 'Catálogo de productos', true),
  ('features.online_orders', 'true'::jsonb, 'Pedidos online', true),
  ('features.customer_accounts', 'true'::jsonb, 'Cuentas de cliente', true),
  ('features.payments', 'true'::jsonb, 'Pagos con Stripe', true),
  ('features.inventory', 'true'::jsonb, 'Inventario', true),
  ('features.availability', 'true'::jsonb, 'Disponibilidad y capacidad', true),
  ('features.production', 'true'::jsonb, 'Producción', true),
  ('features.pickup_points', 'true'::jsonb, 'Puntos de recogida', true),
  ('features.subscriptions', 'true'::jsonb, 'Plan de Pan (suscripciones)', true),
  ('features.newsletter', 'true'::jsonb, 'Newsletter', true),
  ('features.analytics', 'true'::jsonb, 'Analítica', true),
  ('features.notifications', 'true'::jsonb, 'Notificaciones', true)
on conflict (key) do nothing;
