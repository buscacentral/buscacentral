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
    title: 'Gerador de QR Code',
    description: 'Gere QR Codes a partir de textos ou URLs.',
    href: '/utilidades/gerador-qr-code',
    icon: '📱',
    color: 'purple' as const,
  },
  {
    title: 'Gerador de Senha',
    description: 'Gere senhas seguras e aleatórias.',
    href: '/utilidades/gerador-senha',
    icon: '🔐',
    color: 'orange' as const,
  },
  {
    title: 'Gerador de UUID',
    description: 'Gere UUIDs v4 aleatórios.',
    href: '/utilidades/gerador-uuid',
    icon: '🆔',
    color: 'blue' as const,
  },
  {
    title: 'Codificador Base64',
    description: 'Codifique ou decodifique textos em Base64.',
    href: '/utilidades/base64',
    icon: '🔄',
    color: 'green' as const,
  },
  {
    title: 'Contador de Caracteres',
    description: 'Conte caracteres, palavras e linhas.',
    href: '/utilidades/contador-caracteres',
    icon: '🔢',
    color: 'purple' as const,
  },
  {
    title: 'PIX Copia e Cola',
    description: 'Gere códigos PIX no padrão EMV.',
    href: '/utilidades/pix-copia-cola',
    icon: '💳',
    color: 'orange' as const,
  },
  {
    title: 'Conversor de Timestamp',
    description: 'Converta entre timestamp Unix e data/hora.',
    href: '/utilidades/timestamp',
    icon: '⏰',
    color: 'blue' as const,
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Busca<span className="text-blue-600">Central</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Central de ferramentas online gratuitas do Brasil. Consultas rápidas, sem cadastro, sem custo.
        </p>
        <SearchBar />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Ferramentas Disponíveis
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </section>

      <section className="mt-16 bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Por que usar o BuscaCentral?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-semibold text-lg mb-2">Rápido e Simples</h3>
            <p className="text-gray-600 text-sm">Resultados instantâneos sem cadastro ou espera.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-semibold text-lg mb-2">100% Seguro</h3>
            <p className="text-gray-600 text-sm">Ferramentas rodam no navegador. Seus dados nunca saem do seu computador.</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-semibold text-lg mb-2">Totalmente Gratuito</h3>
            <p className="text-gray-600 text-sm">Sem planos pagos, sem limites, sem pegadinhas.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
