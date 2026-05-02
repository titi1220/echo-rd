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
  console.error("\nMissing required production environment variables:");
  for (const key of missing) {
    console.error(`- ${key}`);
  }
  console.error("\nAdd them in Vercel Project Settings > Environment Variables.");
  console.error("For preview deployments, VERCEL_URL may be used as the site URL fallback.");
  process.exit(1);
}

const missingOptional = optional.filter((key) => !process.env[key]);
if (missingOptional.length > 0) {
  console.warn("\nOptional production environment variables not set:");
  for (const key of missingOptional) {
    console.warn(`- ${key}`);
  }
  console.warn("Public forms will keep using the demo CAPTCHA placeholder until these are configured.\n");
}
