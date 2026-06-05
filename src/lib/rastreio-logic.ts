/**
 * Rastreio Logic Module
 *
 * Módulo de lógica para consumo da API pública de rastreamento de encomendas.
 * Utiliza a BrasilAPI que unifica dados logísticos dos Correios.
 */

export interface EventoRastreio {
  readonly data: string;
  readonly hora: string;
  readonly local: string;
  readonly status: string;
  readonly detalhe?: string;
}

export interface ResultadoRastreio {
  readonly codigo: string;
  readonly sucesso: boolean;
  readonly mensagem?: string;
  readonly eventos: readonly EventoRastreio[];
}

/**
 * Busca o histórico de rastreio de um objeto via API pública.
 *
 * @param codigo - Código de rastreio (ex: BR123456789BR)
 * @returns Resultado com eventos ou mensagem de erro
 */
export async function buscarRastreio(codigo: string): Promise<ResultadoRastreio> {
  const codigoSanitizado = codigo.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  if (!codigoSanitizado) {
    return { codigo: '', sucesso: false, mensagem: 'Por favor, digite um código de rastreio.', eventos: [] };
  }

  if (codigoSanitizado.length < 13) {
    return { codigo: codigoSanitizado, sucesso: false, mensagem: 'O código de rastreio deve ter pelo menos 13 caracteres.', eventos: [] };
  }

  try {
    const response = await fetch(`https://brasilapi.com.br/api/rastro/v1/${encodeURIComponent(codigoSanitizado)}`);

    if (!response.ok) {
      return { codigo: codigoSanitizado, sucesso: false, mensagem: 'Código não encontrado ou ainda não postado.', eventos: [] };
    }

    let data: Record<string, unknown>;
    try {
      data = await response.json();
    } catch {
      return { codigo: codigoSanitizado, sucesso: false, mensagem: 'Resposta inválida do serviço de rastreio.', eventos: [] };
    }

    const eventos: EventoRastreio[] = Array.isArray(data.eventos)
      ? (data.eventos as Record<string, unknown>[]).map((e) => ({
          data: e.dtDtEvent ? String(e.dtDtEvent) : new Date(String(e.data)).toLocaleDateString('pt-BR'),
          hora: e.tmTmEvent ? String(e.tmTmEvent) : new Date(String(e.data)).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          local: (e.unidade as Record<string, string>)?.nome || 'Unidade de Tratamento',
          status: String(e.descricao || 'Status não informado'),
          detalhe: e.detalhe ? String(e.detalhe) : '',
        }))
      : [];

    if (eventos.length === 0) {
      return { codigo: codigoSanitizado, sucesso: true, mensagem: 'Nenhum evento registrado ainda. O objeto pode ter acabado de ser postado.', eventos: [] };
    }

    return { codigo: codigoSanitizado, sucesso: true, eventos };
  } catch {
    return { codigo: codigoSanitizado, sucesso: false, mensagem: 'Erro ao conectar ao serviço de rastreio. Tente novamente mais tarde.', eventos: [] };
  }
}
