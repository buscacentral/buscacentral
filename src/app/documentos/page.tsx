import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Central de Documentos',
  description: 'Ferramentas para documentos: gerador e validador de CPF e CNPJ. Consulta CNPJ pela Receita Federal.',
};

const tools = [
  { title: 'Gerador de CPF', description: 'Gere CPFs válidos e formatados para testes e desenvolvimento.', href: '/documentos/gerador-cpf', icon: '📄', color: 'bg-blue-50 border-blue-200' },
  { title: 'Validador de CPF', description: 'Verifique se um CPF é válido usando o algoritmo de dígito verificador.', href: '/documentos/validador-cpf', icon: '✅', color: 'bg-green-50 border-green-200' },
  { title: 'Gerador de CNPJ', description: 'Gere CNPJs válidos para testes de sistemas e cadastros.', href: '/documentos/gerador-cnpj', icon: '🏢', color: 'bg-purple-50 border-purple-200' },
  { title: 'Validador de CNPJ', description: 'Valide CNPJs com verificação oficial de dígito verificador.', href: '/documentos/validador-cnpj', icon: '🔍', color: 'bg-orange-50 border-orange-200' },
  { title: 'Consulta CNPJ', description: 'Consulte razão social, situação cadastral e endereço pela Receita Federal.', href: '/documentos/consulta-cnpj', icon: '🔎', color: 'bg-blue-50 border-blue-200' },
];

const sugestoes = [
  { title: 'Busca de CEP', href: '/localizacao/busca-cep', icon: '📍' },
  { title: 'Cotação de Moedas', href: '/financeiro/cotacao', icon: '💱' },
  { title: 'Gerador de QR Code', href: '/utilidades/gerador-qr-code', icon: '📱' },
];

export default function DocumentosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Central de Documentos</h1>
      <p className="text-gray-600 mb-4">
        Ferramentas para geração e validação de documentos brasileiros.
        Gere CPFs e CNPJs válidos para testes ou consulte dados reais de empresas pela Receita Federal.
      </p>
      <p className="text-sm text-gray-500 mb-10">
        Todos os CPFs e CNPJs gerados são fictícios e destinados exclusivamente a testes e desenvolvimento.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`block p-6 rounded-xl border-2 hover:shadow-lg transition-all ${tool.color}`}
          >
            <div className="text-4xl mb-3">{tool.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.title}</h3>
            <p className="text-sm text-gray-600">{tool.description}</p>
          </Link>
        ))}
      </div>

      <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Ferramentas Relacionadas</h2>
        <p className="text-sm text-gray-500 mb-4">Outras ferramentas que podem ser úteis</p>
        <div className="flex flex-wrap gap-3">
          {sugestoes.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all text-sm font-medium text-gray-700"
            >
              <span>{s.icon}</span>
              {s.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
