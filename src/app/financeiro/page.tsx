import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Central Financeira',
  description: 'Ferramentas financeiras gratuitas: cotações, criptomoedas, tabela FIPE e simuladores.',
};

const tools = [
  {
    title: 'Cotação de Moedas',
    description: 'Cotações em tempo real: USD, EUR, GBP, ARS, BTC.',
    href: '/financeiro/cotacao',
    icon: '💱',
  },
  {
    title: 'Criptomoedas',
    description: 'Top 10 criptomoedas com variação 24h e conversor.',
    href: '/financeiro/criptomoedas',
    icon: '🪙',
  },
  {
    title: 'Tabela FIPE',
    description: 'Consulte preços médios de veículos.',
    href: '/financeiro/tabela-fipe',
    icon: '🚗',
  },
  {
    title: 'Simulador de Juros Compostos',
    description: 'Simule investimentos com aportes mensais.',
    href: '/financeiro/juros-compostos',
    icon: '📈',
  },
  {
    title: 'Conversor CLT para PJ',
    description: 'Descubra quanto cobrar como PJ para equivaler ao salário CLT.',
    href: '/financeiro/conversor-clt-pj',
    icon: '💼',
  },
  {
    title: 'Simulador de Financiamento de Carro',
    description: 'Simule parcelas pelos sistemas Price e SAC.',
    href: '/financeiro/financiamento-carro',
    icon: '🚙',
  },
];

export default function FinanceiroPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Central Financeira</h1>
      <p className="text-gray-600 mb-8">
        Ferramentas financeiras gratuitas para acompanhar cotações, simular investimentos e consultar preços de veículos.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="block p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all"
          >
            <div className="text-4xl mb-3">{tool.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.title}</h3>
            <p className="text-sm text-gray-600">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
