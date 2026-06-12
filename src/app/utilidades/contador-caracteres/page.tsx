import type { Metadata } from 'next';
import ToolPageLayout, { generateToolMetadata } from '@/components/ToolPageLayout';
import ContadorCaracteresClient from './ContadorCaracteresClient';

export const metadata: Metadata = generateToolMetadata(
  'Contador de Caracteres',
  'Conte caracteres, palavras, linhas e parágrafos em qualquer texto. Ideal para redação e SEO.',
  '/utilidades/contador-caracteres'
);

const seoContent = (
  <article className="prose prose-gray max-w-none">
    <h2>Facilite sua redação com o Contador de Caracteres e Palavras</h2>
    <p>O <strong>Contador de Caracteres da BuscaCentral</strong> é uma ferramenta essencial para profissionais de marketing, redatores, estudantes e desenvolvedores. Com ele, você descobre instantaneamente o tamanho exato do seu texto, seja para preencher um formulário rígido ou adaptar um post para as redes sociais.</p>

    <h3>O que a ferramenta analisa?</h3>
    <p>Assim que você cola ou digita seu texto, nós calculamos simultaneamente:</p>
    <ul>
      <li><strong>Caracteres (com espaços):</strong> A contagem total de todos os símbolos, letras, números e espaços em branco. Esse é o limite padrão exigido pela maioria dos sistemas (como o limite do X/Twitter ou os limites de SMS).</li>
      <li><strong>Caracteres (sem espaços):</strong> Útil para tradutores e redatores que cobram por toque/símbolo real digitado, excluindo os espaços em branco.</li>
      <li><strong>Palavras:</strong> Essencial para redatores web, estudantes universitários e jornalistas que precisam atingir uma meta mínima ou máxima de extensão de texto.</li>
      <li><strong>Linhas:</strong> Quantifica as quebras de linha (parágrafos ou listas) do seu conteúdo.</li>
    </ul>

    <h3>Limites de caracteres nas principais plataformas</h3>
    <p>Saber o limite exato de cada rede social ajuda a evitar que a sua mensagem seja cortada no meio. Confira os limites atualizados:</p>
    <ul>
      <li><strong>X (antigo Twitter):</strong> 280 caracteres para contas gratuitas (e até 10.000 para assinantes Premium).</li>
      <li><strong>Instagram (Legenda):</strong> Até 2.200 caracteres, mas é recomendado manter as partes mais importantes nas primeiras 2 linhas antes do botão "ver mais".</li>
      <li><strong>Instagram (Bio):</strong> Máximo de 150 caracteres. Seja extremamente direto.</li>
      <li><strong>LinkedIn (Postagem):</strong> Limite generoso de até 3.000 caracteres, ideal para textos mais aprofundados.</li>
      <li><strong>SEO (Google Title Tag):</strong> Recomenda-se entre 50 e 60 caracteres para que o título do seu site não seja cortado nos resultados de busca.</li>
      <li><strong>SEO (Meta Description):</strong> O ideal é manter entre 150 e 160 caracteres.</li>
    </ul>

    <h3>Benefícios de usar o nosso contador</h3>
    <p>Diferente de abrir o Microsoft Word ou o Google Docs apenas para contar as palavras de uma frase curta, nossa ferramenta roda direto no navegador de forma instantânea. Além disso, nós garantimos a sua privacidade: o texto digitado é analisado localmente no seu computador e não é salvo em nossos servidores.</p>
  </article>
);

const faqItems = [
  {
    question: "O contador de palavras funciona para outros idiomas?",
    answer: "Sim! A ferramenta separa as palavras por espaços e pontuações, funcionando perfeitamente para português, inglês, espanhol e a maioria dos idiomas ocidentais."
  },
  {
    question: "A pontuação conta como caractere?",
    answer: "Sim. Pontos, vírgulas, acentos, símbolos matemáticos e emojis ocupam espaço no texto e são contabilizados como caracteres pelas redes sociais e pelo nosso contador."
  },
  {
    question: "Meus textos confidenciais estão seguros?",
    answer: "Absolutamente. O processamento do texto é feito utilizando JavaScript diretamente na aba do seu navegador. Nenhum trecho do seu texto é enviado ou armazenado na internet."
  }
];

const relatedTools = [
  {
    title: "Comparador de Textos",
    url: "/utilidades/comparador-textos",
    description: "Cole duas versões de um texto e descubra rapidamente o que foi adicionado ou deletado."
  },
  {
    title: "Gerador de QR Code",
    url: "/utilidades/gerador-qr-code",
    description: "Transforme parágrafos longos ou links em uma imagem de QR Code para facilitar o compartilhamento."
  },
  {
    title: "Gerador de Senha",
    url: "/utilidades/gerador-senha",
    description: "Gere senhas com um número exato de caracteres exigidos por sistemas bancários ou corporativos."
  }
];

export default function ContadorCaracteres() {
  return (
    <ToolPageLayout
      title="Contador de Caracteres"
      description="Conte instantaneamente caracteres, palavras e linhas de qualquer texto. Ferramenta gratuita ideal para adaptar textos para redes sociais, SEO e redações."
      ariaLabel="Contador de caracteres interativo"
      path="/utilidades/contador-caracteres"
      seoContent={seoContent}
      faqItems={faqItems}
      relatedTools={relatedTools}
    >
      <ContadorCaracteresClient />
    </ToolPageLayout>
  );
}
