-- FASE 15: auditoria final white-label. Los templates de newsletter
-- sembrados por 20260809160000_newsletter_subscribers.sql tienen "FUERZA"
-- hardcoded en subject/body_html/body_text. renderTemplate() (Fase 15,
-- src/lib/notifications/render.ts) ahora inyecta brand_name/brand_short_name
-- /brand_tagline automáticamente en cualquier plantilla, así que aquí basta
-- con sustituir el texto fijo por {{brand_name}}.
--
-- Un template 'active' es inmutable (protect_active_notification_template,
-- 20260803260000): en vez de un UPDATE directo (que dispara
-- active_template_immutable), se archiva la versión 1 y se inserta la
-- versión 2 como la nueva activa, siguiendo el mismo patrón de versionado
-- que ya usa el resto del sistema.

update public.notification_templates
set status = 'archived'
where key in ('newsletter-confirm-request', 'newsletter-welcome') and status = 'active';

insert into public.notification_templates (key, name, subject_template, body_html_template, body_text_template, status, version, required_variables, locale)
values
(
  'newsletter-confirm-request', 'Confirmación de suscripción', 'Confirma tu suscripción a {{brand_name}}',
  '<h1>Ya casi está</h1><p>Confirma que quieres recibir novedades de {{brand_name}} por correo.</p><p><a href="{{confirm_url}}">Confirmar mi suscripción</a></p><p>Este enlace caduca en 48 horas. Si no has sido tú, ignora este correo.</p>',
  'Confirma tu suscripción a {{brand_name}}: {{confirm_url}} (caduca en 48 horas). Si no has sido tú, ignora este correo.',
  'active', 2, array['confirm_url'], 'es-ES'
),
(
  'newsletter-welcome', 'Bienvenida a la newsletter', '¡Bienvenido/a a {{brand_name}}!',
  '<h1>¡Gracias! Ya formas parte de la lista de {{brand_name}}.</h1><p>Te contaremos lo que sale del horno.</p><p><a href="{{unsubscribe_url}}">Darme de baja</a></p>',
  '¡Gracias! Ya formas parte de la lista de {{brand_name}}. Darte de baja: {{unsubscribe_url}}',
  'active', 2, array['unsubscribe_url'], 'es-ES'
);
