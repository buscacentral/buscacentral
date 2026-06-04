import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Central de Utilidades',
  description: 'Ferramentas úteis gratuitas: QR Code, senhas, UUID, textos, imagens e muito mais.',
};

const subcategorias = [
  {
    nome: 'Texto e Código',
    icon: '💻',
    ferramentas: [
      { title: 'Codificador Base64', description: 'Codifique ou decodifique textos em Base64.', href: '/utilidades/base64', icon: '🔄' },
      { title: 'Formatador de JSON e XML', description: 'Formate, minifique e valide JSON e XML.', href: '/utilidades/formatador-codigo', icon: '📋' },
      { title: 'Comparador de Textos', description: 'Compare dois textos e veja as diferenças.', href: '/utilidades/comparador-textos', icon: '📝' },
      { title: 'Contador de Caracteres', description: 'Conte caracteres, palavras e linhas.', href: '/utilidades/contador-caracteres', icon: '🔢' },
      { title: 'Removedor de Duplicatas', description: 'Remova linhas duplicadas e ordene listas.', href: '/utilidades/removedor-duplicatas', icon: '🧹' },
      { title: 'Conversor de Caixa', description: 'Transforme texto em MAIÚSCULO, minúsculo, etc.', href: '/utilidades/conversor-caixa', icon: '🔡' },
    ],
  },
  {
    nome: 'Geradores',
    icon: '⚡',
    ferramentas: [
      { title: 'Gerador de QR Code', description: 'Gere QR Codes a partir de textos ou URLs.', href: '/utilidades/gerador-qr-code', icon: '📱' },
      { title: 'Gerador de Senha', description: 'Gere senhas seguras e aleatórias.', href: '/utilidades/gerador-senha', icon: '🔐' },
      { title: 'Gerador de UUID', description: 'Gere UUIDs v4 aleatórios.', href: '/utilidades/gerador-uuid', icon: '🆔' },
      { title: 'Gerador de Link WhatsApp', description: 'Crie links e QR Codes para WhatsApp.', href: '/utilidades/whatsapp-link', icon: '💬' },
      { title: 'PIX Copia e Cola', description: 'Gere códigos PIX no padrão EMV.', href: '/utilidades/pix-copia-cola', icon: '💳' },
    ],
  },
  {
    nome: 'Saúde e Bem-estar',
    icon: '❤️',
    ferramentas: [
      { title: 'Calculadora de IMC', description: 'Calcule seu IMC, classificação OMS e TMB.', href: '/utilidades/calculadora-imc', icon: '⚖️' },
      { title: 'Tabela de Calorias', description: 'Consulte calorias e nutrientes de 200 alimentos (TACO/IBGE).', href: '/utilidades/tabela-calorias', icon: '🍎' },
    ],
  },
  {
    nome: 'Datas e Tempo',
    icon: '📅',
    ferramentas: [
      { title: 'Calculadora de Dias Úteis', description: 'Calcule dias úteis entre duas datas com feriados.', href: '/utilidades/dias-uteis', icon: '📅' },
      { title: 'Conversor de Timestamp', description: 'Converta entre timestamp Unix e data/hora.', href: '/utilidades/timestamp', icon: '⏰' },
    ],
  },
  {
    nome: 'Mídia',
    icon: '🎨',
    ferramentas: [
      { title: 'Conversor de Imagens', description: 'Converta imagens entre WebP, PNG e JPG.', href: '/utilidades/conversor-imagens', icon: '🖼️' },
      { title: 'Seletor de Cores', description: 'Esquemas de cores em HEX, RGB e HSL.', href: '/utilidades/seletor-cores', icon: '🎨' },
      { title: 'Extrator de Emails', description: 'Extraia emails de qualquer texto ou documento.', href: '/utilidades/extrator-emails', icon: '📧' },
    ],
  },
];

export default function UtilidadesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Central de Utilidades</h1>
      <p className="text-gray-600 mb-10">
        Ferramentas úteis para o dia a dia organizadas por categoria.
        Gere senhas, QR Codes, converta textos e muito mais — tudo gratuito e sem cadastro.
      </p>

      {subcategorias.map((sub) => (
        <section key={sub.nome} className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{sub.icon}</span>
            <h2 className="text-xl font-bold text-gray-900">{sub.nome}</h2>
            <span className="text-sm text-gray-400 ml-1">{sub.ferramentas.length} ferramentas</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sub.ferramentas.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-2">{tool.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{tool.title}</h3>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
