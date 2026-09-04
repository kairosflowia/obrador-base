-- FASE 15: auditoria final white-label. Dos productos del catálogo real
-- llevan el nombre del cliente anterior en su propio nombre/slug
-- ("Rústico Fuerza"/rustico-fuerza, "Semillas Fuerza"/semillas-fuerza),
-- sembrados por 20260808140000_real_product_catalog.sql. Se renombran a
-- algo genérico; no se toca ninguna otra migración histórica (los `case
-- when slug = 'rustico-fuerza' ...` de 20260809110000 siguen siendo
-- correctos como referencia histórica de cuándo se sembró cada descripción,
-- y dejan de aplicar de todas formas tras este UPDATE).

update public.products set name = 'Rústico Clásico', slug = 'rustico-clasico'
where slug = 'rustico-fuerza';

update public.products set name = 'Semillas Artesanas', slug = 'semillas-artesanas'
where slug = 'semillas-fuerza';
