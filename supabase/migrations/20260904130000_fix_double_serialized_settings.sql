-- Corrige un bug de doble/triple serialización: las server actions de
-- /admin/configuracion/marca (y legal, funcionalidades) hacían
-- JSON.stringify(value) antes de pasar el valor a supabase-js, que ya
-- serializa el payload completo a JSON al hacer la petición HTTP. El
-- resultado quedaba como una cadena JSON dentro de otra cadena JSON (ej.
-- '"\"My Bakery\""' en vez de '"My Bakery"'), visible como comillas
-- literales en el texto mostrado en el portal. El código ya está corregido
-- (ya no hace JSON.stringify manual); esta migración repara los valores que
-- quedaron mal guardados mientras el bug estuvo activo.
--
-- (value #>> '{}')::jsonb reparsea una vez el contenido de un jsonb string
-- como jsonb: quita exactamente una capa de serialización de más.

update public.app_settings set value = (value #>> '{}')::jsonb
where key in (
  'marca.brand_name',
  'marca.business_email',
  'marca.business_phone',
  'marca.business_country'
) and jsonb_typeof(value) = 'string';

-- marca.brand_tagline quedó con una capa extra (triple serialización):
-- se repara dos veces.
update public.app_settings set value = ((value #>> '{}')::jsonb #>> '{}')::jsonb
where key = 'marca.brand_tagline' and jsonb_typeof(value) = 'string';

-- marca.brand_short_name no tenía un valor real del cliente: el valor
-- guardado ("Test Value No Quotes") era una prueba de diagnóstico de este
-- mismo bug, no un dato introducido por el usuario. Se restaura al valor
-- de fábrica (mismo que trae el seed de 20260903150000_brand_settings.sql).
update public.app_settings set value = '"OBRADOR"'::jsonb
where key = 'marca.brand_short_name';
