import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ToolPageLayout from '@/components/ToolPageLayout';
import CryptoDetailClient from './CryptoDetailClient';

const CRYPTO_MAP: Record<string, { name: string; symbol: string; description: string }> = {
  bitcoin: { name: 'Bitcoin', symbol: 'BTC', description: 'Cotação do Bitcoin (BTC) em tempo real em Reais. Veja gráficos, capitalização de mercado, volume 24h e dados históricos.' },
  ethereum: { name: 'Ethereum', symbol: 'ETH', description: 'Cotação do Ethereum (ETH) em tempo real em Reais. Veja gráficos, capitalização de mercado, volume 24h e dados históricos.' },
  tether: { name: 'Tether', symbol: 'USDT', description: 'Cotação do Tether (USDT) em tempo real em Reais. Stablecoin indexada ao dólar americano.' },
  binancecoin: { name: 'BNB', symbol: 'BNB', description: 'Cotação do BNB em tempo real em Reais. Token nativo da Binance Smart Chain.' },
  solana: { name: 'Solana', symbol: 'SOL', description: 'Cotação do Solana (SOL) em tempo real em Reais. Blockchain de alta performance para DeFi e NFTs.' },
  ripple: { name: 'XRP', symbol: 'XRP', description: 'Cotação do XRP em tempo real em Reais. Criptomoeda para pagamentos internacionais rápidos.' },
  'usd-coin': { name: 'USD Coin', symbol: 'USDC', description: 'Cotação do USD Coin (USDC) em tempo real em Reais. Stablecoin regulamentada indexada ao dólar.' },
  dogecoin: { name: 'Dogecoin', symbol: 'DOGE', description: 'Cotação do Dogecoin (DOGE) em tempo real em Reais. A meme coin mais popular do mercado.' },
  cardano: { name: 'Cardano', symbol: 'ADA', description: 'Cotação do Cardano (ADA) em tempo real em Reais. Blockchain focada em sustentabilidade e pesquisa acadêmica.' },
  'staked-ether': { name: 'Lido Staked Ether', symbol: 'STETH', description: 'Cotação do Lido Staked Ether (STETH) em tempo real em Reais. Token derivado do ETH stakado.' },
};

const TOP_10 = Object.keys(CRYPTO_MAP);

export function generateStaticParams() {
  return TOP_10.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const crypto = CRYPTO_MAP[id];
  if (!crypto) return {};

  const title = `${crypto.name} (${crypto.symbol}) Hoje: Cotação em Tempo Real e Conversor | BuscaCentral`;
  const description = `Acompanhe a cotação do ${crypto.name} (${crypto.symbol}) em tempo real, veja o gráfico de 7 dias, dados de mercado e use o conversor de ${crypto.symbol} para BRL gratuito.`;
  const url = `https://buscacentral.com.br/financeiro/criptomoedas/${id}`;

  return {
    title,
    description,
    keywords: [
      `${crypto.name}`, `${crypto.symbol}`, `cotação ${crypto.name}`, `preço ${crypto.symbol}`,
      `${crypto.name} hoje`, `converter ${crypto.symbol} para real`, `criptomoedas`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'BuscaCentral',
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CryptoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const crypto = CRYPTO_MAP[id];
  if (!crypto) notFound();

  return (
    <ToolPageLayout
      title={`${crypto.name} (${crypto.symbol})`}
      description={crypto.description}
      ariaLabel={`Cotação de ${crypto.name} em tempo real`}
    >
      <CryptoDetailClient id={id} name={crypto.name} symbol={crypto.symbol} />
    </ToolPageLayout>
  );
}
