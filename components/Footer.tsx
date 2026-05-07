import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-civic text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <p className="text-xl font-black">Echo RD</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
            Plataforma cívica para difundir alertas, recibir pistas privadas y apoyar esfuerzos de reunificación en República Dominicana.
          </p>
          <p className="mt-4 rounded-xl bg-white/10 p-3 text-xs leading-5 text-blue-50">
            Echo RD no sustituye a la Policía Nacional, 911, Ministerio Público ni otras autoridades competentes. En emergencias, contacte al 911 de inmediato.
          </p>
        </div>
        <div>
          <p className="font-bold">Plataforma</p>
          <div className="mt-3 grid gap-2 text-sm text-blue-100">
            <Link href="/cases">Casos activos</Link>
            <Link href="/report">Reportar caso</Link>
            <Link href="/found-safe">Localizados</Link>
            <Link href="/removal-request">Corrección o retiro</Link>
          </div>
        </div>
        <div>
          <p className="font-bold">Legal</p>
          <div className="mt-3 grid gap-2 text-sm text-blue-100">
            <Link href="/privacy">Privacidad</Link>
            <Link href="/terms">Términos</Link>
            <Link href="/contact">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
