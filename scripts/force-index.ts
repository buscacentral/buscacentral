/**
 * scripts/force-index.ts
 *
 * Submete URLs do BuscaCentral à Google Indexing API para indexação imediata.
 * Usa credenciais de Service Account (service-account.json) para autenticação.
 *
 * Uso:
 *   npx tsx scripts/force-index.ts
 *
 * Pré-requisitos:
 *   1. Ficheiro service-account.json na raiz do projecto (ver README abaixo)
 *   2. npm install googleapis (ou já estar no package.json)
 *   3. Email da Service Account adicionado como Proprietário no Search Console
 */

import { google } from 'googleapis';
import path from 'node:path';
import fs from 'node:fs';

// ---------------------------------------------------------------------------
// CONFIGURAÇÃO
// ---------------------------------------------------------------------------

/** Caminho para o ficheiro de credenciais da Service Account. */
const SERVICE_ACCOUNT_PATH = path.resolve(
  process.cwd(),
  'service-account.json',
);

/** Domínio base do site. */
const BASE_URL = 'https://buscacentral.com.br';

/** Delay entre requisições (ms) para respeitar rate limits (~200 req/dia). */
const DELAY_MS = 500;

/** Tipo de notificação: URL_UPDATED (nova/atualizada) ou URL_DELETED. */
type IndexingType = 'URL_UPDATED' | 'URL_DELETED';

// ---------------------------------------------------------------------------
// URLs A SUBMETER
// ---------------------------------------------------------------------------

/**
 * Lista de paths a submeter para indexação.
 * Edita esta lista com as páginas que queres forçar a indexação.
 *
 * Dica: para gerar os pares de distância automaticamente, podes importar
 * getCityPairs() de src/lib/distancia-cidades.ts e mapear para URLs.
 */
const URLS_TO_INDEX: string[] = [
  // Ferramentas principais
  '/utilidades/calculadora-combustivel',
  '/utilidades/calculadora-imc',
  '/utilidades/calculadora-porcentagem',
  '/utilidades/calculadora-desconto',
  '/utilidades/conversor-unidades',
  '/utilidades/gerador-qr-code',
  '/utilidades/gerador-senha',
  '/utilidades/cronometro',
  '/utilidades/dias-uteis',
  '/utilidades/rastreio',
  '/utilidades/tabela-calorias',
  '/utilidades/planejador-viagem',

  // Documentos
  '/documentos/gerador-cpf',
  '/documentos/validador-cpf',
  '/documentos/gerador-cnpj',
  '/documentos/validador-cnpj',
  '/documentos/consulta-cnpj',
  '/documentos/gerador-cartao-credito',
  '/documentos/gerador-recibos',
  '/documentos/consulta-processos',

  // Financeiro
  '/financeiro/tabela-fipe',
  '/financeiro/cotacao',
  '/financeiro/criptomoedas',
  '/financeiro/juros-compostos',
  '/financeiro/conversor-clt-pj',
  '/financeiro/financiamento-carro',
  '/financeiro/salario-liquido',
  '/financeiro/ferias',
  '/financeiro/decimo-terceiro',
  '/financeiro/horas-extras',
  '/financeiro/rescisao-trabalhista',
  '/financeiro/simulador-investimentos',
  '/financeiro/roi-imobiliario',

  // Localização
  '/localizacao/distancia-cidades',
  '/localizacao/busca-cep',
  '/localizacao/clima',

  // Exemplos de rotas de distância (adicione mais conforme necessário)
  '/localizacao/distancia/sao-paulo-sp/rio-de-janeiro-rj',
  '/localizacao/distancia/sao-paulo-sp/belo-horizonte-mg',
  '/localizacao/distancia/sao-paulo-sp/curitiba-pr',
  '/localizacao/distancia/sao-paulo-sp/brasilia-df',
  '/localizacao/distancia/rio-de-janeiro-rj/belo-horizonte-mg',
  '/localizacao/distancia/rio-de-janeiro-rj/salvador-ba',
  '/localizacao/distancia/curitiba-pr/florianopolis-sc',
  '/localizacao/distancia/brasilia-df/goiania-go',
  '/localizacao/distancia/sao-paulo-sp/campinas-sp',
  '/localizacao/distancia/sao-paulo-sp/santos-sp',
];

// ---------------------------------------------------------------------------
// AUTENTICAÇÃO
// ---------------------------------------------------------------------------

async function getAuthClient() {
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    throw new Error(
      `❌ Ficheiro de credenciais não encontrado: ${SERVICE_ACCOUNT_PATH}\n` +
        `   Siga as instruções no final deste ficheiro para gerar o service-account.json.`,
    );
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  return auth.getClient();
}

// ---------------------------------------------------------------------------
// SUBMISSÃO DE URL
// ---------------------------------------------------------------------------

async function submitUrl(
  authClient: Awaited<ReturnType<typeof getAuthClient>>,
  url: string,
  type: IndexingType = 'URL_UPDATED',
): Promise<{ url: string; status: number; success: boolean }> {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  try {
    const response = await google.indexing('v3').urlNotifications.publish({
      auth: authClient,
      requestBody: {
        url: fullUrl,
        type,
      },
    });

    return {
      url: fullUrl,
      status: response.status,
      success: response.status === 200,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido';
    console.error(`   ❌ Falha: ${fullUrl} — ${message}`);
    return { url: fullUrl, status: 0, success: false };
  }
}

// ---------------------------------------------------------------------------
// UTILITÁRIO: DELAY
// ---------------------------------------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// EXECUÇÃO PRINCIPAL
// ---------------------------------------------------------------------------

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🚀 BuscaCentral — Google Indexing API (Force Index)');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log(`  📋 URLs a submeter: ${URLS_TO_INDEX.length}`);
  console.log(`  ⏱️  Delay entre requests: ${DELAY_MS}ms`);
  console.log(`  🔑 Service Account: ${SERVICE_ACCOUNT_PATH}`);
  console.log('');

  const authClient = await getAuthClient();
  console.log('  ✅ Autenticação OK\n');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < URLS_TO_INDEX.length; i++) {
    const url = URLS_TO_INDEX[i];
    const progress = `[${i + 1}/${URLS_TO_INDEX.length}]`;

    const result = await submitUrl(authClient, url);

    if (result.success) {
      console.log(`  ✅ ${progress} ${result.url}`);
      successCount++;
    } else {
      console.log(`  ❌ ${progress} ${result.url} (status: ${result.status})`);
      failCount++;
    }

    // Delay para respeitar rate limits (exceto após a última URL)
    if (i < URLS_TO_INDEX.length - 1) {
      await delay(DELAY_MS);
    }
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  📊 Resultado: ${successCount} sucesso | ${failCount} falhas`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Erro fatal:', error.message || error);
  process.exit(1);
});

// ---------------------------------------------------------------------------
// INSTRUÇÕES DE SETUP (LEIA ANTES DE EXECUTAR)
// ---------------------------------------------------------------------------
/*

╔══════════════════════════════════════════════════════════════════════════════╗
║  PASSO A PASSO — CONFIGURAÇÃO DA GOOGLE INDEXING API                       ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  1. CRIAR PROJECTO NO GOOGLE CLOUD CONSOLE                                 ║
║     • Vai a: https://console.cloud.google.com                              ║
║     • Cria um novo projecto (ex: "BuscaCentral Indexing")                  ║
║     • Ou usa um projecto existente                                         ║
║                                                                            ║
║  2. ATIVAR A INDEXING API                                                  ║
║     • No menu lateral: APIs & Services → Library                           ║
║     • Pesquisa: "Web Search Indexing API"                                  ║
║     • Clica em "Enable"                                                    ║
║                                                                            ║
║  3. CRIAR SERVICE ACCOUNT                                                  ║
║     • APIs & Services → Credentials                                        ║
║     • "+ Create Credentials" → "Service Account"                           ║
║     • Nome: "buscacentral-indexing"                                        ║
║     • Role: nenhuma necessária (a permissão é dada no Search Console)      ║
║     • Clica em "Done"                                                      ║
║                                                                            ║
║  4. GERAR CHAVE JSON                                                       ║
║     • Na lista de Service Accounts, clica na que criaste                   ║
║     • Aba "Keys" → "Add Key" → "Create New Key"                           ║
║     • Tipo: JSON                                                           ║
║     • Download automático do ficheiro                                      ║
║     • Renomeia para: service-account.json                                  ║
║     • Coloca na RAIZ do projecto BuscaCentral                              ║
║     • ⚠️  NUNCA faça commit deste ficheiro (já está no .gitignore)         ║
║                                                                            ║
║  5. ADICIONAR COMO PROPRIETÁRIO NO SEARCH CONSOLE                          ║
║     • Vai a: https://search.google.com/search-console                      ║
║     • Seleciona a propriedade: buscacentral.com.br                         ║
║     • Configurações → Utilizadores e permissões                            ║
║     • "Adicionar utilizador"                                               ║
║     • Email: o email da Service Account (encontras no JSON, campo          ║
║       "client_email", algo como:                                           ║
║       buscacentral-indexing@projeto.iam.gserviceaccount.com)               ║
║     • Permissão: PROPRIETÁRIO (Owner)                                      ║
║     • Confirma                                                             ║
║                                                                            ║
║  6. EXECUTAR O SCRIPT                                                      ║
║     • npm install googleapis tsx (se não tiver)                             ║
║     • npx tsx scripts/force-index.ts                                       ║
║                                                                            ║
║  LIMITES DA API:                                                           ║
║     • ~200 URLs/dia por propriedade (pode pedir aumento)                   ║
║     • Funciona APENAS para páginas que tu és proprietário verificado       ║
║     • O Google processa o pedido em segundos/minutos (não dias)            ║
║                                                                            ║
╚══════════════════════════════════════════════════════════════════════════════╝

*/
