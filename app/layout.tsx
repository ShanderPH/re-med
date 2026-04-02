import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Re-med | Simulador de Aprovação em Residência Médica",
  description:
    "Simule suas chances de aprovação na residência médica. Insira sua nota e descubra sua classificação, em qual chamada seria aprovado e quais instituições poderiam te chamar.",
  keywords: ["residência médica", "simulador", "SUS-SP", "aprovação", "medicina"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#009688",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
