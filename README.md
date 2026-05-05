# Echo RD

Plataforma full-stack profesional para personas desaparecidas en Republica Dominicana.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase database, auth, storage
- Vercel-ready deployment

## Included

- Pagina principal con busqueda, filtro por provincia, casos urgentes, casos recientes, historias de localizacion, recursos y footer
- Directorio de casos activos
- Paginas dinamicas en `/cases/[slug]`
- SEO y metadata social para cada caso
- Acciones de WhatsApp, Facebook, copiar enlace y afiche imprimible
- Formulario multi-paso para reportar personas desaparecidas
- Formularios privados para pistas y reportes
- Pagina de casos localizados
- Contacto, privacidad, terminos y solicitud de correccion o retiro
- Panel administrativo para revision de casos, pistas, reportes, analitica, actividad, recursos y roles
- Esquema Supabase con politicas RLS en `supabase/schema.sql`
- Seis registros realistas marcados como `DATOS DEMO`

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment values:

```bash
cp .env.example .env.local
```

3. Add Supabase keys in `.env.local`.

4. Run the development server:

```bash
npm run dev
```

## Supabase setup

Run `supabase/schema.sql` in the Supabase SQL editor. The script creates the database tables and attempts to create these storage buckets:

- `case-photos`
- `tip-media`
- `sighting-media`

Keep `tip-media` and `sighting-media` private. Public pages must never expose submitter identity.

If the SQL editor reports that `storage.buckets` is unavailable, create the buckets manually in Supabase Storage with the same names.

To create your first admin:

1. Go to Supabase Auth > Users and create a user.
2. Copy that user's UUID.
3. Insert that UUID into `public.admins`:

```sql
insert into public.admins (id, email, role)
values ('USER_UUID_HERE', 'admin@example.com', 'super_admin');
```

Admin login is available at `/admin/login`. The `/admin` route requires a Supabase session when Supabase env vars are configured.

Once Supabase environment variables are set, the app uses Supabase automatically for:

- Homepage public cases and resources
- Active cases directory
- Dynamic case pages
- Found/localized cases
- Printable case afiches
- Admin dashboard case/report/resource data
- New missing-person reports inserted as `pending`
- Private tips inserted into `tips`
- Private reports inserted into `sightings`
- Case photo upload to `case-photos`
- Private tip/report media upload to `tip-media` and `sighting-media`
- Admin moderation actions for approving, marking urgent, marking found, rejecting, and reviewing reports

If Supabase variables are missing or a query fails, the app falls back to demo data so local development and Vercel preview deployments still work.

## Vercel deployment

This project includes `vercel.json`. Vercel will run:

```bash
npm run build
```

That command runs the standard Next.js production build. Missing Supabase/CAPTCHA values are allowed so the demo site can deploy before production services are connected.

Set these variables in Vercel Project Settings > Environment Variables:

```bash
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_CAPTCHA_SITE_KEY=your-captcha-site-key
CAPTCHA_SECRET_KEY=your-captcha-secret-key
```

Required before public launch:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

For preview deployments, the app can fall back to Vercel's automatic `VERCEL_URL`, but set `NEXT_PUBLIC_SITE_URL` for the final production domain.

Recommended before launch:

- `NEXT_PUBLIC_CAPTCHA_SITE_KEY`
- `CAPTCHA_SECRET_KEY`

Do not prefix `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_`; it must stay server-only.

## Production checks

Run these before deployment:

```bash
npm run lint
npm run typecheck
npm run build
```

To test the exact Vercel build command locally, provide environment variables and run:

```bash
npm run vercel-build
```

## Production hardening checklist

- Replace the demo CAPTCHA placeholder with a real Turnstile widget on public forms.
- Add Vercel KV, Upstash, or Supabase Edge Function rate limiting.
- Add duplicate detection workflow for pending cases.
- Expand admin pages for editing full case details and reading private media via signed URLs.
