import { provinces } from "@/lib/data";

export const inputClass = "h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-royal focus:ring-4 focus:ring-blue-100";
export const textareaClass = "min-h-28 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-royal focus:ring-4 focus:ring-blue-100";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-civic">
      {label}
      {children}
    </label>
  );
}

export function ProvinceSelect() {
  return (
    <select name="province" className={inputClass} required>
      <option value="">Seleccione provincia</option>
      {provinces.map((province) => <option key={province}>{province}</option>)}
    </select>
  );
}

export function CaptchaNotice() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
      CAPTCHA listo para produccion: conecte `NEXT_PUBLIC_CAPTCHA_SITE_KEY` y valide `captcha_token` en el servidor antes de guardar.
      <input type="hidden" name="captcha_token" value="demo-captcha-token" />
    </div>
  );
}
