import { NextRequest, NextResponse } from 'next/server';

const ML_TOKEN_URL = 'https://api.mercadolibre.com/oauth/token';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    console.error('[API /api/auth/callback] OAuth error from Mercado Livre:', error, errorDescription);
    return new NextResponse(
      `<html>
        <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
          <h1 style="color: #dc2626;">Erro na Autorização</h1>
          <p>${errorDescription || error}</p>
          <a href="/" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; text-decoration: none; border-radius: 0.375rem;">Voltar para Busca</a>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  if (!code) {
    return new NextResponse(
      `<html>
        <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
          <h1 style="color: #dc2626;">Código de Autorização Ausente</h1>
          <p>Nenhum código foi retornado pelo Mercado Livre.</p>
          <a href="/" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; text-decoration: none; border-radius: 0.375rem;">Voltar para Busca</a>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  try {
    const clientId = process.env.ML_CLIENT_ID;
    const clientSecret = process.env.ML_CLIENT_SECRET;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!clientId || !clientSecret) {
      throw new Error('ML_CLIENT_ID e ML_CLIENT_SECRET não estão configurados no servidor.');
    }
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não estão configurados no servidor.');
    }

    // 1. Trocar o código pelo Token
    console.log('[API /api/auth/callback] Trocando o código pelo access_token...');
    const tokenResponse = await fetch(ML_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: 'https://buscacentral.com.br/api/auth/callback',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Falha ao obter token do Mercado Livre: ${tokenResponse.status} ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in || 21600; // padrão 6h
    const expiresAt = Date.now() + expiresIn * 1000;

    // 2. Salvar no Supabase via REST API
    console.log('[API /api/auth/callback] Salvando tokens no Supabase...');
    const supabaseEndpoint = `${supabaseUrl}/rest/v1/ml_tokens?id=eq.default`;
    const dbResponse = await fetch(supabaseEndpoint, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!dbResponse.ok) {
      const dbError = await dbResponse.text();
      throw new Error(`Falha ao salvar tokens no Supabase: ${dbResponse.status} ${dbError}`);
    }

    console.log('[API /api/auth/callback] Tokens salvos com sucesso!');

    return new NextResponse(
      `<html>
        <body style="font-family: sans-serif; padding: 3rem 1rem; text-align: center; background-color: #f3f4f6;">
          <div style="max-width: 400px; margin: 0 auto; background: white; padding: 2rem; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
            <svg style="width: 4rem; height: 4rem; color: #10b981; margin: 0 auto 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 style="color: #111827; font-size: 1.5rem; margin-bottom: 0.5rem;">Acesso Autorizado!</h1>
            <p style="color: #4b5563; font-size: 0.875rem; margin-bottom: 1.5rem;">O token de busca do Mercado Livre foi configurado e salvo com sucesso no Supabase.</p>
            <a href="/" style="display: block; width: 100%; box-sizing: border-box; text-align: center; padding: 0.75rem; background: #2563eb; color: white; font-weight: bold; text-decoration: none; border-radius: 0.5rem; transition: background 0.2s;">Ir para Busca</a>
          </div>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (err: any) {
    console.error('[API /api/auth/callback] Erro interno:', err);
    return new NextResponse(
      `<html>
        <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
          <h1 style="color: #dc2626;">Erro no Servidor</h1>
          <p>Ocorreu um erro ao processar a autorização: ${err.message}</p>
          <a href="/" style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; text-decoration: none; border-radius: 0.375rem;">Voltar para Busca</a>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}
