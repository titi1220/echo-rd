import { LoginForm } from "@/app/admin/login/LoginForm";

export const metadata = {
  title: "Acceso administrativo"
};

export default function AdminLoginPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-black uppercase tracking-wide text-alert">Acceso seguro</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-civic">Panel Echo RD</h1>
      <p className="mt-3 leading-7 text-slate-600">Inicia sesion con una cuenta autorizada en Supabase Auth y registrada en la tabla `admins`.</p>
      <LoginForm />
    </main>
  );
}
