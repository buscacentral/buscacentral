import type { Metadata } from 'next';
import ToolPageLayout from '@/components/ToolPageLayout';
import ValidadorEmailClient from './ValidadorEmailClient';

export const metadata: Metadata = {
  title: 'Validador de E-mail: detecta descartável e temporário | BuscaCentral',
  description: 'Valide e-mails e identifique endereços descartáveis e temporários (Mailinator, 10minutemail e outros), erros de sintaxe e de digitação. Grátis e sem cadastro.',
  keywords: [
    'validar email',
    'validador de e-mail',
    'verificador de email',
    'email descartável',
    'email temporário',
    'mailinator',
    'disposable email',
    'email fake',
  ],
  alternates: { canonical: 'https://buscacentral.com.br/utilidades/validador-email' },
};

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Como funciona o Validador de E-mail</h2>
    <p>O <strong>Validador de E-mail da BuscaCentral</strong> faz três verificações ao mesmo tempo: confere a <strong>sintaxe</strong> do endereço (estrutura usuario@dominio.com), sugere correções para <strong>erros de digitação</strong> comuns (como &quot;gmil.com&quot; em vez de &quot;gmail.com&quot;) e identifica se o domínio é de um serviço de <strong>e-mail descartável (temporário)</strong>.</p>

    <h2>O que é um e-mail descartável (temporário)?</h2>
    <p>Um <strong>e-mail descartável</strong> — também chamado de e-mail temporário ou &quot;disposable&quot; — é um endereço gerado para uso rápido e único, geralmente para receber um código de confirmação sem expor o e-mail real do usuário. Esses endereços expiram em minutos ou horas e não servem para um relacionamento de longo prazo com o cliente.</p>
    <p>Serviços conhecidos de e-mail descartável incluem <strong>Mailinator</strong>, <strong>10minutemail</strong>, <strong>Guerrilla Mail</strong>, <strong>YOPmail</strong> e <strong>TempMail</strong>. Quando você digita um endereço desses domínios, a ferramenta acima avisa que se trata de um e-mail descartável.</p>

    <h2>Por que bloquear e-mails descartáveis nos cadastros?</h2>
    <ul>
      <li><strong>Qualidade da base:</strong> e-mails temporários inflam a lista de contatos com endereços que não existirão amanhã, prejudicando métricas e a entregabilidade das suas campanhas.</li>
      <li><strong>Prevenção de abuso:</strong> são muito usados para criar contas falsas, burlar períodos de teste gratuito e fraudar promoções.</li>
      <li><strong>Custo:</strong> ferramentas de e-mail marketing cobram por contato; pagar por endereços descartáveis é desperdício.</li>
    </ul>

    <h2>Como verificar se um e-mail é descartável</h2>
    <p>Basta digitar o endereço no campo acima. Se o domínio constar na nossa lista de serviços de e-mail temporário, você verá o aviso de &quot;descartável&quot;. Todo o processamento acontece no seu navegador — nenhum e-mail é enviado ou armazenado.</p>

    <h3>Validação de sintaxe x existência real</h3>
    <p>É importante entender o limite: a ferramenta confirma se o e-mail é <em>bem formado</em> e se <em>não é descartável</em>, mas não garante que a caixa de entrada exista de fato. A única forma 100% segura de confirmar a existência é enviar um e-mail de confirmação (double opt-in).</p>
  </article>
);

const faqItems = [
  { question: "O validador garante que o e-mail existe?", answer: "Não. A nossa ferramenta realiza uma validação estrutural (Regex) para garantir que a sintaxe está correta, e checa listas conhecidas para evitar erros de digitação (ex: gmil.com) ou e-mails descartáveis. No entanto, sem enviar um e-mail de confirmação, é impossível garantir que a caixa de entrada da pessoa realmente existe ou está ativa." },
  { question: "O que é um e-mail descartável (disposable)?", answer: "São e-mails temporários (como 10minutemail, mailinator) usados apenas para receber mensagens rápidas sem revelar o e-mail real do usuário. Nossa ferramenta avisa se o e-mail pertencer a uma dessas redes, pois empresas geralmente não desejam esse tipo de e-mail em seus cadastros." },
  { question: "Como saber se um e-mail é do Mailinator ou temporário?", answer: "Digite o endereço no validador acima. Se o domínio for de um serviço conhecido de e-mail temporário (como mailinator.com, 10minutemail.com, guerrillamail.com, yopmail.com ou tempmail.com), a ferramenta marcará o e-mail como descartável." },
  { question: "É possível bloquear e-mails descartáveis no meu formulário?", answer: "Sim. A estratégia mais comum é manter uma lista de domínios descartáveis e rejeitar cadastros que a usem, exatamente como esta ferramenta faz. Como novos serviços surgem com frequência, a lista precisa ser atualizada periodicamente." },
];

const relatedTools = [
  { title: "Extrator de E-mails", url: "/utilidades/extrator-emails", description: "Extraia todos os e-mails dentro de um bloco de texto grande." },
  { title: "Formatador de Dados", url: "/utilidades/formatador-dados", description: "Limpe e padronize listas de e-mails, telefones e documentos em lote." },
  { title: "Gerador de Cartão de Crédito", url: "/documentos/gerador-cartao-credito", description: "Gere cartões para usar em testes de desenvolvimento." },
];

export default function ValidadorEmailPage() {
  return (
    <ToolPageLayout
      title="Validador de E-mail"
      description="Verifique a estrutura do e-mail, identifique domínios temporários (descartáveis) como Mailinator e corrija erros de digitação automaticamente."
      ariaLabel="Validador de E-mail interativo"
      path="/utilidades/validador-email"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <ValidadorEmailClient />
    </ToolPageLayout>
  );
}
