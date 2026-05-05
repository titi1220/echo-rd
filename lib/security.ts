import { z } from "zod";

const imageTypes = ["image/jpeg", "image/png", "image/webp"];
const videoTypes = ["video/mp4", "video/quicktime", "video/webm"];

export const publicRateLimit = {
  window: "10 minutes",
  max: 5,
  note: "Use Upstash, Supabase Edge Functions, or Vercel KV in production."
};

export function sanitizeText(value: string) {
  return value.replace(/[<>]/g, "").trim();
}

export function isAllowedUpload(file: File, mode: "image" | "media" = "image") {
  const max = mode === "image" ? 5 * 1024 * 1024 : 25 * 1024 * 1024;
  const allowed = mode === "image" ? imageTypes : [...imageTypes, ...videoTypes];
  return file.size <= max && allowed.includes(file.type);
}

export async function verifyCaptcha(token: string) {
  const secret = process.env.CAPTCHA_SECRET_KEY;
  if (!secret) return true;

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token })
  });

  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return Boolean(result.success);
}

export const urlSchema = z.string().url().max(500).or(z.literal(""));
export const phoneSchema = z.string().min(7).max(30).regex(/^[0-9+()\-\s]+$/);

export const caseSubmissionSchema = z.object({
  full_name: z.string().min(3).max(120).transform(sanitizeText),
  nickname: z.string().max(80).optional(),
  age: z.coerce.number().min(0).max(120),
  gender: z.string().min(1),
  height: z.string().max(30),
  province: z.string().min(2),
  municipality: z.string().min(2).max(100).transform(sanitizeText),
  location_last_seen: z.string().min(5).max(250).transform(sanitizeText),
  date_last_seen: z.string().min(8),
  time_last_seen: z.string().min(3),
  clothing_description: z.string().min(5).max(500).transform(sanitizeText),
  physical_traits: z.string().min(5).max(500).transform(sanitizeText),
  circumstances: z.string().min(10).max(1200).transform(sanitizeText),
  contact_name: z.string().min(3).max(120).transform(sanitizeText),
  phone: phoneSchema,
  whatsapp: phoneSchema,
  email: z.string().email(),
  police_report: z.enum(["yes", "no"]),
  consent: z.literal("on"),
  captcha_token: z.string().min(1, "CAPTCHA requerido")
});

export const tipSchema = z.object({
  message: z.string().min(10).max(2000).transform(sanitizeText),
  sender_name: z.string().max(120).optional(),
  sender_phone: z.string().max(30).optional(),
  whatsapp: z.string().max(30).optional(),
  captcha_token: z.string().min(1, "CAPTCHA requerido")
});

export const sightingSchema = z.object({
  location_text: z.string().min(5).max(250).transform(sanitizeText),
  province: z.string().min(2),
  date_seen: z.string().min(8),
  time_seen: z.string().min(3),
  description: z.string().min(10).max(2000).transform(sanitizeText),
  external_link: urlSchema.optional(),
  maps_link: urlSchema.optional(),
  sender_name: z.string().max(120).optional(),
  sender_phone: z.string().max(30).optional(),
  whatsapp: z.string().max(30).optional(),
  anonymous: z.string().optional(),
  captcha_token: z.string().min(1, "CAPTCHA requerido")
});
