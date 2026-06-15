import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contato | BuscaCentral',
  description: 'Entre em contato com a equipe do BuscaCentral. Dúvidas, sugestões ou problemas técnicos.',
};

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Fale Conosco</h1>
            <p className="text-lg text-slate-600">
              Estamos aqui para ajudar! Se você tem alguma dúvida, sugestão de ferramenta, ou encontrou algum problema técnico, não hesite em nos contatar.
            </p>
          </header>

          <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">E-mail Principal</h2>
              <p className="text-slate-600 mb-4">Nossa equipe responde em até 48 horas úteis.</p>
              <a href="mailto:contato@buscacentral.com.br" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
                contato@buscacentral.com.br
              </a>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3>Parcerias e Anúncios</h3>
              <p>
                Se você tem interesse em anunciar no BuscaCentral ou propor uma parceria comercial, envie um e-mail com o assunto <strong>[Parceria]</strong>.
              </p>

              <h3>Problemas Técnicos</h3>
              <p>
                Encontrou algum bug ou uma calculadora está retornando um valor incorreto? Envie um e-mail detalhando qual ferramenta você estava usando e, se possível, anexe uma captura de tela. O assunto deve ser <strong>[Suporte Técnico]</strong>.
              </p>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-200 text-center">
              <Link href="/" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar para a Página Inicial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
