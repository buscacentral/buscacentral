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
    color: 'bg-green-50 border-green-200'
  },
  {
    title: 'Criptomoedas',
    description: 'Top 10 criptomoedas com variação 24h e conversor.',
    href: '/financeiro/criptomoedas',
    icon: '🪙',
    color: 'bg-orange-50 border-orange-200'
  },
  {
    title: 'Tabela FIPE',
    description: 'Consulte preços médios de veículos.',
    href: '/financeiro/tabela-fipe',
    icon: '🚗',
    color: 'bg-blue-50 border-blue-200'
  },
  {
    title: 'Simulador de Juros Compostos',
    description: 'Simule investimentos com aportes mensais.',
    href: '/financeiro/juros-compostos',
    icon: '📈',
    color: 'bg-purple-50 border-purple-200'
  },
  {
    title: 'Conversor CLT para PJ',
    description: 'Descubra quanto cobrar como PJ para equivaler ao salário CLT.',
    href: '/financeiro/conversor-clt-pj',
    icon: '💼',
    color: 'bg-blue-50 border-blue-200'
  },
  {
    title: 'Simulador de Financiamento de Carro',
    description: 'Simule parcelas pelos sistemas Price e SAC.',
    href: '/financeiro/financiamento-carro',
    icon: '🚙',
    color: 'bg-red-50 border-red-200'
  },
  {
    title: 'Calculadora de Rescisão Trabalhista',
    description: 'Calcule valores de rescisão para todos os tipos de demissão.',
    href: '/financeiro/rescisao-trabalhista',
    icon: '📋',
    color: 'bg-green-50 border-green-200'
  },
  {
    title: 'Simulador de Investimentos',
    description: 'Compare CDB, Tesouro Selic e Poupança.',
    href: '/financeiro/simulador-investimentos',
    icon: '💰',
    color: 'bg-blue-50 border-blue-200'
  },
];

export default function FinanceiroPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Central Financeira</h1>
      <p className="text-gray-600 mb-12">
        Ferramentas financeiras gratuitas para acompanhar cotações, simular investimentos e consultar preços de veículos.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`group block p-10 rounded-2xl border-2 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${tool.color}`}
          >
            <div className="text-7xl mb-6 transition-transform duration-300 group-hover:scale-110">{tool.icon}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{tool.title}</h3>
            <p className="text-base text-gray-600 leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
