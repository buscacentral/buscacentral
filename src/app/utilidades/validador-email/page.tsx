import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import ValidadorEmailClient from './ValidadorEmailClient';

export const metadata: Metadata = {
  title: 'Validador de E-mail (Sintaxe e Erros de Digitação) | BuscaCentral',
  description: 'Valide endereços de e-mail identificando erros de sintaxe, domínios de e-mails descartáveis e detectando erros de digitação comuns.',
  keywords: ['validar email', 'validador de e-mail', 'verificador de email', 'email fake', 'email temporário'],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/validador-email' },
};

const faqItems = [
  { question: "O validador garante que o e-mail existe?", answer: "Não. A nossa ferramenta realiza uma validação estrutural (Regex) para garantir que a sintaxe está correta, e checa listas conhecidas para evitar erros de digitação (ex: gmil.com) ou e-mails descartáveis. No entanto, sem enviar um e-mail de confirmação, é impossível garantir que a caixa de entrada da pessoa realmente existe ou está ativa." },
  { question: "O que é um e-mail descartável (disposable)?", answer: "São e-mails temporários (como 10minutemail, mailinator) usados apenas para receber mensagens rápidas sem revelar o e-mail real do usuário. Nossa ferramenta avisa se o e-mail pertencer a uma dessas redes, pois empresas geralmente não desejam esse tipo de e-mail em seus cadastros." },
];

const relatedTools = [
  { title: "Gerador de Lorem Ipsum", url: "/utilidades/gerador-lorem-ipsum", description: "Gere textos de marcação para projetos de design." },
  { title: "Gerador de Cartão de Crédito", url: "/documentos/gerador-cartao-credito", description: "Gere cartões para usar em testes de desenvolvimento." },
  { title: "Extrator de E-mails", url: "/utilidades/extrator-emails", description: "Extraia todos os e-mails dentro de um bloco de texto grande." },
];

export default function ValidadorEmailPage() {
  return (
    <ToolPageLayout
      title="Validador de E-mail"
      description="Verifique a estrutura do e-mail, identifique domínios temporários (descartáveis) e corrija erros de digitação automaticamente."
      ariaLabel="Validador de E-mail interativo"
      path="/utilidades/validador-email"
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <ValidadorEmailClient />
    </ToolPageLayout>
  );
}
