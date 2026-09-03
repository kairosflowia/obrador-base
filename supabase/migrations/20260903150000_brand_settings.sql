-- FASE 10: personalización de marca desde /admin/configuracion/marca.
-- Bucket público de assets de marca + claves app_settings (namespace "marca.")
-- sembradas con los valores de fábrica del template. Todo editable en runtime
-- por el owner; los defaults aquí sirven de base para "Restaurar configuración
-- demo" (que borra las filas y deja caer el código a sus propios fallbacks).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brand-assets',
  'brand-assets',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml', 'image/x-icon']
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy brand_storage_public_read on storage.objects for select
  to anon, authenticated using (bucket_id = 'brand-assets');

create policy brand_storage_owner_insert on storage.objects for insert
  to authenticated with check (
    bucket_id = 'brand-assets'
    and app_private.has_role('owner')
    and name ~ '^brand/[a-z0-9_-]+-[0-9]+\.(jpe?g|png|webp|avif|svg|ico)$'
  );

create policy brand_storage_owner_update on storage.objects for update
  to authenticated using (bucket_id = 'brand-assets' and app_private.has_role('owner'))
  with check (bucket_id = 'brand-assets' and app_private.has_role('owner'));

create policy brand_storage_owner_delete on storage.objects for delete
  to authenticated using (bucket_id = 'brand-assets' and app_private.has_role('owner'));

insert into public.app_settings (key, value, description, is_public) values
  -- Identidad
  ('marca.brand_name', '"OBRADOR BASE"'::jsonb, 'Nombre del obrador', true),
  ('marca.brand_short_name', '"OBRADOR"'::jsonb, 'Nombre corto del obrador', true),
  ('marca.brand_tagline', '"Pan artesanal, hecho con tiempo"'::jsonb, 'Tagline de marca', true),
  ('marca.brand_logo', '"/brand/logo/logo.svg"'::jsonb, 'Logo principal', true),
  ('marca.brand_icon', '"/icon"'::jsonb, 'Favicon / icono', true),
  ('marca.brand_apple_icon', '"/apple-icon"'::jsonb, 'Icono para iOS', true),

  -- Colores editables
  ('marca.color_primary', '"#b97844"'::jsonb, 'Color principal', true),
  ('marca.color_secondary', '"#ede8dc"'::jsonb, 'Color secundario', true),
  ('marca.color_background', '"#f5f1e8"'::jsonb, 'Color de fondo', true),
  ('marca.color_accent', '"#6f7b52"'::jsonb, 'Color de acento', true),

  -- Tipografía (ids de FONT_OPTIONS, no CSS crudo)
  ('marca.font_display', '"fraunces"'::jsonb, 'Tipografía de títulos', true),
  ('marca.font_body', '"inter"'::jsonb, 'Tipografía de texto', true),

  -- Contacto / negocio
  ('marca.business_email', '""'::jsonb, 'Email de contacto', true),
  ('marca.business_phone', '""'::jsonb, 'Teléfono de contacto', true),
  ('marca.business_whatsapp', '""'::jsonb, 'WhatsApp', true),
  ('marca.business_instagram', '""'::jsonb, 'Instagram', true),
  ('marca.business_address', '""'::jsonb, 'Dirección', true),
  ('marca.business_city', '""'::jsonb, 'Ciudad', true),
  ('marca.business_province', '""'::jsonb, 'Provincia', true),
  ('marca.business_postal_code', '""'::jsonb, 'Código postal', true),
  ('marca.business_country', '"España"'::jsonb, 'País', true),

  -- Imágenes de contenido
  ('marca.image_hero', '"/brand/hero/hero-placeholder.svg"'::jsonb, 'Imagen del hero', true),
  ('marca.image_obrador', '"/brand/obrador/obrador-placeholder.svg"'::jsonb, 'Imagen del obrador', true),
  ('marca.image_obrador_process', '"/brand/obrador/obrador-placeholder.svg"'::jsonb, 'Imagen del proceso del obrador', true),
  ('marca.image_team', '"/brand/team/team-placeholder.svg"'::jsonb, 'Imagen del equipo', true),
  ('marca.image_institutional', '"/brand/institutional/institutional-placeholder.svg"'::jsonb, 'Imagen institucional', true),
  ('marca.image_subscriptions', '"/brand/institutional/institutional-placeholder.svg"'::jsonb, 'Imagen de suscripciones', true),
  ('marca.image_social', '"/brand/social/social-placeholder.svg"'::jsonb, 'Imagen Open Graph', true),

  -- SEO
  ('marca.seo_title', '"Obrador artesanal"'::jsonb, 'Título SEO', true),
  ('marca.seo_description', '"Pan artesanal elaborado en pequeñas tandas."'::jsonb, 'Descripción SEO', true),

  -- Textos: hero
  ('marca.content_hero_title', '"Pan artesanal, cada día"'::jsonb, 'Hero: título', true),
  ('marca.content_hero_description', '"Elaboramos pan en pequeñas tandas, con buenos ingredientes y el tiempo que necesita."'::jsonb, 'Hero: subtítulo', true),

  -- Textos: obrador
  ('marca.content_obrador_intro_title', '"El obrador"'::jsonb, 'Obrador: título', true),
  ('marca.content_obrador_intro_description', '"Aquí se mezclan ingredientes sencillos, trabajo diario y el tiempo que cada masa necesita."'::jsonb, 'Obrador: descripción', true),
  ('marca.content_obrador_cta_title', '"El pan empieza mucho antes de abrir la puerta."'::jsonb, 'Obrador: título de cierre', true),

  -- Textos: nosotros
  ('marca.content_nosotros_intro_title', '"Nosotros"'::jsonb, 'Nosotros: título', true),
  ('marca.content_nosotros_intro_description', '"Somos un pequeño equipo dedicado a hacer pan artesanal cada día."'::jsonb, 'Nosotros: descripción', true),
  ('marca.content_nosotros_values_title', '"Lo que sostiene nuestro trabajo"'::jsonb, 'Nosotros: título de valores', true),
  ('marca.content_nosotros_values_description', '"El buen pan también depende de las decisiones que se toman antes y después de hornear."'::jsonb, 'Nosotros: descripción de valores', true),
  ('marca.content_nosotros_cta_title', '"Hacemos solo lo que podemos hacer bien."'::jsonb, 'Nosotros: título de cierre', true),
  ('marca.content_nosotros_cta_description', '"Cada tanda recibe la atención que merece."'::jsonb, 'Nosotros: descripción de cierre', true),

  -- Textos: reserva y recoge
  ('marca.content_reservation_seo_title', '"Reserva y recoge"'::jsonb, 'Reserva y recoge: título', true),
  ('marca.content_reservation_seo_description', '"Elige el pan disponible, completa tu pedido y recógelo en el punto que prefieras."'::jsonb, 'Reserva y recoge: descripción', true),

  -- Textos: plan de pan
  ('marca.content_subscriptions_name', '"Plan de Pan"'::jsonb, 'Nombre del plan de suscripción', true),
  ('marca.content_subscriptions_intro_title', '"Tu pan, con la frecuencia que elijas"'::jsonb, 'Plan de Pan: título', true),
  ('marca.content_subscriptions_intro_description', '"Configura una cesta habitual y nosotros reservaremos cada entrega para ti."'::jsonb, 'Plan de Pan: descripción', true),

  -- Textos: newsletter
  ('marca.content_newsletter_title', '"Te contamos lo que sale del horno"'::jsonb, 'Newsletter: título', true),
  ('marca.content_newsletter_description', '"Nuevos panes, fechas y noticias del obrador. Sin ruido y con baja en cualquier momento."'::jsonb, 'Newsletter: descripción', true),

  -- Textos: footer
  ('marca.content_footer_description', '"Pan artesanal, hecho entre manos y tiempo."'::jsonb, 'Footer: descripción', true),
  ('marca.content_footer_legal_name', '""'::jsonb, 'Footer: nombre legal', true),

  -- Arrays estructurados
  ('marca.content_obrador_process', '[
    {"number":"01","icon":"starter","title":"La masa madre","description":"Harina y agua que fermentan y alimentamos cada día."},
    {"number":"02","icon":"time","title":"La fermentación","description":"Después de amasar, esperamos y dejamos que la masa marque el ritmo."},
    {"number":"03","icon":"oven","title":"El horno","description":"Formamos cada pieza y la horneamos hasta conseguir su corteza y su miga."},
    {"number":"04","icon":"grain","title":"La rutina","description":"Amasar, reposar, formar, hornear y volver a empezar."}
  ]'::jsonb, 'Obrador: pasos del proceso', true),

  ('marca.content_nosotros_values_items', '[
    {"title":"Tradición útil","description":"Conservamos las técnicas que aportan calidad y sentido al proceso.","tone":"terracotta"},
    {"title":"Ingredientes honestos","description":"Cada ingrediente tiene una función y un origen que podemos explicar.","tone":"yellow"},
    {"title":"Tiempo necesario","description":"Respetamos el ritmo de la masa sin buscar atajos.","tone":"green"},
    {"title":"Comunidad cercana","description":"Un obrador existe gracias a quienes trabajan, colaboran y vuelven.","tone":"blue"}
  ]'::jsonb, 'Nosotros: valores', true),

  ('marca.content_home_craft_features', '[
    {"icon":"starter","title":"Masa madre viva","description":"La cuidamos cada día para aportar sabor y carácter a cada pan."},
    {"icon":"time","title":"Fermentación lenta","description":"Damos a cada masa el tiempo necesario para desarrollar aroma y textura."},
    {"icon":"grain","title":"Harinas seleccionadas","description":"Elegimos harinas de calidad y moliendas que respetan el grano."},
    {"icon":"craft","title":"Oficio artesanal","description":"Amasamos, formamos y horneamos en pequeñas tandas."}
  ]'::jsonb, 'Inicio: características del oficio', true),

  ('marca.content_subscriptions_steps', '[
    {"icon":"grain","title":"Elige tu pan","description":"Monta una cesta con los panes que quieres recibir habitualmente."},
    {"icon":"calendar","title":"Define tu frecuencia","description":"Escoge el ritmo que mejor encaje en tu rutina."},
    {"icon":"package","title":"Recógelo sin volver a pedir","description":"Prepararemos tu cesta automáticamente para el punto de recogida elegido."}
  ]'::jsonb, 'Plan de Pan: pasos', true)
on conflict (key) do nothing;
