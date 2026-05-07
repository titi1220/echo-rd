export const metadata = { title: "Privacidad" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black tracking-tight text-civic">Politica de privacidad</h1>
      <div className="mt-6 grid gap-5 leading-7 text-slate-700">
        <p>Echo RD protege la identidad de familiares, informantes y personas que envían reportes. La información privada no se publica.</p>
        <p>Los datos sensibles se almacenan con acceso restringido para administradores autorizados. Las pistas y reportes se revisan antes de cualquier acción pública.</p>
        <p>Las imagenes y videos de pistas se guardan en almacenamiento privado. Echo RD no vende datos personales.</p>
      </div>
    </main>
  );
}
