import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MicrosoftClarity from "@/components/MicrosoftClarity";

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
    icon: "/favicon.ico",
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
  twitter: {
    card: "summary_large_image",
    title: "BuscaCentral — Ferramentas Online Gratuitas",
    description:
      "Central de ferramentas online gratuitas do Brasil. Gerador de CPF, CNPJ, consulta de CEP, cotações e muito mais.",
  },
  alternates: {
    canonical: "https://buscacentral.com.br",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="BuscaCentral" />
        <GoogleAnalytics />
        <MicrosoftClarity />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
        >
          Pular para o conteúdo principal
        </a>

        <Header />

        <div className="ads-wrapper" data-ad-position="top" style={{ minHeight: '90px' }}>
          <AdPlaceholder position="top" />
        </div>

        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>

        <div className="ads-wrapper" data-ad-position="bottom" style={{ minHeight: '90px' }}>
          <AdPlaceholder position="bottom" />
        </div>

        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
