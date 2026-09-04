-- FASE 15: auditoria final white-label. Los templates de newsletter
-- sembrados por 20260809160000_newsletter_subscribers.sql tienen "FUERZA"
-- hardcoded en subject/body_html/body_text. renderTemplate() (Fase 15,
-- src/lib/notifications/render.ts) ahora inyecta brand_name/brand_short_name
-- /brand_tagline automáticamente en cualquier plantilla, así que aquí basta
-- con sustituir el texto fijo por {{brand_name}}.

update public.notification_templates set
  subject_template = 'Confirma tu suscripción a {{brand_name}}',
  body_html_template = '<h1>Ya casi está</h1><p>Confirma que quieres recibir novedades de {{brand_name}} por correo.</p><p><a href="{{confirm_url}}">Confirmar mi suscripción</a></p><p>Este enlace caduca en 48 horas. Si no has sido tú, ignora este correo.</p>',
  body_text_template = 'Confirma tu suscripción a {{brand_name}}: {{confirm_url}} (caduca en 48 horas). Si no has sido tú, ignora este correo.'
where key = 'newsletter-confirm-request';

update public.notification_templates set
  subject_template = '¡Bienvenido/a a {{brand_name}}!',
  body_html_template = '<h1>¡Gracias! Ya formas parte de la lista de {{brand_name}}.</h1><p>Te contaremos lo que sale del horno.</p><p><a href="{{unsubscribe_url}}">Darme de baja</a></p>',
  body_text_template = '¡Gracias! Ya formas parte de la lista de {{brand_name}}. Darte de baja: {{unsubscribe_url}}'
where key = 'newsletter-welcome';
