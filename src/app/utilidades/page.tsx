import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Central de Utilidades',
  description: 'Ferramentas úteis gratuitas: QR Code, senhas, UUID, textos, imagens e muito mais.',
};

const tools = [
  { title: 'Gerador de QR Code', description: 'Gere QR Codes a partir de textos ou URLs.', href: '/utilidades/gerador-qr-code', icon: '📱' },
  { title: 'Gerador de Senha', description: 'Gere senhas seguras e aleatórias.', href: '/utilidades/gerador-senha', icon: '🔐' },
  { title: 'Gerador de UUID', description: 'Gere UUIDs v4 aleatórios.', href: '/utilidades/gerador-uuid', icon: '🆔' },
  { title: 'Codificador Base64', description: 'Codifique ou decodifique textos em Base64.', href: '/utilidades/base64', icon: '🔄' },
  { title: 'Contador de Caracteres', description: 'Conte caracteres, palavras e linhas.', href: '/utilidades/contador-caracteres', icon: '🔢' },
  { title: 'PIX Copia e Cola', description: 'Gere códigos PIX no padrão EMV.', href: '/utilidades/pix-copia-cola', icon: '💳' },
  { title: 'Conversor de Timestamp', description: 'Converta entre timestamp Unix e data/hora.', href: '/utilidades/timestamp', icon: '⏰' },
  { title: 'Comparador de Textos', description: 'Compare dois textos e veja as diferenças.', href: '/utilidades/comparador-textos', icon: '📝' },
  { title: 'Removedor de Duplicatas', description: 'Remova linhas duplicadas e ordene listas.', href: '/utilidades/removedor-duplicatas', icon: '🧹' },
  { title: 'Conversor de Caixa', description: 'Transforme texto em MAIÚSCULO, minúsculo, etc.', href: '/utilidades/conversor-caixa', icon: '🔡' },
  { title: 'Conversor de Imagens', description: 'Converta imagens entre WebP, PNG e JPG.', href: '/utilidades/conversor-imagens', icon: '🖼️' },
  { title: 'Seletor de Cores', description: 'Esquemas de cores em HEX, RGB e HSL.', href: '/utilidades/seletor-cores', icon: '🎨' },
  { title: 'Extrator de Emails', description: 'Extraia emails de qualquer texto ou documento.', href: '/utilidades/extrator-emails', icon: '📧' },
  { title: 'Gerador de Link WhatsApp', description: 'Crie links e QR Codes para WhatsApp.', href: '/utilidades/whatsapp-link', icon: '💬' },
];

export default function UtilidadesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Central de Utilidades</h1>
      <p className="text-gray-600 mb-8">
        Ferramentas úteis para o dia a dia: gere senhas, QR Codes, converta textos e muito mais.
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
