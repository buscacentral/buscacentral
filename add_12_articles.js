const fs = require('fs');

const existingSlugPage = fs.readFileSync('src/app/artigos/[slug]/page.tsx', 'utf-8');
const existingIndexPage = fs.readFileSync('src/app/artigos/page.tsx', 'utf-8');
const existingSitemap = fs.readFileSync('src/app/sitemap.ts', 'utf-8');

const newArticles = `
  'salario-bruto-vs-liquido-irrf-inss': {
    title: 'Salário Bruto vs. Líquido: Onde vai parar o seu dinheiro (INSS e IRRF)?',
    date: '21 de Junho, 2026',
    isoDate: '2026-06-21T10:00:00.000Z',
    category: 'Trabalhista',
    description: 'Entenda os descontos obrigatórios na folha de pagamento e aprenda a calcular o seu salário líquido real.',
    content: (
      <>
        <p>Ao assinar um contrato de trabalho, o valor que brilha aos olhos é o Salário Bruto. Porém, no fim do mês, o que cai na conta é o Salário Líquido. A diferença entre os dois é o que chamamos de "descontos em folha", sendo os principais o INSS e o IRRF.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">O Leão e a Previdência</h2>
        <p>O INSS (Instituto Nacional do Seguro Social) é a sua contribuição para a aposentadoria e auxílios-doença. Ele segue uma tabela progressiva, onde quem ganha mais, paga uma porcentagem maior. Depois de deduzir o INSS, entra o IRRF (Imposto de Renda Retido na Fonte), que também tem suas faixas progressivas e uma parcela a deduzir.</p>
        <p>Dependendo da sua faixa salarial, esses descontos combinados podem chegar a corroer até 27,5% do seu rendimento.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Calcule o seu salário real</h3>
          <p className="text-blue-800">Use a nossa <Link href="/financeiro/salario-liquido" className="underline font-semibold hover:text-blue-900">Calculadora de Salário Líquido</Link> para saber exatamente quanto vai cair na sua conta.</p>
        </div>
      </>
    )
  },
  'guia-do-decimo-terceiro-salario': {
    title: 'Guia do 13º Salário: Quem tem direito e como é feito o cálculo',
    date: '21 de Junho, 2026',
    isoDate: '2026-06-21T12:00:00.000Z',
    category: 'Trabalhista',
    description: 'Tudo o que você precisa saber sobre a gratificação natalina, os prazos de pagamento e os descontos da segunda parcela.',
    content: (
      <>
        <p>O 13º salário, também conhecido como gratificação natalina, é um direito garantido a todos os trabalhadores com carteira assinada (CLT), além de aposentados, pensionistas e servidores públicos.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Como a matemática funciona?</h2>
        <p>O cálculo é proporcional aos meses trabalhados no ano. Se você trabalhou os 12 meses, recebe um salário inteiro extra. Se trabalhou 6 meses, recebe a metade. A regra de ouro é: para o mês contar para o cálculo, você deve ter trabalhado pelo menos 15 dias nele.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">As duas parcelas e os descontos</h2>
        <p>A primeira parcela (adiantamento) deve ser paga até 30 de novembro e corresponde a 50% do valor bruto, sem descontos. A segunda parcela deve ser paga até 20 de dezembro, e é nela que vêm todos os descontos acumulados (INSS e IRRF) referentes ao valor total do benefício.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Simule seu Décimo Terceiro</h3>
          <p className="text-blue-800">Descubra quanto você vai receber na primeira e na segunda parcela com a nossa <Link href="/financeiro/decimo-terceiro" className="underline font-semibold hover:text-blue-900">Calculadora de 13º Salário</Link>.</p>
        </div>
      </>
    )
  },
  'calculo-de-ferias-e-terco-constitucional': {
    title: 'Cálculo de Férias e Terço Constitucional: O que você precisa saber',
    date: '22 de Junho, 2026',
    isoDate: '2026-06-22T08:00:00.000Z',
    category: 'Trabalhista',
    description: 'Aprenda como funciona o cálculo do seu pagamento de férias, incluindo o adicional de um terço e os descontos legais.',
    content: (
      <>
        <p>O período de férias é o momento mais aguardado do ano. Mas além do descanso, existe um acréscimo financeiro garantido pela Constituição Federal: o Terço Constitucional de Férias.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">A Lógica do Cálculo</h2>
        <p>Quando você tira 30 dias de férias, a empresa deve pagar o seu salário normal, mais 1/3 (33,33%) desse salário. Por exemplo, se você ganha R$ 3.000, o seu terço constitucional será de R$ 1.000, totalizando R$ 4.000 brutos.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">A armadilha dos descontos e do mês seguinte</h2>
        <p>Esse valor bruto também sofre pesados descontos de INSS e IRRF. Além disso, o pagamento das férias é um adiantamento. Como você recebe antes de sair, ao retornar de 30 dias de descanso, o seu contracheque do mês seguinte virá zerado (pois você já recebeu aqueles dias antecipadamente). Por isso, exige muito planejamento financeiro.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Planeje seu descanso</h3>
          <p className="text-blue-800">Antecipe-se e saiba exatamente quanto vai cair na sua conta usando nossa <Link href="/financeiro/ferias" className="underline font-semibold hover:text-blue-900">Calculadora de Férias</Link>.</p>
        </div>
      </>
    )
  },
  'bitcoin-ethereum-volatilidade-mercado': {
    title: 'Bitcoin e Ethereum: Como acompanhar a cotação e entender a volatilidade',
    date: '22 de Junho, 2026',
    isoDate: '2026-06-22T10:00:00.000Z',
    category: 'Economia',
    description: 'Desvende o mercado de criptoativos, entenda as diferenças entre as principais moedas e como a oferta e demanda ditam os preços.',
    content: (
      <>
        <p>As criptomoedas deixaram de ser um experimento cypherpunk e se tornaram uma classe de ativos multibilionária. O mercado é liderado majoritariamente por duas forças: o Bitcoin (BTC) e o Ethereum (ETH).</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Ouro Digital vs. Computador Mundial</h2>
        <p>O Bitcoin foi criado para ser um sistema financeiro descentralizado e escasso. Com um limite máximo de 21 milhões de moedas, ele ganhou o apelido de "Ouro Digital". Por outro lado, o Ethereum é focado em contratos inteligentes (Smart Contracts). Ele funciona como um computador mundial descentralizado onde aplicativos podem ser construídos e executados sem intermediários.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Por que os preços variam tanto?</h2>
        <p>Diferente de moedas estatais, criptomoedas não possuem um Banco Central para controlar a inflação ou segurar os preços. A volatilidade é extrema e impulsionada por fatores como: regulamentações governamentais, adoção institucional, macroeconomia global (taxas de juros dos EUA) e ciclos de mercado (como o Halving do Bitcoin).</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Acompanhe o mercado ao vivo</h3>
          <p className="text-blue-800">Verifique os preços em tempo real com a nossa <Link href="/financeiro/criptomoedas" className="underline font-semibold hover:text-blue-900">Tabela de Cotação de Criptomoedas</Link>.</p>
        </div>
      </>
    )
  },
  'financiamento-veiculos-tabela-price': {
    title: 'A ilusão das parcelas: Entenda a tabela Price no financiamento de veículos',
    date: '23 de Junho, 2026',
    isoDate: '2026-06-23T09:00:00.000Z',
    category: 'Finanças',
    description: 'Entenda como os bancos calculam as prestações do seu carro novo e quanto você realmente está pagando de juros.',
    content: (
      <>
        <p>Comprar um carro novo é o sonho de muitos brasileiros. Mas na empolgação do test-drive, é fácil ignorar a matemática fria que se esconde por trás do contrato de financiamento, muitas vezes resultando em pagar "dois carros e levar apenas um".</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">A Tabela Price</h2>
        <p>A imensa maioria dos financiamentos de veículos no Brasil utiliza a Tabela Price (ou Sistema Francês de Amortização). A principal característica da Price é que a <strong>parcela é fixa</strong> do início ao fim do contrato. No entanto, a composição dessa parcela muda drasticamente.</p>
        <p>Nas primeiras dezenas de parcelas, quase todo o seu dinheiro vai para pagar os <strong>juros</strong> do banco, abatendo muito pouco do valor real (principal) da dívida. É por isso que, se você tenta quitar um carro de 60 meses no 20º mês, percebe que a sua dívida ainda está quase do mesmo tamanho.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">O custo Efetivo Total (CET)</h2>
        <p>Nunca olhe apenas para a "taxa de juros ao mês". Olhe sempre para o CET. Ele embute as taxas de abertura de crédito, seguros e tarifas administrativas. O CET é o custo real da sua dívida.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Não seja enganado</h3>
          <p className="text-blue-800">Antes de assinar qualquer contrato, use a nossa <Link href="/financeiro/financiamento-carro" className="underline font-semibold hover:text-blue-900">Calculadora de Financiamento de Veículos</Link> e veja o valor exato dos juros totais.</p>
        </div>
      </>
    )
  },
  'como-criar-uma-senha-forte': {
    title: 'Ataques de Força Bruta: Como criar uma senha impossível de ser hackeada',
    date: '23 de Junho, 2026',
    isoDate: '2026-06-23T14:00:00.000Z',
    category: 'Segurança',
    description: 'Aprenda os conceitos de criptografia básica e o que realmente torna uma senha impenetrável contra robôs invasores.',
    content: (
      <>
        <p>Senhas como "123456", "senha123" ou a sua data de nascimento são convites abertos para criminosos cibernéticos. Com o poder computacional moderno, descobrir essas senhas leva literalmente menos de 1 segundo.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">O que é Ataque de Força Bruta?</h2>
        <p>Robôs hackers não "adivinham" senhas pensando, eles simplesmente testam milhares ou milhões de combinações por segundo. Se a sua senha possui apenas letras minúsculas e tem 6 caracteres, existem apenas algumas centenas de milhões de combinações possíveis, algo que um computador moderno resolve num piscar de olhos.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Comprimento é melhor que complexidade</h2>
        <p>A matemática da entropia diz que adicionar um novo caractere à sua senha aumenta a segurança exponencialmente mais do que trocar uma letra por um símbolo. Uma senha como "CachorroAmareloCorreMuito" (25 caracteres, apenas letras) é incrivelmente mais forte e fácil de lembrar do que "X@9!qZ" (6 caracteres complexos).</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">A mistura perfeita</h2>
        <p>O ideal, contudo, é misturar o melhor dos dois mundos: comprimento e variedade (letras, números e símbolos especiais).</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Crie a sua armadura digital</h3>
          <p className="text-blue-800">Utilize o nosso <Link href="/utilidades/gerador-senha" className="underline font-semibold hover:text-blue-900">Gerador de Senhas Seguras</Link> para gerar combinações impenetráveis em um clique.</p>
        </div>
      </>
    )
  },
  'como-consultar-situacao-cnpj': {
    title: 'Como consultar a situação de um CNPJ e evitar fraudes na internet',
    date: '24 de Junho, 2026',
    isoDate: '2026-06-24T09:00:00.000Z',
    category: 'Segurança',
    description: 'Saiba interpretar o comprovante de situação cadastral e como identificar empresas de fachada antes de realizar compras ou contratos.',
    content: (
      <>
        <p>Fazer compras online, fechar parcerias comerciais ou assinar contratos de serviço sempre carrega um risco embutido. A melhor forma de realizar uma "Due Diligence" (diligência prévia) básica é consultar o status do CNPJ da empresa.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">O que verificar no Cartão CNPJ?</h2>
        <p>A Receita Federal mantém o banco de dados oficial de todas as empresas do país. Ao consultar um CNPJ, preste atenção nestes três fatores vitais:</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Situação Cadastral:</strong> Deve estar obrigatoriamente como "ATIVA". Uma empresa "BAIXADA", "INAPTA" ou "SUSPENSA" não tem permissão para emitir notas fiscais ou operar legalmente.</li>
          <li><strong>Data de Abertura:</strong> Desconfie de empresas oferecendo grandes vantagens, grandes estoques ou empréstimos, cuja data de abertura seja muito recente (menos de 6 meses). Golpistas frequentemente abrem "CNPJs de fachada" que duram poucos meses.</li>
          <li><strong>CNAE Principal:</strong> A atividade econômica da empresa deve bater com o que ela está vendendo. Uma empresa vendendo eletrônicos não deveria ter um CNAE de "Padaria".</li>
        </ul>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Investigue agora mesmo</h3>
          <p className="text-blue-800">Acesse o banco da Receita Federal em segundos através da nossa página de <Link href="/documentos/consulta-cnpj" className="underline font-semibold hover:text-blue-900">Consulta de CNPJ</Link>.</p>
        </div>
      </>
    )
  },
  'gerador-cartao-de-credito-testes': {
    title: 'Por que sistemas de teste usam algoritmos (Módulo 10) para gerar cartões virtuais?',
    date: '24 de Junho, 2026',
    isoDate: '2026-06-24T14:00:00.000Z',
    category: 'Desenvolvimento',
    description: 'Entenda como funciona o Algoritmo de Luhn e a matemática que valida qualquer cartão de crédito do mundo instantaneamente.',
    content: (
      <>
        <p>Quando você digita os 16 números do seu cartão de crédito numa loja virtual e erra um único dígito, o sistema avisa na hora que o número é inválido, antes mesmo de tentar cobrar com a operadora. Como o site sabe disso? A resposta é o Algoritmo de Luhn (ou Módulo 10).</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">O Algoritmo de Luhn</h2>
        <p>Inventado por Hans Peter Luhn, um cientista da IBM em 1954, este algoritmo matemático é usado pelas bandeiras (Visa, Mastercard, Elo) para validar números de identificação.</p>
        <p>A conta funciona assim: começando da direita para a esquerda, dobra-se o valor de cada dígito alternado. Se o dobro for maior que 9, os dois dígitos do resultado são somados (ex: 7x2 = 14. 1+4 = 5). No final, soma-se todos os dígitos alterados com os não alterados. Se o resultado final for um múltiplo de 10 (terminar em zero), o número do cartão é matematicamente válido.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">A importância para os desenvolvedores</h2>
        <p>Para testar carrinhos de compra e integrações com gateways de pagamento (como Stripe ou Pagar.me), os desenvolvedores não podem usar cartões reais. Eles precisam de números "falsos" que obedeçam rigorosamente ao Algoritmo de Luhn, para que a loja virtual os aceite como se fossem verdadeiros até a etapa final da compra.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Ferramenta para Desenvolvedores</h3>
          <p className="text-blue-800">Crie massa de dados para seus ambientes de Sandbox. Utilize nosso <Link href="/documentos/gerador-cartao-credito" className="underline font-semibold hover:text-blue-900">Gerador de Cartão de Crédito Válido</Link>.</p>
        </div>
      </>
    )
  },
  'criar-link-whatsapp-vendas': {
    title: 'API do WhatsApp: Como criar links diretos para aumentar as vendas',
    date: '25 de Junho, 2026',
    isoDate: '2026-06-25T08:00:00.000Z',
    category: 'Marketing',
    description: 'Aprenda a utilizar a API Click to Chat (wa.me) para encurtar o caminho do seu cliente e automatizar o início da conversa.',
    content: (
      <>
        <p>No e-commerce e no marketing digital modernos, o atrito é o maior inimigo da conversão. Se um cliente vê seu anúncio no Instagram, mas precisa salvar seu número na agenda telefônica antes de poder enviar um "Oi" no WhatsApp, você perderá 90% dos interessados no meio do caminho.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">A Solução "Click to Chat" (wa.me)</h2>
        <p>O próprio WhatsApp (Meta) desenvolveu uma API pública que permite iniciar uma conversa sem a necessidade de salvar o número do destinatário. Basta utilizar uma URL estruturada como <code>https://wa.me/numerodotelefone</code>.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">O poder da Mensagem Pré-definida</h2>
        <p>A mágica real acontece quando você injeta texto nessa URL. Você pode criar um link que, ao ser clicado, não apenas abre o WhatsApp da sua loja, mas já digita na caixa de texto do cliente a mensagem: "Olá, tenho interesse na promoção da calça azul". O cliente só precisa apertar enviar.</p>
        <p>Isso facilita o rastreamento da origem da venda e aumenta drasticamente as taxas de conversão de anúncios pagos.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Gere seus links de forma profissional</h3>
          <p className="text-blue-800">Pare de quebrar a cabeça com a formatação das URLs. Use nosso <Link href="/utilidades/whatsapp-link" className="underline font-semibold hover:text-blue-900">Gerador de Link do WhatsApp</Link> para criar links com textos personalizados instantaneamente.</p>
        </div>
      </>
    )
  },
  'pix-copia-e-cola-br-code': {
    title: 'A evolução do PIX: Como o sistema BR Code revolucionou os pagamentos',
    date: '25 de Junho, 2026',
    isoDate: '2026-06-25T14:00:00.000Z',
    category: 'Tecnologia',
    description: 'Entenda os bastidores técnicos do Pix e como o sistema EMVCo / BR Code formata os dados de um Pix Copia e Cola.',
    content: (
      <>
        <p>O Pix mudou completamente o cenário bancário brasileiro. TEDs e DOCs, restritos por horários comerciais e altas taxas, rapidamente se tornaram obsoletos frente à instantaneidade gratuita do Pix. Mas como o sistema empacota os dados da transação?</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">O Padrão EMV e o BR Code</h2>
        <p>O Banco Central do Brasil foi inteligente e não reinventou a roda. Ele utilizou como base o padrão mundial EMV (criado pela Europay, Mastercard e Visa), que rege os QR Codes de pagamentos globalmente. A especificação brasileira em cima do EMV foi batizada de "BR Code".</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">A anatomia do Copia e Cola</h2>
        <p>Aquele bloco gigantesco de letras que compõe o "Pix Copia e Cola" é, na verdade, a representação em texto bruto (payload) do QR Code. Ele é fragmentado em diversas tags, como: identificador do recebedor (Chave Pix), valor da transação, cidade, nome do beneficiário e um código validador final (CRC16) que garante que a string não sofreu adulteração.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Crie códigos de cobrança profissionais</h3>
          <p className="text-blue-800">Quer receber sem pagar taxas de maquininha? Crie códigos exatos com valor pré-definido no nosso <Link href="/utilidades/pix-copia-cola" className="underline font-semibold hover:text-blue-900">Gerador de Pix Copia e Cola / QR Code</Link>.</p>
        </div>
      </>
    )
  },
  'rastreio-encomendas-correios': {
    title: 'A logística por trás dos Correios: Como funciona o sistema de rastreamento',
    date: '26 de Junho, 2026',
    isoDate: '2026-06-26T09:00:00.000Z',
    category: 'Tecnologia',
    description: 'Desvende o significado das siglas dos Correios (PAC, SEDEX) e como os pacotes são bipados ao redor do país.',
    content: (
      <>
        <p>Esperar uma encomenda comprada na internet é um teste de ansiedade. O código de rastreio de 13 dígitos dos Correios (ex: <code>NL123456789BR</code>) é a nossa única janela para saber onde a mercadoria está. Mas o que essas letras significam?</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">O significado das Siglas</h2>
        <p>Os Correios utilizam um padrão internacional regido pela UPU (União Postal Universal). O código sempre possui 2 letras iniciais, 9 números e 2 letras finais indicando o país de origem (BR para Brasil, CN para China).</p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Letras iniciadas com S:</strong> Referem-se ao SEDEX (encomenda expressa).</li>
          <li><strong>Letras iniciadas com P:</strong> Referem-se ao PAC (encomenda econômica).</li>
          <li><strong>Letras iniciadas com N:</strong> Geralmente remessas internacionais de pequenos pacotes.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-8 mb-4">Unidades de Tratamento (CTCE / CTE)</h2>
        <p>O pacote não viaja magicamente de uma agência para outra. Ele passa por grandes galpões logísticos chamados CTE (Centro de Tratamento de Encomendas). Toda vez que seu pacote entra e sai de um galpão, um scanner lê o código de barras, e essa atualização de "Objeto encaminhado" reflete na API dos Correios.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Onde está a sua caixa?</h3>
          <p className="text-blue-800">Pare de se preocupar. Acompanhe a jornada do seu pacote em tempo real pelo nosso portal de <Link href="/utilidades/rastreio" className="underline font-semibold hover:text-blue-900">Rastreio de Encomendas dos Correios</Link>.</p>
        </div>
      </>
    )
  },
  'etanol-ou-gasolina-regra-dos-70': {
    title: 'Etanol ou Gasolina? A regra matemática dos 70% na hora de abastecer',
    date: '26 de Junho, 2026',
    isoDate: '2026-06-26T14:00:00.000Z',
    category: 'Finanças',
    description: 'Entenda por que o etanol queima mais rápido e como saber matematicamente qual combustível está valendo mais a pena na bomba.',
    content: (
      <>
        <p>A pergunta clássica nos postos de combustíveis brasileiros com carros flex: Álcool ou Gasolina? A resposta depende estritamente da proporção de preços nas bombas e da termodinâmica do seu motor.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">A Diferença Energética</h2>
        <p>O Etanol e a Gasolina possuem poder calorífico diferente. O etanol queima mais rápido e gera menos energia por litro em comparação com a gasolina. Isso significa que um carro abastecido com etanol fará menos quilômetros por litro (rendimento menor).</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">A Regra dos 70%</h2>
        <p>Os engenheiros estimam que, em média, o motor a etanol rende cerca de 70% do que renderia com gasolina. Portanto, para que abastecer com etanol compense financeiramente, o preço do litro do etanol precisa custar <strong>no máximo 70%</strong> do preço do litro da gasolina.</p>
        <p>Por exemplo: se a gasolina custa R$ 5,00, o etanol só valerá a pena se custar até R$ 3,50. Se estiver custando R$ 3,80, você estará perdendo dinheiro e o seu tanque vai esvaziar mais rápido.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
          <h3 className="font-bold text-lg text-blue-900 mb-2">Faça as contas sem calculadora</h3>
          <p className="text-blue-800">Chegou no posto e está na dúvida? Use nossa <Link href="/utilidades/calculadora-combustivel" className="underline font-semibold hover:text-blue-900">Calculadora de Combustível (Etanol vs Gasolina)</Link> e saiba qual escolher em 2 segundos.</p>
        </div>
      </>
    )
  }
`;

const propsTypeIndex = existingSlugPage.indexOf('type Props = {');
const lastBraceBeforeProps = existingSlugPage.lastIndexOf('};', propsTypeIndex);

if (lastBraceBeforeProps !== -1) {
  const newSlugPage = existingSlugPage.slice(0, lastBraceBeforeProps) + ',' + newArticles + existingSlugPage.slice(lastBraceBeforeProps);
  fs.writeFileSync('src/app/artigos/[slug]/page.tsx', newSlugPage, 'utf-8');
} else {
  console.log('Error finding insertion point in slug page');
}

const newIndexEntries = `
  {
    slug: 'salario-bruto-vs-liquido-irrf-inss',
    title: 'Salário Bruto vs. Líquido: Onde vai parar o seu dinheiro (INSS e IRRF)?',
    date: '21 de Junho, 2026',
    category: 'Trabalhista',
    excerpt: 'Entenda os descontos obrigatórios na folha de pagamento e aprenda a calcular o seu salário líquido real.',
  },
  {
    slug: 'guia-do-decimo-terceiro-salario',
    title: 'Guia do 13º Salário: Quem tem direito e como é feito o cálculo',
    date: '21 de Junho, 2026',
    category: 'Trabalhista',
    excerpt: 'Tudo o que você precisa saber sobre a gratificação natalina, os prazos de pagamento e os descontos da segunda parcela.',
  },
  {
    slug: 'calculo-de-ferias-e-terco-constitucional',
    title: 'Cálculo de Férias e Terço Constitucional: O que você precisa saber',
    date: '22 de Junho, 2026',
    category: 'Trabalhista',
    excerpt: 'Aprenda como funciona o cálculo do seu pagamento de férias, incluindo o adicional de um terço e os descontos legais.',
  },
  {
    slug: 'bitcoin-ethereum-volatilidade-mercado',
    title: 'Bitcoin e Ethereum: Como acompanhar a cotação e entender a volatilidade',
    date: '22 de Junho, 2026',
    category: 'Economia',
    excerpt: 'Desvende o mercado de criptoativos, entenda as diferenças entre as principais moedas e como a oferta e demanda ditam os preços.',
  },
  {
    slug: 'financiamento-veiculos-tabela-price',
    title: 'A ilusão das parcelas: Entenda a tabela Price no financiamento de veículos',
    date: '23 de Junho, 2026',
    category: 'Finanças',
    excerpt: 'Entenda como os bancos calculam as prestações do seu carro novo e quanto você realmente está pagando de juros.',
  },
  {
    slug: 'como-criar-uma-senha-forte',
    title: 'Ataques de Força Bruta: Como criar uma senha impossível de ser hackeada',
    date: '23 de Junho, 2026',
    category: 'Segurança',
    excerpt: 'Aprenda os conceitos de criptografia básica e o que realmente torna uma senha impenetrável contra robôs invasores.',
  },
  {
    slug: 'como-consultar-situacao-cnpj',
    title: 'Como consultar a situação de um CNPJ e evitar fraudes na internet',
    date: '24 de Junho, 2026',
    category: 'Segurança',
    excerpt: 'Saiba interpretar o comprovante de situação cadastral e como identificar empresas de fachada antes de realizar compras ou contratos.',
  },
  {
    slug: 'gerador-cartao-de-credito-testes',
    title: 'Por que sistemas de teste usam algoritmos (Módulo 10) para gerar cartões virtuais?',
    date: '24 de Junho, 2026',
    category: 'Desenvolvimento',
    excerpt: 'Entenda como funciona o Algoritmo de Luhn e a matemática que valida qualquer cartão de crédito do mundo instantaneamente.',
  },
  {
    slug: 'criar-link-whatsapp-vendas',
    title: 'API do WhatsApp: Como criar links diretos para aumentar as vendas',
    date: '25 de Junho, 2026',
    category: 'Marketing',
    excerpt: 'Aprenda a utilizar a API Click to Chat (wa.me) para encurtar o caminho do seu cliente e automatizar o início da conversa.',
  },
  {
    slug: 'pix-copia-e-cola-br-code',
    title: 'A evolução do PIX: Como o sistema BR Code revolucionou os pagamentos',
    date: '25 de Junho, 2026',
    category: 'Tecnologia',
    excerpt: 'Entenda os bastidores técnicos do Pix e como o sistema EMVCo / BR Code formata os dados de um Pix Copia e Cola.',
  },
  {
    slug: 'rastreio-encomendas-correios',
    title: 'A logística por trás dos Correios: Como funciona o sistema de rastreamento',
    date: '26 de Junho, 2026',
    category: 'Tecnologia',
    excerpt: 'Desvende o significado das siglas dos Correios (PAC, SEDEX) e como os pacotes são bipados ao redor do país.',
  },
  {
    slug: 'etanol-ou-gasolina-regra-dos-70',
    title: 'Etanol ou Gasolina? A regra matemática dos 70% na hora de abastecer',
    date: '26 de Junho, 2026',
    category: 'Finanças',
    excerpt: 'Entenda por que o etanol queima mais rápido e como saber matematicamente qual combustível está valendo mais a pena na bomba.',
  }
`;

const indexInsertionPoint = existingIndexPage.indexOf('];');
const newIndexPage = existingIndexPage.slice(0, indexInsertionPoint) + ',' + newIndexEntries + existingIndexPage.slice(indexInsertionPoint);
fs.writeFileSync('src/app/artigos/page.tsx', newIndexPage, 'utf-8');

const newSitemapEntries = `
    '/artigos/salario-bruto-vs-liquido-irrf-inss',
    '/artigos/guia-do-decimo-terceiro-salario',
    '/artigos/calculo-de-ferias-e-terco-constitucional',
    '/artigos/bitcoin-ethereum-volatilidade-mercado',
    '/artigos/financiamento-veiculos-tabela-price',
    '/artigos/como-criar-uma-senha-forte',
    '/artigos/como-consultar-situacao-cnpj',
    '/artigos/gerador-cartao-de-credito-testes',
    '/artigos/criar-link-whatsapp-vendas',
    '/artigos/pix-copia-e-cola-br-code',
    '/artigos/rastreio-encomendas-correios',
    '/artigos/etanol-ou-gasolina-regra-dos-70',
`;
const sitemapInsertionPoint = existingSitemap.indexOf("'/sobre',");
const newSitemap = existingSitemap.slice(0, sitemapInsertionPoint) + newSitemapEntries + existingSitemap.slice(sitemapInsertionPoint);
fs.writeFileSync('src/app/sitemap.ts', newSitemap, 'utf-8');

console.log('Successfully injected 12 new articles!');
