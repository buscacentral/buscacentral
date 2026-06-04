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
      <section style={{
        textAlign: 'center',
        margin: '3rem auto 4rem auto',
        maxWidth: '600px',
        padding: '0 1rem',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '0.75rem',
          color: '#0f172a',
          fontWeight: 700,
        }}>
          O que você deseja buscar ou gerar?
        </h1>
        <p style={{
          color: '#64748b',
          marginBottom: '1rem',
          fontSize: '1.1rem',
        }}>
          Ferramentas gratuitas essenciais em um só lugar, rápidas e sem cadastro.
        </p>
        <p style={{
          background: '#eff6ff',
          color: '#2563eb',
          display: 'inline-block',
          padding: '0.5rem 1.25rem',
          borderRadius: '50px',
          fontSize: '0.9rem',
          fontWeight: 600,
          marginBottom: '2rem',
        }}>
          34 ferramentas gratuitas
        </p>
        
        <SearchBar />
      </section>

      <h2 style={{
        textAlign: 'center',
        fontSize: '1.8rem',
        marginBottom: '2.5rem',
        color: '#0f172a',
        fontWeight: 700,
      }}>
        Ferramentas Populares
      </h2>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem 4rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}>
        {mainTools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>

      <AdPlaceholder position="middle" />

      <section style={{
        maxWidth: '1200px',
        margin: '0 auto 4rem',
        padding: '0 1rem',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #eff6ff 50%, #f0fdf4 100%)',
          borderRadius: '20px',
          padding: '2.5rem',
          border: '1px solid #e0f2fe',
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#0f172a',
            textAlign: 'center',
            marginBottom: '0.5rem',
          }}>
            Explore por Categoria
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#64748b',
            marginBottom: '2rem',
            fontSize: '1rem',
          }}>
            Encontre a ferramenta ideal para cada necessidade
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}>
            {[
              { name: 'Documentos', href: '/documentos', icon: '📄', count: 5 },
              { name: 'Localização', href: '/localizacao', icon: '📍', count: 2 },
              { name: 'Financeiro', href: '/financeiro', icon: '💱', count: 8 },
              { name: 'Utilidades', href: '/utilidades', icon: '🛠️', count: 18 },
              { name: 'Compras', href: '/produtos', icon: '🛒', count: 1 },
            ].map((cat) => (
              <a
                key={cat.href}
                href={cat.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textDecoration: 'none',
                  color: '#1e293b',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                <div>
                  <p style={{ fontWeight: 600 }}>{cat.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{cat.count} ferramentas</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
