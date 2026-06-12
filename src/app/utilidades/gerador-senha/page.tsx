import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import GeradorSenhaClient from './GeradorSenhaClient';

export const metadata: Metadata = generateToolMetadata(
  'Gerador de Senha',
  'Gere senhas seguras e aleatórias com letras, números e caracteres especiais. Senhas fortes para sua segurança.',
  '/utilidades/gerador-senha'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Por que você precisa de um Gerador de Senhas Seguras?</h2>
    <p>A segurança digital nunca foi tão importante. Senhas curtas, baseadas em datas de nascimento ou em sequências fáceis (como "123456" ou "senha") são descobertas por programas de ataque de hackers em questões de milissegundos. O nosso <strong>Gerador de Senha da BuscaCentral</strong> cria combinações complexas, completamente aleatórias, para proteger suas redes sociais, e-mails e contas bancárias.</p>

    <h3>Como usar o gerador</h3>
    <ol>
      <li><strong>Defina o tamanho:</strong> Recomendamos o uso de pelo menos 12 caracteres (senhas de 16 ou mais são consideradas praticamente inquebráveis hoje).</li>
      <li><strong>Escolha os elementos:</strong> Marque quais tipos de caracteres você deseja incluir (Letras Maiúsculas, Letras Minúsculas, Números e Símbolos/Caracteres Especiais). Para força máxima, selecione todos.</li>
      <li><strong>Gere e copie:</strong> Clique para gerar. Assim que a senha for exibida, clique nela para copiá-la automaticamente para a sua área de transferência.</li>
    </ol>

    <h3>O que torna uma senha forte?</h3>
    <p>A "força" de uma senha é determinada por dois fatores: <strong>Tamanho e Complexidade</strong>. </p>
    <ul>
      <li>Quanto mais longa a senha, maior o número de combinações possíveis. Uma senha de 8 caracteres apenas com letras e números pode ser quebrada em minutos. Uma senha de 16 caracteres com símbolos pode demorar séculos.</li>
      <li>A complexidade vem da mistura de caracteres. Misturar símbolos (@, #, !, ?, etc) quebra o padrão de "palavras de dicionário", que é a técnica de ataque mais comum usada por cibercriminosos.</li>
    </ul>

    <h3>Boas práticas de segurança online</h3>
    <ul>
      <li><strong>Nunca reutilize senhas:</strong> Usar a mesma senha para o e-mail, Instagram e banco é um risco gigantesco. Se um site for invadido, todas as suas contas estarão vulneráveis.</li>
      <li><strong>Use um gerenciador de senhas:</strong> Como é impossível memorizar dezenas de senhas longas e aleatórias, utilize o gerenciador integrado do seu navegador (Google Chrome, Safari) ou aplicativos dedicados como Bitwarden, 1Password ou LastPass.</li>
      <li><strong>Ative a Autenticação em Duas Etapas (2FA):</strong> Sempre que possível, exija um código SMS ou via aplicativo (como Google Authenticator) além da senha.</li>
    </ul>
  </article>
);

const faqItems = [
  {
    question: "O BuscaCentral salva as senhas que eu gero?",
    answer: "Não! A nossa ferramenta processa a geração da senha localmente no seu próprio navegador. A senha não é enviada para os nossos servidores, garantindo 100% de privacidade e segurança."
  },
  {
    question: "Qual o tamanho ideal para uma senha hoje em dia?",
    answer: "Os padrões modernos de segurança cibernética recomendam um mínimo absoluto de 12 caracteres. Para contas críticas (como e-mail principal ou bancos), tente usar de 16 a 20 caracteres."
  },
  {
    question: "Posso usar a mesma senha se ela for muito forte?",
    answer: "Não é recomendado. Mesmo que a senha seja forte contra adivinhações, se o site onde você a usou sofrer um vazamento de banco de dados, sua senha forte será exposta."
  }
];

const relatedTools = [
  {
    title: "Gerador de QR Code",
    url: "/utilidades/gerador-qr-code",
    description: "Crie códigos QR para compartilhar links ou informações de contato rapidamente."
  },
  {
    title: "Validador de CPF",
    url: "/documentos/validador-cpf",
    description: "Valide dígitos verificadores de CPFs e certifique-se de que estão em um formato válido."
  },
  {
    title: "Gerador de Link de WhatsApp",
    url: "/utilidades/whatsapp-link",
    description: "Crie links diretos para conversas de WhatsApp sem precisar salvar o número."
  }
];

export default function GeradorSenha() {
  return (
    <ToolPageLayout
      title="Gerador de Senha"
      description="Crie senhas fortes, seguras e totalmente aleatórias para proteger suas contas online. Escolha o tamanho e os tipos de caracteres."
      ariaLabel="Gerador de senha interativo"
      path="/utilidades/gerador-senha"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <GeradorSenhaClient />
    </ToolPageLayout>
  );
}
