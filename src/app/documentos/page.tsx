import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Central de Documentos',
  description: 'Ferramentas para documentos: gerador e validador de CPF e CNPJ.',
};

const tools = [
  { title: 'Gerador de CPF', description: 'Gere CPFs válidos e formatados para testes.', href: '/documentos/gerador-cpf', icon: '📄' },
  { title: 'Validador de CPF', description: 'Verifique se um CPF é válido.', href: '/documentos/validador-cpf', icon: '✅' },
  { title: 'Gerador de CNPJ', description: 'Gere CNPJs válidos para testes.', href: '/documentos/gerador-cnpj', icon: '🏢' },
  { title: 'Validador de CNPJ', description: 'Valide CNPJs com verificação oficial.', href: '/documentos/validador-cnpj', icon: '🔍' },
];

export default function DocumentosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Central de Documentos</h1>
      <p className="text-gray-600 mb-8">
        Ferramentas para geração e validação de documentos brasileiros.
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
