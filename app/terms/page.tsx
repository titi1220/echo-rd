export const metadata = { title: "Términos" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black tracking-tight text-civic">Términos de uso</h1>
      <div className="mt-6 grid gap-5 leading-7 text-slate-700">
        <p>Echo RD es una plataforma cívica de apoyo y difusión. No reemplaza a la Policía Nacional, al 911, al Ministerio Público ni a ninguna autoridad competente.</p>
        <p>Al enviar información, confirmas que actúas de buena fe y autorizas su revisión. La publicación puede ser rechazada, corregida o archivada por seguridad.</p>
        <p>El uso indebido, datos falsos o contenido que ponga en riesgo a una persona puede resultar en bloqueo y reporte a las autoridades.</p>
      </div>
    </main>
  );
}
