const fs = require('fs');
const path = require('path');

const pageListPath = path.join(__dirname, 'src/app/artigos/page.tsx');
const slugPagePath = path.join(__dirname, 'src/app/artigos/[slug]/page.tsx');

const listData = fs.readFileSync(pageListPath, 'utf8');
const slugData = fs.readFileSync(slugPagePath, 'utf8');

const newArticlesList = `
  ,
  {
    slug: 'como-calcular-quantidade-de-carne-para-churrasco',
    title: 'Como calcular a quantidade exata de carne e bebida para o seu churrasco',
    date: '26 de Junho, 2026',
    category: 'Utilidades',
    excerpt: 'O guia definitivo de gramas por pessoa, bebidas e acompanhamentos para você não errar na festa.',
  },
  {
    slug: 'como-limpar-listas-de-cpf-e-telefones-no-excel',
    title: 'Tratamento de Dados: Como formatar milhares de CPFs e Telefones de uma vez',
    date: '27 de Junho, 2026',
    category: 'Produtividade',
    excerpt: 'Aprenda como ferramentas de automação e limpeza de dados economizam horas de trabalho manual em planilhas.',
  },
  {
    slug: 'como-fazer-regra-de-tres-simples-passo-a-passo',
    title: 'Como fazer Regra de Três Simples (Com exemplos do dia a dia)',
    date: '27 de Junho, 2026',
    category: 'Matemática',
    excerpt: 'Esqueceu como multiplicar cruzado? Entenda a lógica por trás da regra de três e como ela salva vidas em cálculos diários.',
  },
  {
    slug: 'quantos-litros-de-agua-beber-por-dia-calculo',
    title: 'A matemática da hidratação: Como calcular o consumo de água ideal para o seu peso',
    date: '28 de Junho, 2026',
    category: 'Saúde',
    excerpt: 'O mito dos 2 litros: por que a quantidade ideal varia muito e como a Organização Mundial da Saúde faz o cálculo.',
  },
  {
    slug: 'como-precificar-doces-e-salgados-para-vender',
    title: 'Empreendedorismo Gastronômico: Como calcular o preço de custo e venda dos seus doces',
    date: '28 de Junho, 2026',
    category: 'Empreendedorismo',
    excerpt: 'Pare de perder dinheiro na embalagem ou no gás. Entenda o que é Markup e como precificar seu cardápio com lucro real.',
  },
  {
    slug: 'como-fazer-um-recibo-simples-e-com-validade-legal',
    title: 'Recibo Simples: O que não pode faltar no documento para ter validade',
    date: '29 de Junho, 2026',
    category: 'Documentos',
    excerpt: 'Trabalha como autônomo? Veja como gerar recibos de pagamento de forma profissional, gratuita e legal.',
  },
  {
    slug: 'como-calcular-idade-gestacional-dum-dpp',
    title: 'DUM e DPP: Entenda como a medicina calcula as semanas de gravidez',
    date: '29 de Junho, 2026',
    category: 'Saúde',
    excerpt: 'Semanas ou meses? Saiba a diferença entre o cálculo pela menstruação e pelo ultrassom, e acompanhe o crescimento do bebê.',
  },
  {
    slug: 'tecnica-pomodoro-como-parar-de-procrastinar',
    title: 'Técnica Pomodoro: A ciência de focar por 25 minutos para combater a procrastinação',
    date: '30 de Junho, 2026',
    category: 'Produtividade',
    excerpt: 'Descubra por que quebrar seu tempo em blocos curtos é o segredo dos estudantes e profissionais de alta performance.',
  },
  {
    slug: 'como-fazer-sorteio-justo-no-instagram',
    title: 'Sorteio no Instagram e Rifas: Como garantir que o resultado seja 100% justo',
    date: '30 de Junho, 2026',
    category: 'Utilidades',
    excerpt: 'Entenda por que você não deve usar ferramentas obscuras e como os algoritmos de aleatoriedade garantem que não haja fraude nos sorteios.',
  },
  {
    slug: 'a-historia-das-calculadoras-do-amor-na-internet',
    title: 'Dos cadernos para a web: Como funcionam as calculadoras do amor e testes de compatibilidade',
    date: '01 de Julho, 2026',
    category: 'Diversão',
    excerpt: 'Uma viagem pela nostalgia dos testes de nomes da adolescência e como algoritmos modernos transformam palavras em números mágicos.',
  }
];`;

const newListData = listData.replace('];\n\nexport default function ArtigosPage', newArticlesList + '\n\nexport default function ArtigosPage');
fs.writeFileSync(pageListPath, newListData);

const newArticlesContent = \`
  'como-calcular-quantidade-de-carne-para-churrasco': {
    title: 'Como calcular a quantidade exata de carne e bebida para o seu churrasco',
    date: '26 de Junho, 2026',
    isoDate: '2026-06-26T10:00:00.000Z',
    category: 'Utilidades',
    description: 'O guia definitivo de gramas por pessoa, bebidas e acompanhamentos para você não errar na festa.',
    content: (
      <>
        <p>Organizar um churrasco e não saber a quantidade certa de comida é um dos maiores medos de qualquer anfitrião. Faltar carne estraga a festa, sobrar demais pesa no bolso.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">A Regra Prática dos 400 gramas</h2>
        <p>Profissionais de eventos costumam usar a regra de que um adulto come, em média, 400g a 500g de carne em um evento de 4 horas. Para crianças, calcula-se metade disso. Essa conta deve envolver todas as proteínas: bovina, linguiça e frango.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Bebidas e Acompanhamentos</h2>
        <p>No caso das bebidas, a métrica varia muito com o clima e o perfil dos convidados, mas o padrão é 1 litro de cerveja (cerca de 3 latas) e 500ml de refrigerante/água por adulto.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Pare de adivinhar</h3>
          <p className="text-blue-800">Use a nossa <Link href="/utilidades/calculadora-churrasco" className="underline font-semibold hover:text-blue-900">Calculadora de Churrasco</Link> e tenha a lista de compras exata em 5 segundos!</p>
        </div>
      </>
    )
  },
  'como-limpar-listas-de-cpf-e-telefones-no-excel': {
    title: 'Tratamento de Dados: Como formatar milhares de CPFs e Telefones de uma vez',
    date: '27 de Junho, 2026',
    isoDate: '2026-06-27T10:00:00.000Z',
    category: 'Produtividade',
    description: 'Aprenda como ferramentas de automação e limpeza de dados economizam horas de trabalho manual em planilhas.',
    content: (
      <>
        <p>Trabalhar com banco de dados de clientes geralmente significa lidar com planilhas caóticas. Alguns CPFs têm pontos, outros não. Alguns telefones têm DDI, outros nem DDD possuem.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">O problema da inconsistência</h2>
        <p>Sistemas ERPs, CRMs e plataformas de envio de WhatsApp (como a API oficial) são extremamente rigorosos com a formatação. Tentar enviar uma mensagem para um número que contém espaços ou hifens geralmente resulta em erro.</p>
        <p>A limpeza manual disso usando Excel (com fórmulas gigantescas de SUBSTITUIR) pode levar horas e é propensa a erros.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Automatize essa limpeza</h3>
          <p className="text-blue-800">Cole milhares de linhas no nosso <Link href="/utilidades/formatador-dados" className="underline font-semibold hover:text-blue-900">Formatador de Dados em Lote</Link> e deixe a nossa ferramenta padronizar CPFs, CNPJs e Telefones com ou sem pontuação instantaneamente.</p>
        </div>
      </>
    )
  },
  'como-fazer-regra-de-tres-simples-passo-a-passo': {
    title: 'Como fazer Regra de Três Simples (Com exemplos do dia a dia)',
    date: '27 de Junho, 2026',
    isoDate: '2026-06-27T14:00:00.000Z',
    category: 'Matemática',
    description: 'Esqueceu como multiplicar cruzado? Entenda a lógica por trás da regra de três e como ela salva vidas em cálculos diários.',
    content: (
      <>
        <p>A Regra de Três é, sem dúvida, o cálculo matemático mais utilizado na vida adulta. Desde adaptar uma receita de bolo até calcular o consumo de combustível em uma viagem.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">A Lógica da Proporcionalidade</h2>
        <p>O conceito é simples: se você tem três valores conhecidos que possuem uma relação de proporcionalidade, você pode descobrir o quarto valor oculto (o famoso "X"). O método prático é agrupar as grandezas iguais em colunas e "multiplicar cruzado".</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Cálculo Direto</h3>
          <p className="text-blue-800">Pule a matemática de papel e caneta. Utilize nossa <Link href="/utilidades/regra-de-tres" className="underline font-semibold hover:text-blue-900">Calculadora de Regra de Três</Link> para obter a resposta rapidamente.</p>
        </div>
      </>
    )
  },
  'quantos-litros-de-agua-beber-por-dia-calculo': {
    title: 'A matemática da hidratação: Como calcular o consumo de água ideal para o seu peso',
    date: '28 de Junho, 2026',
    isoDate: '2026-06-28T09:00:00.000Z',
    category: 'Saúde',
    description: 'O mito dos 2 litros: por que a quantidade ideal varia muito e como a Organização Mundial da Saúde faz o cálculo.',
    content: (
      <>
        <p>Desde crianças ouvimos que devemos beber "2 litros de água por dia". Mas pense bem: uma pessoa que pesa 50kg precisa da mesma quantidade de água que alguém de 110kg? Certamente não.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">A Fórmula Real (35ml por kg)</h2>
        <p>Profissionais de saúde e a OMS recomendam a ingestão diária de 35ml de água para cada quilograma de peso corporal em adultos saudáveis. Isso significa que alguém de 70kg precisa de cerca de 2.450 ml (2,4 litros), enquanto alguém de 100kg precisa de 3,5 litros.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Saiba exatamente a sua meta</h3>
          <p className="text-blue-800">Descubra a quantidade perfeita para o seu corpo usando a nossa <Link href="/utilidades/consumo-agua" className="underline font-semibold hover:text-blue-900">Calculadora de Consumo de Água</Link>.</p>
        </div>
      </>
    )
  },
  'como-precificar-doces-e-salgados-para-vender': {
    title: 'Empreendedorismo Gastronômico: Como calcular o preço de custo e venda dos seus doces',
    date: '28 de Junho, 2026',
    isoDate: '2026-06-28T14:00:00.000Z',
    category: 'Empreendedorismo',
    description: 'Pare de perder dinheiro na embalagem ou no gás. Entenda o que é Markup e como precificar seu cardápio com lucro real.',
    content: (
      <>
        <p>Muitas confeiteiras e donos de delivery fecham as portas não por falta de vendas, mas por venderem com o preço errado. A conta de "multiplicar por três" já não funciona mais em um mercado tão competitivo.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Custos Invisíveis e Markup</h2>
        <p>Quando você faz um bolo, o custo não é só a farinha e os ovos. Você precisa calcular a embalagem, o adesivo, o detergente, a água, a luz e o gás. O Markup é o índice que você aplica sobre esse custo total para garantir que você não apenas pagará os ingredientes, mas terá lucro líquido para o bolso da empresa.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Pare de perder dinheiro hoje</h3>
          <p className="text-blue-800">Cadastre seus ingredientes e deixe o sistema fazer a mágica. Utilize a nossa <Link href="/financeiro/precificacao-receitas" className="underline font-semibold hover:text-blue-900">Calculadora de Precificação de Receitas</Link>.</p>
        </div>
      </>
    )
  },
  'como-fazer-um-recibo-simples-e-com-validade-legal': {
    title: 'Recibo Simples: O que não pode faltar no documento para ter validade',
    date: '29 de Junho, 2026',
    isoDate: '2026-06-29T10:00:00.000Z',
    category: 'Documentos',
    description: 'Trabalha como autônomo? Veja como gerar recibos de pagamento de forma profissional, gratuita e legal.',
    content: (
      <>
        <p>Um recibo não é uma nota fiscal, mas é o documento comprobatório que garante que uma dívida foi paga ou que um serviço foi liquidado. É a segurança jurídica tanto para quem paga quanto para quem recebe.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Itens Obrigatórios</h2>
        <p>Para um recibo ter valor legal (em pequenas causas, por exemplo), ele precisa de: Valor em numeral e por extenso, nome e documento de quem pagou, nome e documento de quem recebeu, data, local e a assinatura do recebedor.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Abandone o bloquinho de papel</h3>
          <p className="text-blue-800">Crie, imprima ou salve em PDF rapidamente usando nosso <Link href="/documentos/gerador-recibos" className="underline font-semibold hover:text-blue-900">Gerador de Recibos Profissionais</Link>.</p>
        </div>
      </>
    )
  },
  'como-calcular-idade-gestacional-dum-dpp': {
    title: 'DUM e DPP: Entenda como a medicina calcula as semanas de gravidez',
    date: '29 de Junho, 2026',
    isoDate: '2026-06-29T14:00:00.000Z',
    category: 'Saúde',
    description: 'Semanas ou meses? Saiba a diferença entre o cálculo pela menstruação e pelo ultrassom, e acompanhe o crescimento do bebê.',
    content: (
      <>
        <p>A primeira grande confusão para mamães de primeira viagem é descobrir que médicos não contam a gravidez em "9 meses", mas sim em 40 semanas. Mas como essa conta começa?</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">DUM vs DPP</h2>
        <p>O método clássico é a DUM (Data da Última Menstruação). Como é quase impossível saber o dia exato da concepção, os médicos contam a partir do primeiro dia do último ciclo. Já a DPP (Data Provável do Parto) costuma ser definida após o primeiro ultrassom morfológico, ajustando a data real com base no tamanho do bebê.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Em qual semana você está?</h3>
          <p className="text-blue-800">Use a nossa <Link href="/utilidades/idade-gestacional" className="underline font-semibold hover:text-blue-900">Calculadora de Idade Gestacional</Link> para saber exatamente o tempo de gestação e ver a barra de progresso do seu trimestre!</p>
        </div>
      </>
    )
  },
  'tecnica-pomodoro-como-parar-de-procrastinar': {
    title: 'Técnica Pomodoro: A ciência de focar por 25 minutos para combater a procrastinação',
    date: '30 de Junho, 2026',
    isoDate: '2026-06-30T09:00:00.000Z',
    category: 'Produtividade',
    description: 'Descubra por que quebrar seu tempo em blocos curtos é o segredo dos estudantes e profissionais de alta performance.',
    content: (
      <>
        <p>Desenvolvida nos anos 80 por Francesco Cirillo, a técnica ganhou esse nome por conta daqueles cronômetros de cozinha em formato de tomate (pomodoro, em italiano). O princípio é simples e neurocientificamente comprovado.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Senso de Urgência vs. Burnout</h2>
        <p>A técnica prega o foco total (sem redes sociais ou distrações) durante 25 minutos. Isso cria um pequeno senso de urgência ("são só 25 minutos, eu consigo"). Em seguida, a pausa obrigatória de 5 minutos permite que o cérebro relaxe e consolide a informação, evitando o famoso esgotamento mental.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Comece o seu primeiro ciclo</h3>
          <p className="text-blue-800">Abra o nosso <Link href="/utilidades/pomodoro" className="underline font-semibold hover:text-blue-900">Cronômetro Pomodoro Online</Link>, ligue o som do navegador e comece a destruir sua lista de tarefas.</p>
        </div>
      </>
    )
  },
  'como-fazer-sorteio-justo-no-instagram': {
    title: 'Sorteio no Instagram e Rifas: Como garantir que o resultado seja 100% justo',
    date: '30 de Junho, 2026',
    isoDate: '2026-06-30T14:00:00.000Z',
    category: 'Utilidades',
    description: 'Entenda por que você não deve usar ferramentas obscuras e como os algoritmos de aleatoriedade garantem que não haja fraude nos sorteios.',
    content: (
      <>
        <p>O engajamento gerado por sorteios no Instagram e em outras redes sociais é massivo, mas o perigo de reclamações por fraude ("foi marmelada") é igualmente grande. Um sorteio transparente é a única forma de preservar a reputação da sua marca.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">A Criptografia do Navegador</h2>
        <p>Um bom sorteador não guarda dados em um servidor (onde poderiam ser manipulados). Ele roda o código diretamente na sua máquina, embaralhando os participantes usando métodos criptográficos matemáticos que garantem a impossibilidade de viciar o resultado.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Faça o seu sorteio ao vivo</h3>
          <p className="text-blue-800">Grave a tela e mostre a lisura do processo. Acesse o nosso <Link href="/utilidades/sorteador-nomes" className="underline font-semibold hover:text-blue-900">Sorteador de Nomes e Rifas</Link> e realize o sorteio gratuitamente.</p>
        </div>
      </>
    )
  },
  'a-historia-das-calculadoras-do-amor-na-internet': {
    title: 'Dos cadernos para a web: Como funcionam as calculadoras do amor e testes de compatibilidade',
    date: '01 de Julho, 2026',
    isoDate: '2026-07-01T10:00:00.000Z',
    category: 'Diversão',
    description: 'Uma viagem pela nostalgia dos testes de nomes da adolescência e como algoritmos modernos transformam palavras em números mágicos.',
    content: (
      <>
        <p>Antes dos smartphones, nos anos 90 e 2000, as folhas dos cadernos escolares ficavam cheias de cálculos de amor: contava-se quantas letras em comum existiam entre o nome do garoto e o da garota para achar uma porcentagem de afinidade.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">A Lógica Computacional da Diversão</h2>
        <p>Hoje, isso foi trazido para a web. As calculadoras modernas usam uma técnica chamada "Hashing" (espalhamento). Elas pegam as letras dos dois nomes inseridos e as transformam em um número longo que, por sua vez, é transformado num valor de 0 a 100.</p>
        <p>Como o cálculo é matemático, se você testar as mesmas duas pessoas mil vezes, o sistema sempre dará a mesma porcentagem, tornando a brincadeira muito mais realista (e engraçada) para grupos de amigos e casais!</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Será que vai dar namoro?</h3>
          <p className="text-blue-800">As estrelas dizem que sim! Faça o teste com o nome do seu crush agora mesmo na nossa <Link href="/utilidades/calculadora-amor" className="underline font-semibold hover:text-blue-900">Calculadora do Amor</Link>.</p>
        </div>
      </>
    )
  }
};
\`;

const newSlugData = slugData.replace('};\n\nexport default function ArtigoPage', ',\n' + newArticlesContent + '\n};\n\nexport default function ArtigoPage');
fs.writeFileSync(slugPagePath, newSlugData);

console.log("Done!");
