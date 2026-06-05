import SearchBar from '@/components/SearchBar';
import ToolCard from '@/components/ToolCard';
import AdPlaceholder from '@/components/AdPlaceholder';

const mainTools = [
  { title: 'Gerador de CPF', description: 'Gere CPFs válidos para testes e desenvolvimento.', href: '/documentos/gerador-cpf', icon: '📄', color: 'blue' as const },
  { title: 'Busca de CEP', description: 'Consulte endereços completos por CEP em tempo real.', href: '/localizacao/busca-cep', icon: '📍', color: 'green' as const },
  { title: 'Cotação de Moedas', description: 'USD, EUR, GBP, BTC em tempo real pela AwesomeAPI.', href: '/financeiro/cotacao', icon: '💱', color: 'purple' as const },
  { title: 'Tabela FIPE', description: 'Preços médios de veículos novos e usados no Brasil.', href: '/financeiro/tabela-fipe', icon: '🚗', color: 'orange' as const },
  { title: 'Conversor CLT → PJ', description: 'Descubra quanto faturar como PJ para manter seu salário.', href: '/financeiro/conversor-clt-pj', icon: '💰', color: 'blue' as const },
  { title: 'Gerador de QR Code', description: 'Gere QR Codes a partir de textos ou URLs e baixe em PNG.', href: '/utilidades/gerador-qr-code', icon: '📱', color: 'green' as const },
  { title: 'Calculadora de IMC', description: 'Calcule seu IMC, veja classificação OMS e TMB.', href: '/utilidades/calculadora-imc', icon: '⚖️', color: 'purple' as const },
  { title: 'Tabela de Calorias', description: 'Consulte calorias e nutrientes de 200 alimentos (TACO/IBGE).', href: '/utilidades/tabela-calorias', icon: '🍎', color: 'orange' as const },
];

export default function Home() {
  return (
    <main>
      <section className="text-center mx-auto mt-12 mb-16 max-w-4xl px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
          O que você deseja buscar ou gerar?
        </h1>
        <p className="text-slate-500 mb-6 text-xl md:text-2xl max-w-3xl mx-auto">
          Ferramentas gratuitas essenciais em um só lugar, rápidas e sem cadastro.
        </p>
        <p className="bg-blue-50 text-blue-600 inline-block px-6 py-2 rounded-full text-sm md:text-base font-bold mb-10 shadow-sm border border-blue-100">
          34 ferramentas gratuitas
        </p>
        
        <SearchBar />
      </section>

      <h2 className="text-center text-3xl md:text-4xl font-extrabold text-slate-900 mb-10 tracking-tight">
        Ferramentas Populares
      </h2>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mainTools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>

      <AdPlaceholder position="middle" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-3xl p-8 md:p-12 border border-blue-100 shadow-sm">
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-3">
            Explore por Categoria
          </h2>
          <p className="text-center text-slate-500 mb-10 text-lg">
            Encontre a ferramenta ideal para cada necessidade
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'Documentos', href: '/documentos', icon: '📄', count: 5 },
              { name: 'Localização', href: '/localizacao', icon: '📍', count: 2 },
              { name: 'Financeiro', href: '/financeiro', icon: '💱', count: 8 },
              { name: 'Utilidades', href: '/utilidades', icon: '🛠️', count: 18 },
            ].map((cat) => (
              <a
                key={cat.href}
                href={cat.href}
                className="group flex items-center gap-6 p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-5xl transition-transform duration-300 group-hover:scale-110">{cat.icon}</span>
                <div>
                  <p className="text-base md:text-lg font-bold text-slate-900 mb-1">{cat.name}</p>
                  <p className="text-sm md:text-base text-slate-500 font-medium">{cat.count} ferramentas</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
