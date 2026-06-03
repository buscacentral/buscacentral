import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://buscacentral.com.br';

  const staticPages = [
    '',
    '/documentos',
    '/documentos/gerador-cpf',
    '/documentos/validador-cpf',
    '/documentos/gerador-cnpj',
    '/documentos/validador-cnpj',
    '/documentos/consulta-cnpj',
    '/localizacao',
    '/localizacao/busca-cep',
    '/localizacao/distancia-cidades',
    '/financeiro',
    '/financeiro/cotacao',
    '/financeiro/criptomoedas',
    '/financeiro/tabela-fipe',
    '/financeiro/juros-compostos',
    '/financeiro/conversor-clt-pj',
    '/financeiro/financiamento-carro',
    '/financeiro/rescisao-trabalhista',
    '/financeiro/simulador-investimentos',
    '/utilidades',
    '/utilidades/gerador-qr-code',
    '/utilidades/gerador-senha',
    '/utilidades/gerador-uuid',
    '/utilidades/base64',
    '/utilidades/contador-caracteres',
    '/utilidades/pix-copia-cola',
    '/utilidades/timestamp',
    '/utilidades/comparador-textos',
    '/utilidades/removedor-duplicatas',
    '/utilidades/conversor-caixa',
    '/utilidades/conversor-imagens',
    '/utilidades/seletor-cores',
    '/utilidades/extrator-emails',
    '/utilidades/whatsapp-link',
    '/utilidades/dias-uteis',
    '/utilidades/formatador-codigo',
    '/utilidades/calculadora-imc',
    '/sobre',
    '/privacidade',
    '/termos',
  ];

  return staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1 : 0.8,
  }));
}
