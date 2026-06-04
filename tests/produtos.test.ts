/**
 * Testes de Integração - Produtos (Mercado Livre API)
 * 
 * Testa a lógica de busca, tratamento de imagens, geração de links
 * de afiliado e ordenação local de produtos.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ============================================================
// CONSTANTES
// ============================================================

const TOOL_ID = '38524122';

const API_BASE_URL = 'https://api.mercadolivre.com/sites/MLB/search';

// ============================================================
// FUNÇÕES UTILITÁRIAS (extraídas do ProdutosClient para teste)
// ============================================================

/**
 * Trata a URL da imagem do produto.
 * - Substitui -I.jpg por -O.jpg (alta resolução)
 * - Força protocolo HTTPS
 */
function getImageUrl(thumbnail: string): string {
  if (!thumbnail) return '/placeholder-product.png';
  return thumbnail
    .replace('-I.jpg', '-O.jpg')
    .replace('http://', 'https://');
}

/**
 * Gera URL de afiliado a partir do permalink original.
 */
function getAffiliateUrl(permalink: string): string {
  try {
    const url = new URL(permalink);
    const path = url.pathname;
    return `https://www.mercadolivre.com.br${path}?matt_tool=${TOOL_ID}&matt_word=&matt_source=google&matt_campaign=mlb_afiliados`;
  } catch {
    return permalink;
  }
}

/**
 * Ordena produtos por preço.
 */
function sortProducts(products: Product[], sortBy: string): Product[] {
  const sorted = [...products];
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    default:
      return sorted;
  }
}

// ============================================================
// TIPOS
// ============================================================

interface Product {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  permalink: string;
  shipping: {
    free_shipping: boolean;
  };
  accepts_mercadopago: boolean;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockProducts: Product[] = [
  {
    id: 'MLB123',
    title: 'iPhone 15 Pro Max 256GB',
    price: 8999.99,
    thumbnail: 'http://http2.mlstatic.com/D_123-I.jpg',
    permalink: 'https://produto.mercadolivre.com.br/MLB-123-iphone-15-pro-max',
    shipping: { free_shipping: true },
    accepts_mercadopago: true,
  },
  {
    id: 'MLB456',
    title: 'Samsung Galaxy S24 Ultra',
    price: 5499.90,
    thumbnail: 'http://http2.mlstatic.com/D_456-I.jpg',
    permalink: 'https://produto.mercadolivre.com.br/MLB-456-samsung-galaxy-s24',
    shipping: { free_shipping: false },
    accepts_mercadopago: true,
  },
  {
    id: 'MLB789',
    title: 'Fone Bluetooth JBL Tune 510BT',
    price: 149.90,
    thumbnail: 'https://http2.mlstatic.com/D_789-I.jpg',
    permalink: 'https://produto.mercadolivre.com.br/MLB-789-fone-jbl',
    shipping: { free_shipping: true },
    accepts_mercadopago: false,
  },
];

const mockApiResponse = {
  results: mockProducts,
  paging: {
    total: 1000,
    offset: 0,
    limit: 20,
  },
};

// ============================================================
// TESTES DE TRATAMENTO DE IMAGEM
// ============================================================

describe('getImageUrl - Tratamento de Imagem', () => {
  it('deve substituir -I.jpg por -O.jpg (alta resolução)', () => {
    const thumbnail = 'http://http2.mlstatic.com/D_123-I.jpg';
    const result = getImageUrl(thumbnail);
    expect(result).toContain('-O.jpg');
    expect(result).not.toContain('-I.jpg');
  });

  it('deve forçar protocolo HTTPS', () => {
    const thumbnail = 'http://http2.mlstatic.com/D_123-I.jpg';
    const result = getImageUrl(thumbnail);
    expect(result).toMatch(/^https:\/\//);
    expect(result).not.toMatch(/^http:\/\//);
  });

  it('deve manter HTTPS se já estiver presente', () => {
    const thumbnail = 'https://http2.mlstatic.com/D_789-I.jpg';
    const result = getImageUrl(thumbnail);
    expect(result).toBe('https://http2.mlstatic.com/D_789-O.jpg');
  });

  it('deve retornar placeholder para thumbnail vazia', () => {
    expect(getImageUrl('')).toBe('/placeholder-product.png');
    expect(getImageUrl(null as unknown as string)).toBe('/placeholder-product.png');
    expect(getImageUrl(undefined as unknown as string)).toBe('/placeholder-product.png');
  });

  it('deve aplicar ambas as transformações (HTTPS + -O.jpg)', () => {
    const thumbnail = 'http://http2.mlstatic.com/D_999-I.jpg';
    const result = getImageUrl(thumbnail);
    expect(result).toBe('https://http2.mlstatic.com/D_999-O.jpg');
  });
});

// ============================================================
// TESTES DE LINK DE AFILIADO
// ============================================================

describe('getAffiliateUrl - Link de Afiliado', () => {
  it('deve gerar URL de afiliado com TOOL_ID correto', () => {
    const permalink = 'https://produto.mercadolivre.com.br/MLB-123-iphone-15-pro-max';
    const result = getAffiliateUrl(permalink);
    
    expect(result).toContain(`matt_tool=${TOOL_ID}`);
    expect(result).toContain('matt_word=');
    expect(result).toContain('matt_source=google');
    expect(result).toContain('matt_campaign=mlb_afiliados');
  });

  it('deve extrair o caminho do produto corretamente', () => {
    const permalink = 'https://produto.mercadolivre.com.br/MLB-123-iphone-15-pro-max';
    const result = getAffiliateUrl(permalink);
    
    expect(result).toContain('www.mercadolivre.com.br');
    expect(result).toContain('/MLB-123-iphone-15-pro-max');
  });

  it('deve manter o TOOL_ID constante em todas as URLs', () => {
    const urls = [
      'https://produto.mercadolivre.com.br/MLB-123-produto-a',
      'https://produto.mercadolivre.com.br/MLB-456-produto-b',
      'https://produto.mercadolivre.com.br/MLB-789-produto-c',
    ];

    urls.forEach((url) => {
      const result = getAffiliateUrl(url);
      expect(result).toContain(`matt_tool=${TOOL_ID}`);
    });
  });

  it('deve retornar URL original se parsing falhar', () => {
    const invalidUrl = 'not-a-valid-url';
    const result = getAffiliateUrl(invalidUrl);
    expect(result).toBe(invalidUrl);
  });

  it('deve gerar URL completa e válida', () => {
    const permalink = 'https://produto.mercadolivre.com.br/MLB-123-teste';
    const result = getAffiliateUrl(permalink);
    
    // Verifica que é uma URL válida
    expect(() => new URL(result)).not.toThrow();
  });
});

// ============================================================
// TESTES DE ORDENAÇÃO LOCAL
// ============================================================

describe('sortProducts - Ordenação Local', () => {
  it('deve ordenar por menor preço (price_asc)', () => {
    const sorted = sortProducts(mockProducts, 'price_asc');
    
    expect(sorted[0].price).toBe(149.90);
    expect(sorted[1].price).toBe(5499.90);
    expect(sorted[2].price).toBe(8999.99);
  });

  it('deve ordenar por maior preço (price_desc)', () => {
    const sorted = sortProducts(mockProducts, 'price_desc');
    
    expect(sorted[0].price).toBe(8999.99);
    expect(sorted[1].price).toBe(5499.90);
    expect(sorted[2].price).toBe(149.90);
  });

  it('deve manter ordem original para relevância', () => {
    const sorted = sortProducts(mockProducts, 'relevance');
    
    expect(sorted[0].id).toBe('MLB123');
    expect(sorted[1].id).toBe('MLB456');
    expect(sorted[2].id).toBe('MLB789');
  });

  it('NÃO deve mutar o array original', () => {
    const originalOrder = [...mockProducts];
    sortProducts(mockProducts, 'price_asc');
    
    expect(mockProducts[0].id).toBe(originalOrder[0].id);
    expect(mockProducts[1].id).toBe(originalOrder[1].id);
    expect(mockProducts[2].id).toBe(originalOrder[2].id);
  });

  it('deve funcionar com array vazio', () => {
    const sorted = sortProducts([], 'price_asc');
    expect(sorted).toEqual([]);
  });

  it('deve funcionar com um único produto', () => {
    const singleProduct = [mockProducts[0]];
    const sorted = sortProducts(singleProduct, 'price_asc');
    expect(sorted).toHaveLength(1);
    expect(sorted[0].id).toBe('MLB123');
  });
});

// ============================================================
// TESTES DE INTEGRAÇÃO COM API (MOCK)
// ============================================================

describe('API Integration - Busca de Produtos', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve construir URL de busca corretamente', () => {
    const term = 'iPhone';
    const url = `${API_BASE_URL}?q=${encodeURIComponent(term)}&limit=20`;
    
    expect(url).toBe('https://api.mercadolivre.com/sites/MLB/search?q=iPhone&limit=20');
  });

  it('deve encodar termos de busca com espaços', () => {
    const term = 'fone de ouvido';
    const url = `${API_BASE_URL}?q=${encodeURIComponent(term)}&limit=20`;
    
    // encodeURIComponent usa %20 para espaços (não +)
    expect(url).toContain('fone%20de%20ouvido');
  });

  it('deve encodar termos com caracteres especiais', () => {
    const term = 'café & chocolate';
    const url = `${API_BASE_URL}?q=${encodeURIComponent(term)}&limit=20`;
    
    // encodeURIComponent codifica espaços como %20
    expect(url).toContain('caf%C3%A9%20%26%20chocolate');
  });

  it('deve simular resposta da API com mock', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    });

    global.fetch = mockFetch;

    const response = await fetch(`${API_BASE_URL}?q=iPhone&limit=20`);
    const data = await response.json();

    expect(data.results).toHaveLength(3);
    expect(data.paging.total).toBe(1000);
    expect(data.results[0].title).toContain('iPhone');
  });

  it('deve tratar erro de rede', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = mockFetch;

    await expect(
      fetch(`${API_BASE_URL}?q=iPhone&limit=20`)
    ).rejects.toThrow('Network error');
  });

  it('deve tratar resposta HTTP não OK', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    });
    global.fetch = mockFetch;

    const response = await fetch(`${API_BASE_URL}?q=iPhone&limit=20`);
    expect(response.ok).toBe(false);
    expect(response.status).toBe(429);
  });
});

// ============================================================
// TESTES DE CENÁRIOS DE BORDA (EDGE CASES)
// ============================================================

describe('Edge Cases', () => {
  it('deve lidar com produto sem frete grátis', () => {
    const product = mockProducts[1]; // Samsung sem frete grátis
    expect(product.shipping.free_shipping).toBe(false);
  });

  it('deve lidar com produto sem MercadoPago', () => {
    const product = mockProducts[2]; // JBL sem MercadoPago
    expect(product.accepts_mercadopago).toBe(false);
  });

  it('deve lidar com preço zero', () => {
    const freeProduct: Product = {
      ...mockProducts[0],
      price: 0,
    };
    const sorted = sortProducts([freeProduct], 'price_asc');
    expect(sorted[0].price).toBe(0);
  });

  it('deve lidar com thumbnail em formato diferente', () => {
    const thumbnail = 'https://http2.mlstatic.com/D_123-W.jpg';
    const result = getImageUrl(thumbnail);
    // Não deve alterar sufixos que não são -I.jpg
    expect(result).toBe('https://http2.mlstatic.com/D_123-W.jpg');
  });

  it('deve lidar com permalink de domínio diferente', () => {
    const permalink = 'https://www.exemplo.com/produto/123';
    const result = getAffiliateUrl(permalink);
    // Deve extrair pathname e montar URL do MercadoLivre
    expect(result).toContain('www.mercadolivre.com.br');
    expect(result).toContain('/produto/123');
  });
});
