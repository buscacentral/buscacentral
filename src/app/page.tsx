import SearchBar from '@/components/SearchBar';
import ToolCard from '@/components/ToolCard';
import AdPlaceholder from '@/components/AdPlaceholder';

const mainTools = [
  { title: 'Gerador de CPF', description: 'Gere CPFs válidos para testes.', href: '/documentos/gerador-cpf', icon: '📄', color: 'blue' as const },
  { title: 'Validador de CPF', description: 'Verifique se um CPF é válido.', href: '/documentos/validador-cpf', icon: '✅', color: 'green' as const },
  { title: 'Gerador de CNPJ', description: 'Gere CNPJs válidos para testes.', href: '/documentos/gerador-cnpj', icon: '🏢', color: 'purple' as const },
  { title: 'Busca de CEP', description: 'Consulte endereços por CEP.', href: '/localizacao/busca-cep', icon: '📍', color: 'blue' as const },
  { title: 'Cotação de Moedas', description: 'USD, EUR, GBP, BTC em tempo real.', href: '/financeiro/cotacao', icon: '💱', color: 'green' as const },
  { title: 'Criptomoedas', description: 'Top 10 crypto com variação 24h.', href: '/financeiro/criptomoedas', icon: '🪙', color: 'purple' as const },
  { title: 'Tabela FIPE', description: 'Preços médios de veículos.', href: '/financeiro/tabela-fipe', icon: '🚗', color: 'orange' as const },
  { title: 'Juros Compostos', description: 'Simule seus investimentos.', href: '/financeiro/juros-compostos', icon: '📈', color: 'blue' as const },
  { title: 'Gerador de QR Code', description: 'Gere QR Codes e baixe em PNG.', href: '/utilidades/gerador-qr-code', icon: '📱', color: 'green' as const },
  { title: 'Gerador de Senha', description: 'Senhas seguras e aleatórias.', href: '/utilidades/gerador-senha', icon: '🔐', color: 'purple' as const },
  { title: 'Comparador de Textos', description: 'Compare textos e veja diferenças.', href: '/utilidades/comparador-textos', icon: '📝', color: 'orange' as const },
  { title: 'Conversor de Imagens', description: 'WebP, PNG e JPG localmente.', href: '/utilidades/conversor-imagens', icon: '🖼️', color: 'blue' as const },
  { title: 'Link WhatsApp', description: 'Crie links e QR Code para WhatsApp.', href: '/utilidades/whatsapp-link', icon: '💬', color: 'green' as const },
  { title: 'PIX Copia e Cola', description: 'Gere códigos PIX EMV.', href: '/utilidades/pix-copia-cola', icon: '💳', color: 'purple' as const },
  { title: 'Seletor de Cores', description: 'Cores em HEX, RGB e HSL.', href: '/utilidades/seletor-cores', icon: '🎨', color: 'orange' as const },
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
          marginBottom: '2rem',
          fontSize: '1.1rem',
        }}>
          Ferramentas gratuitas essenciais em um só lugar, rápidas e sem cadastro.
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
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
          background: '#f8fafc',
          borderRadius: '16px',
          padding: '2rem',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#0f172a',
            textAlign: 'center',
            marginBottom: '1.5rem',
          }}>
            Explore por Categoria
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {[
              { name: 'Documentos', href: '/documentos', icon: '📄', count: 4 },
              { name: 'Localização', href: '/localizacao', icon: '📍', count: 2 },
              { name: 'Financeiro', href: '/financeiro', icon: '💱', count: 4 },
              { name: 'Utilidades', href: '/utilidades', icon: '🛠️', count: 14 },
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
