const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
];

const optional = ["NEXT_PUBLIC_CAPTCHA_SITE_KEY", "CAPTCHA_SECRET_KEY"];

const missing = required.filter((key) => !process.env[key]);

if (!process.env.NEXT_PUBLIC_SITE_URL && !process.env.VERCEL_URL) {
  missing.push("NEXT_PUBLIC_SITE_URL");
}

if (missing.length > 0) {
  console.warn("\nProduction environment variables not set:");
  for (const key of missing) {
    console.warn(`- ${key}`);
  }
  console.warn("\nThe app will deploy with demo data and local fallbacks.");
  console.warn("Add these in Vercel Project Settings > Environment Variables before public launch.");
  console.warn("For preview deployments, VERCEL_URL may be used as the site URL fallback.\n");
}

const missingOptional = optional.filter((key) => !process.env[key]);
if (missingOptional.length > 0) {
  console.warn("\nOptional production environment variables not set:");
  for (const key of missingOptional) {
    console.warn(`- ${key}`);
  }
  console.warn("Public forms will keep using the demo CAPTCHA placeholder until these are configured.\n");
}
