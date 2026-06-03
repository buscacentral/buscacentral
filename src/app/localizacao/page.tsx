import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Central de Localização',
  description: 'Ferramentas de localização: busca de CEP, distância entre cidades e links para WhatsApp.',
};

const tools = [
  { title: 'Busca de CEP', description: 'Consulte endereços por CEP ou busque CEPs por endereço.', href: '/localizacao/busca-cep', icon: '📍' },
  { title: 'Distância entre Cidades', description: 'Calcule a distância entre cidades brasileiras.', href: '/localizacao/distancia-cidades', icon: '🗺️' },
  { title: 'Gerador de Link WhatsApp', description: 'Crie links e QR Codes para WhatsApp.', href: '/localizacao/whatsapp-link', icon: '💬' },
];

export default function LocalizacaoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Central de Localização</h1>
      <p className="text-gray-600 mb-8">
        Ferramentas de localização para consultas de endereço, distâncias e comunicação.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
