import SearchBar from '@/components/SearchBar';
import ToolCard from '@/components/ToolCard';

const tools = [
  {
    title: 'Gerador de CPF',
    description: 'Gere CPFs válidos e formatados para testes e desenvolvimento.',
    href: '/documentos/gerador-cpf',
    icon: '📄',
    color: 'blue' as const,
  },
  {
    title: 'Validador de CPF',
    description: 'Verifique se um CPF é válido usando o algoritmo oficial.',
    href: '/documentos/validador-cpf',
    icon: '✅',
    color: 'green' as const,
  },
  {
    title: 'Gerador de CNPJ',
    description: 'Gere CNPJs válidos para testes de sistemas.',
    href: '/documentos/gerador-cnpj',
    icon: '🏢',
    color: 'purple' as const,
  },
  {
    title: 'Validador de CNPJ',
    description: 'Valide CNPJs com verificação de dígitos verificadores.',
    href: '/documentos/validador-cnpj',
    icon: '🔍',
    color: 'orange' as const,
  },
  {
    title: 'Busca de CEP',
    description: 'Consulte endereços por CEP ou busque CEPs por endereço.',
    href: '/localizacao/busca-cep',
    icon: '📍',
    color: 'blue' as const,
  },
  {
    title: 'Distância entre Cidades',
    description: 'Calcule a distância entre cidades brasileiras.',
    href: '/localizacao/distancia-cidades',
    icon: '🗺️',
    color: 'green' as const,
  },
  {
    title: 'Cotação de Moedas',
    description: 'Cotações em tempo real: USD, EUR, GBP, ARS, BTC.',
    href: '/financeiro/cotacao',
    icon: '💱',
    color: 'purple' as const,
  },
  {
    title: 'Tabela FIPE',
    description: 'Consulte preços médios de veículos.',
    href: '/financeiro/tabela-fipe',
    icon: '🚗',
    color: 'orange' as const,
  },
  {
    title: 'Gerador de QR Code',
    description: 'Gere QR Codes a partir de textos ou URLs.',
    href: '/utilidades/gerador-qr-code',
    icon: '📱',
    color: 'blue' as const,
  },
  {
    title: 'Gerador de Senha',
    description: 'Gere senhas seguras e aleatórias.',
    href: '/utilidades/gerador-senha',
    icon: '🔐',
    color: 'green' as const,
  },
  {
    title: 'Gerador de UUID',
    description: 'Gere UUIDs v4 aleatórios.',
    href: '/utilidades/gerador-uuid',
    icon: '🆔',
    color: 'purple' as const,
  },
  {
    title: 'Codificador Base64',
    description: 'Codifique ou decodifique textos em Base64.',
    href: '/utilidades/base64',
    icon: '🔄',
    color: 'orange' as const,
  },
  {
    title: 'Contador de Caracteres',
    description: 'Conte caracteres, palavras e linhas.',
    href: '/utilidades/contador-caracteres',
    icon: '🔢',
    color: 'blue' as const,
  },
  {
    title: 'PIX Copia e Cola',
    description: 'Gere códigos PIX no padrão EMV.',
    href: '/utilidades/pix-copia-cola',
    icon: '💳',
    color: 'green' as const,
  },
  {
    title: 'Conversor de Timestamp',
    description: 'Converta entre timestamp Unix e data/hora.',
    href: '/utilidades/timestamp',
    icon: '⏰',
    color: 'purple' as const,
  },
];

export default function Home() {
  return (
    <main>
      {/* Bloco de Anúncio Superior (AdSense) */}
      <div style={{
        maxWidth: '1200px',
        margin: '1.5rem auto',
        padding: '1rem',
        background: '#f8fafc',
        border: '1px dashed #e2e8f0',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '0.875rem',
      }}>
        Anúncio Publicitário - Google AdSense
      </div>

      {/* Seção de Boas-vindas e Busca Global Interna */}
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

      {/* Título das Ferramentas */}
      <h2 style={{
        textAlign: 'center',
        fontSize: '1.8rem',
        marginBottom: '2.5rem',
        color: '#0f172a',
        fontWeight: 700,
      }}>
        Ferramentas Disponíveis
      </h2>

      {/* Grid de Cards */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem 4rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem',
      }}>
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>

      {/* Seção Por que usar */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto 4rem',
        padding: '0 1rem',
      }}>
        <div style={{
          background: '#f8fafc',
          borderRadius: '16px',
          padding: '3rem 2rem',
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#0f172a',
            textAlign: 'center',
            marginBottom: '2.5rem',
          }}>
            Por que usar o BuscaCentral?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚡</div>
              <h3 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                Rápido e Simples
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Resultados instantâneos sem cadastro ou espera.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔒</div>
              <h3 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                100% Seguro
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Ferramentas rodam no navegador. Seus dados nunca saem do seu computador.
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💰</div>
              <h3 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                Totalmente Gratuito
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Sem planos pagos, sem limites, sem pegadinhas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco de Anúncio Inferior (AdSense) */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 2rem',
        padding: '1rem',
        background: '#f8fafc',
        border: '1px dashed #e2e8f0',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '0.875rem',
      }}>
        Anúncio Publicitário - Google AdSense
      </div>
    </main>
  );
}
