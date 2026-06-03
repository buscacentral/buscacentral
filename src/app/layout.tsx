import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BuscaCentral — Ferramentas Online Gratuitas",
    template: "%s | BuscaCentral",
  },
  description:
    "Central de ferramentas online gratuitas do Brasil. Gerador de CPF, CNPJ, consulta de CEP, cotações e muito mais. Sem cadastro, sem custo.",
  keywords: [
    "gerador de cpf",
    "validador de cpf",
    "gerador de cnpj",
    "busca cep",
    "tabela fipe",
    "cotação dólar",
    "ferramentas online",
  ],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "BuscaCentral — Ferramentas Online Gratuitas",
    description:
      "Central de ferramentas online gratuitas do Brasil. Gerador de CPF, CNPJ, consulta de CEP, cotações e muito mais.",
    url: "https://buscacentral.com.br",
    siteName: "BuscaCentral",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Header />
        <AdPlaceholder position="top" />
        <main className="flex-1">{children}</main>
        <AdPlaceholder position="bottom" />
        <Footer />
      </body>
    </html>
  );
}
