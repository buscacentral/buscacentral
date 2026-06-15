import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

// Mocked articles database for AdSense approval
const articlesData: Record<string, { title: string; content: React.ReactNode; date: string; isoDate: string; category: string; description: string }> = {
  'o-que-e-uuid-e-por-que-e-seguro': {
    title: 'O que é um UUID e por que ele é seguro?',
    date: '15 de Junho, 2026',
    isoDate: '2026-06-15T12:00:00.000Z',
    category: 'Tecnologia',
    description: 'Entenda como funcionam os Identificadores Únicos Universais, por que eles são vitais para o desenvolvimento de software e a probabilidade quase nula de uma colisão.',
    content: (
      <>
        <p>Um <strong>UUID</strong> (<em>Universally Unique Identifier</em>) é uma sequência de caracteres de 128 bits usada para identificar informações de forma única e exclusiva na computação, sem a necessidade de coordenação centralizada. Você provavelmente já viu um UUID, que se parece com algo assim: <code>550e8400-e29b-41d4-a716-446655440000</code>.</p>
        
        <h2>A Matemática por Trás do UUID (Por que não repete?)</h2>
        <p>A força primária do UUID v1 ou v4 reside na sua entropia. Com 128 bits, existem exatamente <code>340.282.366.920.938.463.463.374.607.431.768.211.456</code> combinações possíveis. É um número tão gigantesco que foge da compreensão humana. Para colocar em perspectiva, se você gerasse 1 bilhão de UUIDs por segundo durante os próximos 100 anos, a probabilidade de criar um único UUID duplicado seria de menos de 0.00000000006%.</p>
        
        <h2>Uso Prático em Bancos de Dados e Sistemas Distribuídos</h2>
        <p>Desenvolvedores frequentemente precisam de IDs para entidades como "usuários", "produtos" ou "transações". Tradicionalmente, usava-se IDs incrementais (1, 2, 3...), mas com o advento dos microsserviços e da computação em nuvem, bancos de dados distribuídos não podem sincronizar de forma fácil e barata qual foi o "último número gerado" entre servidores na Ásia, Europa e Américas simultaneamente.</p>
        <p>É aqui que o UUID brilha. Qualquer servidor isolado pode gerar um UUID e enviá-lo ao banco central com a confiança cega de que não haverá choque com o ID de outro servidor.</p>

        <h2>Onde usar nosso Gerador?</h2>
        <p>Se você precisa preencher tabelas de teste (seed), mockar APIs (arquivos JSON) ou testar a inserção no banco de dados, o <Link href="/utilidades/gerador-uuid" className="text-blue-600 underline">nosso Gerador de UUID v4</Link> é uma ferramenta excelente. Ele gera as chaves instantaneamente e no seu navegador, garantindo que não estamos logando ou espionando suas operações de infraestrutura.</p>
      </>
    )
  },
  'como-funciona-tabela-fipe': {
    title: 'Como funciona a Tabela FIPE na prática?',
    date: '14 de Junho, 2026',
    isoDate: '2026-06-14T12:00:00.000Z',
    category: 'Financeiro',
    description: 'Descubra como a Fundação Instituto de Pesquisas Econômicas calcula o preço médio dos veículos no Brasil e como usar isso a seu favor na hora da negociação.',
    content: (
      <>
        <p>A Tabela FIPE (Fundação Instituto de Pesquisas Econômicas) é o principal indicador para o mercado de veículos usados e seminovos no Brasil. Seja para comprar, vender ou calcular o valor do IPVA e do seguro, a FIPE é o seu referencial primário. Mas como ela chega naqueles valores exatos mês a mês?</p>

        <h2>Como o preço médio é calculado</h2>
        <p>A metodologia da FIPE consiste na coleta massiva de preços de carros, motos e caminhões usados, seminovos e novos no mercado nacional. Eles filtram valores muito altos ou muito baixos (para remover anomalias estatísticas, como vendas entre familiares com descontos drásticos, ou carros blindados super-valorizados) e tiram a média.</p>
        <p>Por isso, carros que têm "pacotes opcionais" invisíveis no modelo padrão podem ser vendidos acima da tabela, enquanto carros mal cuidados ou de repasse são vendidos consideravelmente abaixo.</p>

        <h2>Tabela FIPE e o Seguro Auto</h2>
        <p>Quando uma corretora de seguros oferece uma cobertura, geralmente vemos cláusulas como "Cobertura de 100% da Tabela FIPE". Isso significa que, em caso de perda total ou roubo, a indenização que você vai receber será o valor exato que estiver listado na FIPE no <strong>mês do pagamento da indenização</strong>, não no mês do sinistro, nem do fechamento do contrato.</p>

        <h2>Facilitando a Consulta</h2>
        <p>No aplicativo do BuscaCentral, você não precisa ficar rodando abas lentas para encontrar o seu modelo. Nós criamos uma <Link href="/financeiro/tabela-fipe" className="text-blue-600 underline">interface unificada e ultrarrápida da Tabela FIPE</Link> onde basta selecionar a Marca, Modelo e Ano para ver a cotação no mesmo segundo, sem recarregar a página.</p>
      </>
    )
  },
  'diferenca-clt-e-pj': {
    title: 'CLT vs PJ: Qual vale mais a pena?',
    date: '10 de Junho, 2026',
    isoDate: '2026-06-10T12:00:00.000Z',
    category: 'Trabalhista',
    description: 'Um guia completo e prático sobre os prós e contras de trabalhar com carteira assinada versus abrir a própria empresa e faturar como Pessoa Jurídica.',
    content: (
      <>
        <p>O debate entre trabalhar sob o regime da CLT (Consolidação das Leis do Trabalho) e trabalhar como PJ (Pessoa Jurídica) é uma constante para profissionais em início de carreira, especialmente na área de tecnologia e prestação de serviços. Entender a matemática por trás dessas duas modalidades é crucial para não perder dinheiro.</p>

        <h2>A Ilusão do Salário Bruto</h2>
        <p>Um erro comum é comparar os salários diretos. Uma proposta CLT de R$ 5.000,00 e uma PJ de R$ 6.000,00 não são iguais. Na CLT, existe uma rede de segurança: 13º salário, 1/3 de férias, FGTS (8% mensais), seguro-desemprego, INSS pago parcialmente pela empresa, plano de saúde, vale-refeição e estabilidade. Ao abrir mão dessa proteção para ir para o regime PJ, o valor do contrato precisa cobrir obrigatoriamente a ausência desses direitos.</p>

        <h2>Como calcular a equivalência</h2>
        <p>Para um salário CLT se equiparar ao PJ, você não deve comparar o valor mensal, mas sim o seu <strong>Faturamento Anual Líquido</strong>. O cálculo inclui deduzir a tabela progressiva do IRPF e do INSS no caso da CLT, somar o pacote de benefícios, contrapor aos custos do CNPJ (Simples Nacional, DAS, contabilidade e INSS sobre o Pró-labore) para o cenário PJ.</p>
        <p>Geralmente, estima-se que para uma vaga PJ valer a pena, o valor bruto oferecido precisa ser cerca de 40% a 60% maior do que o valor bruto da CLT.</p>

        <h2>Ferramenta de Cálculo de Paridade</h2>
        <p>Fazer essas contas no papel usando tabelas tributárias de 2024 é doloroso. É exatamente por isso que desenvolvemos nosso simulador de paridade. Use a nossa <Link href="/financeiro/conversor-clt-pj" className="text-blue-600 underline">Calculadora de Conversão CLT para PJ</Link>. Você insere quanto quer receber como PJ e a ferramenta diz na hora o exato salário CLT equivalente, descontando o imposto atualizado do Governo Federal.</p>
      </>
    )
  },
  'por-que-empresas-precisam-gerar-cpf-para-testes': {
    title: 'Por que empresas precisam gerar CPF para testes?',
    date: '15 de Junho, 2026',
    isoDate: '2026-06-15T12:00:00.000Z',
    category: 'Desenvolvimento',
    description: 'Descubra por que o uso de CPFs reais em ambientes de teste é um risco de segurança e como os geradores de CPF ajudam empresas a validarem seus sistemas de forma ética.',
    content: (
      <>
        <p>A Lei Geral de Proteção de Dados (LGPD) mudou drasticamente a forma como as empresas lidam com informações pessoais. Usar CPFs ou CNPJs reais para testar sistemas não é apenas antiético, é ilegal e pode render multas milionárias.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">O perigo do "banco de dados espelho"</h2>
        <p>No passado, era comum que equipes de desenvolvimento fizessem uma cópia do banco de dados de produção para realizar testes localmente. Isso significava que os desenvolvedores tinham acesso a milhares de CPFs de clientes reais.</p>
        <p>Hoje, isso é uma violação grave de segurança. Para testar formulários, integrações com meios de pagamento ou validações de cadastro, os programadores utilizam dados fictícios que obedecem à mesma lógica matemática dos dados reais, mas não pertencem a ninguém.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Como a matemática resolve o problema</h2>
        <p>O CPF possui uma lógica matemática chamada de "Dígitos Verificadores" (os dois últimos números). Um gerador de CPF cria 9 números aleatórios e calcula os dois últimos para que a validação matemática passe perfeitamente nos testes, sem vazar os dados de uma pessoa real.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Precisa testar o seu sistema agora?</h3>
          <p className="text-blue-800">Acesse nossa ferramenta gratuita para <Link href="/documentos/gerador-cpf" className="underline font-semibold hover:text-blue-900">Gerar CPF Válido</Link> e mantenha seus testes seguros e dentro da lei!</p>
        </div>
      </>
    )
  },
  'juros-compostos-o-segredo-dos-investimentos': {
    title: 'Juros Compostos: O segredo para multiplicar seu patrimônio',
    date: '16 de Junho, 2026',
    isoDate: '2026-06-16T12:00:00.000Z',
    category: 'Financeiro',
    description: 'Entenda como a mágica dos juros sobre juros funciona e como o tempo é o seu maior aliado na construção de riqueza a longo prazo.',
    content: (
      <>
        <p>Albert Einstein teria dito certa vez que "os juros compostos são a oitava maravilha do mundo". Seja essa citação verdadeira ou não, a matemática por trás dos juros compostos é, sem dúvida, o motor principal do crescimento de patrimônio.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">O que são Juros Compostos?</h2>
        <p>Diferente dos juros simples, onde o rendimento incide apenas sobre o valor inicial, nos juros compostos o rendimento de um mês é somado ao montante inicial, e no mês seguinte, os juros incidirão sobre esse novo valor (o montante total).</p>
        <p>Isso gera o chamado "efeito bola de neve". No começo, o crescimento parece insignificante. Mas ao longo de 10, 20 ou 30 anos, a curva de crescimento torna-se exponencial.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Tempo: O ingrediente secreto</h2>
        <p>Muitas pessoas acham que para investir é preciso ter muito dinheiro. A verdade é que o tempo é muito mais importante que o dinheiro nos juros compostos. Começar a investir R$ 100 por mês aos 20 anos pode resultar em um patrimônio muito maior do que começar a investir R$ 500 por mês aos 40 anos.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Faça as suas próprias simulações</h3>
          <p className="text-blue-800">Descubra quanto dinheiro você terá no futuro utilizando nossa <Link href="/financeiro/juros-compostos" className="underline font-semibold hover:text-blue-900">Calculadora de Juros Compostos</Link>. Planeje sua independência financeira hoje!</p>
        </div>
      </>
    )
  },
  'tamanho-ideal-textos-seo-redes-sociais': {
    title: 'SEO e Textos: O tamanho ideal para cada rede social',
    date: '16 de Junho, 2026',
    isoDate: '2026-06-16T15:00:00.000Z',
    category: 'Marketing',
    description: 'Saber a quantidade exata de caracteres para o Twitter, Instagram, SEO (Meta Titles) e anúncios faz toda a diferença no seu engajamento.',
    content: (
      <>
        <p>Em um mundo onde a atenção é escassa, acertar o tamanho do texto pode determinar se a sua mensagem será lida ou completamente ignorada. E mais: o tamanho correto evita que seu texto seja "cortado" (...), o que afeta drasticamente o SEO e as taxas de clique (CTR).</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Meta Title e Meta Description (SEO)</h2>
        <p>Para o Google, um <strong>Meta Title</strong> deve ter idealmente entre 50 e 60 caracteres. Passou de 60, o Google irá truncar o título. Já a <strong>Meta Description</strong> (o textinho que aparece embaixo do título na pesquisa) tem seu ponto ideal entre 150 e 160 caracteres.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Twitter e Instagram</h2>
        <p>O X (antigo Twitter) permite até 280 caracteres na versão gratuita, mas estudos indicam que tweets entre 71 e 100 caracteres engajam 17% a mais. Já no Instagram, os 125 primeiros caracteres da legenda são cruciais, pois é onde a plataforma insere o botão "Ver mais".</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Conte seus textos antes de publicar</h3>
          <p className="text-blue-800">Não deixe seu texto ser cortado! Utilize o nosso <Link href="/utilidades/contador-caracteres" className="underline font-semibold hover:text-blue-900">Contador de Caracteres e Palavras</Link> para ajustar seus posts de forma milimétrica.</p>
        </div>
      </>
    )
  }
};

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articlesData[slug];
  
  if (!article) {
    return { title: 'Página não encontrada' };
  }

  return {
    title: `${article.title} | BuscaCentral Artigos`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.isoDate,
    }
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articlesData[slug];

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="bg-sky-100 text-sky-800 text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              {article.category}
            </span>
            <time className="text-slate-500 font-medium">{article.date}</time>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {article.description}
          </p>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="prose prose-lg prose-slate prose-blue max-w-none">
            {article.content}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/artigos" className="inline-flex items-center px-6 py-3 border border-slate-300 shadow-sm text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <svg className="w-5 h-5 mr-2 -ml-1 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para Artigos
          </Link>
        </div>
      </article>
    </main>
  );
}
