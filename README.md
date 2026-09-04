# Obrador Base

Plantilla técnica reutilizable para el portal de un obrador artesanal (catálogo, reservas, Plan de Pan, puntos de recogida, panel de administración). Toda la identidad de marca de un cliente concreto (nombre, colores, tipografía, contacto, textos e imágenes) se configura desde el admin, no en el código. La interfaz pública está escrita en español de España.

## Requisitos

- Node.js 22 LTS
- npm 10 o superior

## Preparar una demo nueva

```bash
npm install
npm run create-demo
```

`create-demo` pregunta el nombre del cliente, slug, ciudad, preset y colores, y escribe esos valores como configuración inicial en `.env.local`. No crea ni conecta ningún servicio externo (Supabase, Stripe, Resend, Vercel): eso sigue siendo un paso manual, descrito más abajo.

## Instalación manual

```bash
npm install
cp .env.example .env.local
```

Rellena las variables de Supabase para poder autenticarte. Nunca subas secretos ni ficheros `.env*` reales al repositorio. `SUPABASE_SERVICE_ROLE_KEY` es exclusivamente de servidor.

## Desarrollo

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:3000` por defecto.

## Calidad y producción

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
```

## Estructura básica

```text
src/app/       App Router: layout, páginas y estilos globales
src/lib/       Configuración y utilidades compartidas
src/config/    Valores de fábrica (fallback) de marca y feature flags
public/        Activos estáticos y marcadores de posición de marca
scripts/       Scripts de utilidad (create-demo, validación de backups)
supabase/      Migraciones SQL y tests de base de datos
docs/          Documentación de producto, diseño e implementación
```

## Personalización de marca (sin tocar código)

Con Supabase conectado y las migraciones aplicadas, toda la identidad del cliente se gestiona desde `/admin/configuracion`:

- **`/configuracion/inicio`** — asistente de puesta en marcha: repasa los pasos necesarios para preparar la demo de un cliente nuevo y enlaza a cada pantalla real.
- **`/configuracion/marca`** — nombre, logo, colores, tipografía, contacto, localización, textos institucionales e imágenes.
- **`/configuracion/funcionalidades`** — activa o desactiva módulos (catálogo, pedidos online, pagos, suscripciones, inventario, etc.), respetando las dependencias entre ellos.
- **`/configuracion/legal`** — datos del titular para Aviso legal y Privacidad.

En tiempo de ejecución, `getBrandSettings()` (`src/lib/brand/get-brand-settings.ts`) combina lo guardado en la tabla `app_settings` (claves `marca.*` y `features.*`) con los valores de fábrica de `src/config/`. Las variables `NEXT_PUBLIC_*` de `.env.example` solo actúan como semilla inicial — no como fuente de verdad — una vez el proyecto tiene un Supabase conectado.

## Supabase y autenticación

El proyecto utiliza únicamente los clientes oficiales `@supabase/supabase-js` y `@supabase/ssr`. La sesión se mantiene en cookies por el cliente SSR y se renueva a través de `src/proxy.ts`. La identidad y autorización en el servidor se confirman con Supabase Auth.

Variables necesarias:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

En el panel de Supabase, añade las URLs exactas de `/auth/callback` (desarrollo, preview y producción) a la lista de Redirect URLs. Activa la confirmación de email y configura los límites de Auth/CAPTCHA adecuados antes de producción.

### Desarrollo local y migraciones

Requiere Docker en ejecución:

```bash
npm run supabase:start
npm run db:reset
npm run test:db
```

`db:reset` aplica todas las migraciones y después `supabase/seed.sql`. El seed no crea usuarios, credenciales ni datos comerciales reales.

Para un proyecto remoto ya conectado (`npx supabase link`), aplica migraciones nuevas con `npx supabase db push`. Nunca uses `db reset` sobre un proyecto remoto; confirma primero el destino con `npx supabase projects list`.

### Roles y primer propietario

Cada cuenta nueva recibe el rol `customer`. Los roles administrativos son `owner`, `admin`, `operator` y `pickup_manager`; los permisos de la interfaz están centralizados en `src/lib/auth/permissions.ts` y reforzados por RLS.

Para crear el primer `owner`, registra y confirma primero una cuenta normal. Después, en el SQL Editor del proyecto, con privilegios administrativos:

```sql
begin;
do $$
declare target_user uuid;
begin
  select id into strict target_user from auth.users where email = 'EMAIL_CONFIRMADO_DEL_PROPIETARIO';
  insert into public.user_roles (user_id, role, granted_by)
  values (target_user, 'owner', target_user)
  on conflict (user_id, role) do nothing;
  insert into public.audit_logs (actor_id, action, entity_type, entity_id, new_data)
  values (target_user, 'role.assigned.bootstrap', 'user_role', target_user::text, '{"role":"owner"}'::jsonb);
end $$;
commit;
```

No guardes el email real en el repositorio. A partir de entonces, las asignaciones y retiradas de rol se hacen desde `/admin` por un `owner` ya existente.

### Datos de demostración

`supabase/migrations/*_demo_mode.sql` y `*_demo_data.sql` siembran un catálogo, un punto de recogida y una suscripción de ejemplo, todos marcados `is_demo = true`, con datos ficticios (`example.invalid`, direcciones "Demo"). `/admin/configuracion/marca/restaurar` permite volver a la identidad genérica de la plantilla sin perder datos reales.

## Documentación

Las decisiones de producto originales están en [`docs/`](./docs/).

## Vercel

El proyecto usa la configuración estándar de Next.js. El Root Directory debe permanecer en la raíz del repositorio (donde está `package.json`); el comando de build es `npm run build`. Cada demo/cliente requiere su propio proyecto Vercel con sus propias variables de entorno (Supabase, Stripe, Resend) — no se comparten entre clientes.
