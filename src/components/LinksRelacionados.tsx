import Link from 'next/link';

interface LinkRelacionado {
  readonly href: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

type Categoria =
  | 'financeiro'
  | 'criptomoedas'
  | 'localizacao'
  | 'documentos'
  | 'utilidades'
  | 'bem-estar';

const LINKS_MAP: Record<Categoria, readonly LinkRelacionado[]> = {
  financeiro: [
    { href: '/financeiro/roi-imobiliario', icon: '🏠', title: 'Calculadora de ROI Imobiliário', description: 'Calcule o Cap Rate e retorno do seu investimento.' },
    { href: '/financeiro/cotacao', icon: '💱', title: 'Cotação do Dólar e Euro', description: 'Cotações em tempo real com conversor bidirecional.' },
    { href: '/financeiro/financiamento-carro', icon: '🚙', title: 'Simulador de Financiamento', description: 'Compare parcelas SAC vs Price.' },
    { href: '/financeiro/juros-compostos', icon: '📈', title: 'Simulador de Juros Compostos', description: 'Simule investimentos com aportes mensais.' },
    { href: '/financeiro/tabela-fipe', icon: '🚗', title: 'Tabela FIPE', description: 'Consulte preços médios de veículos.' },
    { href: '/financeiro/criptomoedas', icon: '🪙', title: 'Criptomoedas', description: 'Top 50 criptomoedas com gráficos e conversor.' },
  ],
  criptomoedas: [
    { href: '/financeiro/cotacao', icon: '💵', title: 'Cotação do Dólar e Euro', description: 'Moedas tradicionais em tempo real.' },
    { href: '/financeiro/criptomoedas/bitcoin', icon: '₿', title: 'Bitcoin (BTC)', description: 'Cotação, gráfico e conversor de Bitcoin.' },
    { href: '/financeiro/criptomoedas/ethereum', icon: 'Ξ', title: 'Ethereum (ETH)', description: 'Cotação, gráfico e conversor de Ethereum.' },
    { href: '/financeiro/roi-imobiliario', icon: '🏠', title: 'ROI Imobiliário', description: 'Compare investimentos em cripto vs imóveis.' },
  ],
  localizacao: [
    { href: '/localizacao/busca-cep', icon: '📍', title: 'Busca de CEP', description: 'Consulte endereços completos por CEP.' },
    { href: '/localizacao/distancia-cidades', icon: '🗺️', title: 'Distância entre Cidades', description: 'Calcule distância e custo de combustível.' },
    { href: '/localizacao/clima', icon: '🌤️', title: 'Previsão do Tempo', description: 'Temperatura e condições climáticas atuais.' },
  ],
  documentos: [
    { href: '/documentos/gerador-cpf', icon: '📄', title: 'Gerador de CPF', description: 'Gere CPFs válidos para testes.' },
    { href: '/documentos/validador-cpf', icon: '✅', title: 'Validador de CPF', description: 'Verifique se um CPF é válido.' },
    { href: '/documentos/consulta-cnpj', icon: '🔎', title: 'Consulta CNPJ', description: 'Consulte dados de empresas na Receita Federal.' },
  ],
  utilidades: [
    { href: '/utilidades/rastreio', icon: '📦', title: 'Rastreador de Encomendas', description: 'Rastreie pacotes dos Correios.' },
    { href: '/utilidades/gerador-qr-code', icon: '📱', title: 'Gerador de QR Code', description: 'Gere QR Codes a partir de textos ou URLs.' },
    { href: '/utilidades/gerador-senha', icon: '🔐', title: 'Gerador de Senha', description: 'Gere senhas seguras e aleatórias.' },
    { href: '/utilidades/dias-uteis', icon: '📅', title: 'Calculadora de Dias Úteis', description: 'Calcule dias úteis entre datas.' },
    { href: '/utilidades/planejador-viagem', icon: '✈️', title: 'Planejador de Férias', description: 'Planeje sua viagem com orçamento completo.' },
  ],
  'bem-estar': [
    { href: '/utilidades/calculadora-imc', icon: '⚖️', title: 'Calculadora de IMC', description: 'Simule seu índice de massa corporal de forma prática.' },
    { href: '/utilidades/tabela-calorias', icon: '🍎', title: 'Tabela de Calorias', description: 'Consulte calorias e nutrientes de 200 alimentos.' },
    { href: '/financeiro/rescisao-trabalhista', icon: '📋', title: 'Calculadora de Rescisão', description: 'Calcule valores de rescisão trabalhista.' },
  ],
};

const TITULOS: Record<Categoria, string> = {
  financeiro: 'Ferramentas Financeiras Recomendadas',
  criptomoedas: 'Explore Mais Criptomoedas',
  localizacao: 'Ferramentas de Localização',
  documentos: 'Ferramentas de Documentos',
  utilidades: 'Outras Ferramentas Úteis',
  'bem-estar': 'Ferramentas de Bem-Estar Recomendadas',
};

interface LinksRelacionadosProps {
  categoria: Categoria;
  /** Página atual para excluir dos links (evita auto-link) */
  paginaAtual?: string;
  /** Quantidade de links a exibir (default: 3) */
  quantidade?: number;
}

export default function LinksRelacionados({ categoria, paginaAtual, quantidade = 3 }: LinksRelacionadosProps) {
  const links = LINKS_MAP[categoria]
    .filter((l) => l.href !== paginaAtual)
    .slice(0, quantidade);

  if (links.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-slate-200">
      <h2 className="text-xl font-extrabold text-slate-950 mb-4">
        {TITULOS[categoria]}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group p-4 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded-xl transition-all duration-200 block"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{link.icon}</span>
              <div>
                <p className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {link.title} →
                </p>
                <p className="text-sm text-slate-500 mt-0.5">{link.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
