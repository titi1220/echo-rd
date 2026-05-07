import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: "Echo RD | Personas desaparecidas en República Dominicana",
    template: "%s | Echo RD"
  },
  description: "Plataforma cívica para reportar, compartir y apoyar búsquedas de personas desaparecidas en República Dominicana.",
  metadataBase: new URL(absoluteUrl()),
  openGraph: {
    title: "Echo RD",
    description: "Cada minuto cuenta. Alertas y reportes de personas desaparecidas en República Dominicana.",
    type: "website",
    locale: "es_DO"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-DO">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
