# PRD — BuscaCentral.com.br
**Versão:** 2.0  
**Data:** Junho 2026  
**Status:** Rascunho

---

## 1. Objetivo e Visão do Produto

### Visão
Ser a principal "central de ferramentas online gratuitas" do Brasil — um site onde qualquer pessoa encontra, num só lugar, consultas de documentos, localização, informações financeiras e utilitários do dia a dia, de forma rápida, limpa e sem cadastro.

### Problema que resolve
Hoje o usuário brasileiro precisa acessar 4 ou 5 sites diferentes para consultar CEP, validar um CNPJ, checar a cotação do dólar e pesquisar o preço de um carro na tabela FIPE. O BuscaCentral unifica essas ferramentas numa interface única e bem indexada no Google.

### Modelo de negócio
Tráfego orgânico (SEO) → visitas → exibição de anúncios via **Google AdSense**.  
Sem cobrança de usuário. Sem cadastro. Sem paywall.

### Público-alvo
- Desenvolvedores e estudantes de programação (ferramentas de documentos e utilidades)
- Motoristas e compradores de carro (FIPE)
- Qualquer pessoa que precise de CEP ou endereço (logística)
- Pessoas físicas e PJs que consultam cotações (financeiro)

---

## 2. Lista de Funcionalidades por Página

### Página Inicial (`/`)
- Header com logo e menu de navegação para as centrais
- Cards de acesso rápido para cada ferramenta
- **Busca interna global** com sugestão de ferramenta em tempo real (requisito oficial — ver seção 2.1)
- Footer com aviso legal, links e informações do site

### 2.1 Busca Interna Global (requisito oficial)

A barra de busca deve funcionar como um índice de todas as ferramentas do site.

**Comportamento:**
- Usuário digita qualquer termo (ex: "cpf", "cep", "qr", "dólar")
- O sistema filtra e exibe as ferramentas correspondentes em tempo real
- Cada resultado mostra: ícone, nome da ferramenta e URL de destino
- Funciona 100% em JavaScript local — sem API externa

**Exemplos de busca:**
| Usuário digita | Resultados exibidos |
|---|---|
| "cpf" | Gerador de CPF, Validador de CPF |
| "cep" | Busca de CEP, Busca reversa |
| "qr" | Gerador de QR Code |
| "dólar" | Cotação de Moedas, Conversor |
| "cnpj" | Gerador de CNPJ, Validador de CNPJ |

**Impacto:** Aumenta páginas por sessão, reduz bounce rate e melhora retenção.

---

### Central de Documentos (`/documentos`)

#### Gerador de CPF (`/documentos/gerador-cpf`)
- Botão "Gerar CPF" que retorna número válido formatado (000.000.000-00)
- Opção de gerar com ou sem formatação
- Botão de copiar com um clique
- Aviso legal obrigatório: *"Dados fictícios para uso exclusivo em testes e desenvolvimento"*

#### Validador de CPF (`/documentos/validador-cpf`)
- Campo de entrada do CPF
- Resultado: Válido ✅ ou Inválido ❌
- Explicação do algoritmo (ajuda no SEO e mantém usuário na página)

#### Gerador de CNPJ (`/documentos/gerador-cnpj`)
- Igual ao gerador de CPF, adaptado para CNPJ
- Formato: 00.000.000/0001-00

#### Validador de CNPJ (`/documentos/validador-cnpj`)
- Campo de entrada + validação em tempo real

> **Nota técnica:** Todas as ferramentas desta seção são 100% JavaScript no navegador. Sem API externa, sem custo.

---

### Central de Localização (`/localizacao`)

#### Busca de CEP (`/localizacao/busca-cep`)
- Campo: usuário digita o CEP → retorna logradouro, bairro, cidade, estado
- Campo reverso: usuário digita rua + cidade → retorna CEP(s) correspondentes
- Botão de copiar endereço formatado
- **API:** ViaCEP (gratuita, sem autenticação)

#### Calculadora de Distância entre Cidades (`/localizacao/distancia-cidades`)
- Dois campos: cidade de origem e destino
- Retorna: distância em km (linha reta e estimativa rodoviária)
- Mapa simples embutido (OpenStreetMap / Leaflet.js — gratuito)
- **API:** OpenRouteService ou OSRM (gratuitas)

---

### Central Financeira (`/financeiro`)

#### Cotação de Moedas (`/financeiro/cotacao`)
- Painel com valores em tempo real: USD, EUR, BTC, GBP, ARS
- Conversor: usuário digita valor em reais → vê equivalente nas moedas
- Atualização automática a cada 60 segundos
- **API:** AwesomeAPI (gratuita)

#### Tabela FIPE (`/financeiro/tabela-fipe`)
- Seleção em cascata: Tipo de veículo → Marca → Modelo → Ano
- Exibe: preço médio de mercado, mês de referência
- **API:** API Tabela FIPE (parallelum.com.br — gratuita)

---

### Central de Utilidades (`/utilidades`)

Alto potencial de pageview. Ferramentas 100% JavaScript — sem API, sem custo, fáceis de construir.

#### Gerador de QR Code (`/utilidades/gerador-qr-code`)
- Usuário digita texto ou URL → gera QR Code na tela
- Botão de download da imagem (PNG)

#### Gerador de Senha (`/utilidades/gerador-senha`)
- Configurações: tamanho, letras maiúsculas, números, símbolos
- Botão de copiar com um clique

#### Gerador de UUID (`/utilidades/gerador-uuid`)
- Gera UUID v4 aleatório
- Opção de gerar múltiplos de uma vez (até 10)
- Botão de copiar

#### Codificador Base64 (`/utilidades/base64`)
- Campo de texto → codifica em Base64
- Campo Base64 → decodifica para texto
- Funciona nos dois sentidos

#### Contador de Caracteres (`/utilidades/contador-caracteres`)
- Campo de texto livre
- Exibe em tempo real: caracteres (com e sem espaços), palavras, linhas, parágrafos
- Útil para redatores, posts em redes sociais

#### Gerador de PIX Copia e Cola (`/utilidades/pix-copia-cola`)
- Usuário preenche: chave PIX, valor, nome do recebedor, cidade
- Gera o código PIX no padrão EMV para copia e cola
- Exibe também como QR Code
- 100% JavaScript — sem API de banco

#### Conversor de Timestamp (`/utilidades/timestamp`)
- Converte timestamp Unix para data/hora legível
- Converte data/hora para timestamp Unix
- Exibe horário atual em timestamp

---

## 3. Estratégia de SEO

### Princípio central
Cada ferramenta deve ter sua **própria URL**, seu próprio título, descrição e conteúdo textual. Nunca colocar tudo numa página só.

### 3.1 SEO Tradicional — Palavras-chave por página

| Página | Palavra-chave principal | Volume estimado |
|---|---|---|
| Gerador CPF | "gerador de cpf" | Alto |
| Validador CPF | "validar cpf online" | Alto |
| Gerador CNPJ | "gerador de cnpj" | Alto |
| Busca CEP | "busca cep" / "consulta cep" | Muito alto |
| Cotação dólar | "cotação dólar hoje" | Muito alto |
| Tabela FIPE | "tabela fipe" | Muito alto |
| Distância cidades | "distância entre cidades" | Médio |
| Gerador QR Code | "gerador de qr code" | Alto |
| Gerador senha | "gerador de senha" | Alto |
| PIX copia e cola | "gerar pix copia e cola" | Alto |

### 3.2 SEO Programático (alto potencial de multiplicação de tráfego)

Em vez de só oferecer a ferramenta interativa, criar páginas estáticas pré-geradas para buscas específicas que o usuário já faz no Google.

**Exemplos FIPE:**
- `/fipe/honda/civic/2020` — "tabela fipe honda civic 2020"
- `/fipe/volkswagen/gol/2019` — "tabela fipe gol 2019"
- `/fipe/toyota/corolla/2021` — "tabela fipe corolla 2021"

Potencial: centenas ou milhares de páginas indexadas, cada uma capturando uma busca específica.

**Exemplos Cotação:**
- `/cotacao/dolar-hoje` — "cotação do dólar hoje"
- `/cotacao/euro-hoje` — "cotação do euro hoje"
- `/cotacao/bitcoin-hoje` — "cotação do bitcoin hoje"

**Exemplos CEP por cidade:**
- `/cep/sao-paulo` — "CEP São Paulo"
- `/cep/curitiba` — "CEP Curitiba"

> **Nota de implementação:** SEO programático é uma Fase 5+ — requer geração de páginas estáticas ou SSG. Não é para o MVP, mas deve estar no roadmap desde o início para não precisar reestruturar o site depois.

### 3.3 Boas práticas obrigatórias
- `<title>` único e descritivo em cada página
- Meta description entre 150–160 caracteres
- Heading H1 com a palavra-chave principal
- Parágrafo explicativo abaixo de cada ferramenta (50–100 palavras)
- Site com carregamento rápido (essencial para Google — Vercel/Netlify ajuda)
- Sitemap XML gerado e enviado ao Google Search Console
- Certificado SSL (HTTPS) — gratuito no Vercel/Netlify

### 3.4 Ações pós-lançamento
- Cadastrar o site no **Google Search Console** no primeiro dia
- Solicitar indexação manual das páginas principais
- Monitorar posições semanalmente

---

## 4. Plano de Monetização (AdSense)

### Pré-requisitos para aprovação do AdSense
- [ ] Site com pelo menos 10–15 páginas de conteúdo real
- [ ] Política de Privacidade publicada (`/privacidade`)
- [ ] Termos de Uso publicados (`/termos`)
- [ ] Sobre nós / Contato (`/sobre`)
- [ ] Domínio próprio registrado (não subdomínio gratuito)
- [ ] Algum tráfego orgânico já existente (recomendado antes de solicitar)

### Posicionamento dos anúncios
- 1 banner no topo da página (após o header)
- 1 anúncio responsivo no meio da página (entre a ferramenta e o conteúdo explicativo)
- 1 banner no footer
- Evitar excesso de anúncios — o Google penaliza e o usuário foge

### Estimativa de receita (conservadora)

| Visitas/mês | CPM estimado | Receita estimada |
|---|---|---|
| 10.000 | R$ 4,00 | R$ 40/mês |
| 50.000 | R$ 5,00 | R$ 250/mês |
| 200.000 | R$ 6,00 | R$ 1.200/mês |
| 500.000 | R$ 7,00 | R$ 3.500/mês |

> CPM mais alto para páginas financeiras (FIPE, cotações). Mais baixo para CEP e utilidades.

### Estratégia de crescimento de receita
1. Aprovação do AdSense → anúncios display padrão
2. Com tráfego > 100k/mês → testar **Google AdSense Auto Ads**
3. No futuro → avaliar **afiliados** (cartões de crédito, seguros auto na página FIPE)

---

## 5. Cronograma de Fases

### Fase 0 — Preparação (Semana 1)
- [ ] Registrar domínio `buscacentral.com.br` no Registro.br
- [ ] Criar conta no Vercel ou Netlify
- [ ] Criar repositório no GitHub
- [ ] Definir estrutura de pastas do projeto

### Fase 1 — MVP: Central de Documentos (Semanas 2–4)
- [ ] Página inicial com menu e busca interna global
- [ ] Gerador de CPF
- [ ] Validador de CPF
- [ ] Gerador de CNPJ
- [ ] Validador de CNPJ
- [ ] Página de Política de Privacidade
- [ ] Página de Termos de Uso
- [ ] Deploy no Vercel + domínio conectado
- [ ] Configurar Google Analytics 4
- [ ] Cadastro no Google Search Console

### Fase 2 — Central de Localização (Semanas 5–7)
- [ ] Busca de CEP (ViaCEP)
- [ ] Busca reversa (rua → CEP)
- [ ] Calculadora de distância entre cidades

### Fase 3 — Monetização (Semana 8)
- [ ] Solicitar aprovação do Google AdSense
- [ ] Aguardar aprovação (3–14 dias)
- [ ] Inserir blocos de anúncio nas páginas
- [ ] Configurar Microsoft Clarity (mapas de calor e gravação de sessões)

### Fase 4 — Central de Utilidades (Semanas 9–11)
- [ ] Gerador de QR Code
- [ ] Gerador de Senha
- [ ] Gerador de UUID
- [ ] Codificador Base64
- [ ] Contador de Caracteres
- [ ] Gerador de PIX Copia e Cola
- [ ] Conversor de Timestamp

### Fase 5 — Central Financeira (Semanas 12–15)
- [ ] Cotação de moedas em tempo real (AwesomeAPI)
- [ ] Conversor de moedas
- [ ] Tabela FIPE (seleção em cascata)

### Fase 6 — SEO Programático (Mês 5+)
- [ ] Gerar páginas estáticas por modelo/ano para FIPE
- [ ] Gerar páginas de cotação por moeda
- [ ] Gerar páginas de CEP por cidade/estado
- [ ] Submeter novo sitemap ao Search Console

### Fase 7 — Otimização contínua (Mês 6+)
- [ ] Análise de Search Console: quais páginas têm mais impressões
- [ ] Análise de Clarity: onde os usuários travam ou abandonam
- [ ] Melhorar conteúdo textual das páginas com mais potencial
- [ ] Avaliar novas ferramentas baseadas em demanda real

---

## 6. Tecnologias e APIs

### Stack principal
| Componente | Tecnologia | Custo |
|---|---|---|
| Frontend | HTML5 + CSS3 + JavaScript puro | Gratuito |
| Hospedagem | Vercel ou Netlify | Gratuito |
| Versionamento | GitHub | Gratuito |
| Domínio | Registro.br `.com.br` | R$ 40/ano |

### Analytics e monitoramento
| Ferramenta | Finalidade | Custo |
|---|---|---|
| Google Analytics 4 | Tráfego, origem, comportamento do usuário | Gratuito |
| Google Search Console | Palavras-chave, indexação, erros de rastreamento | Gratuito |
| Microsoft Clarity | Mapas de calor, gravação de sessões, onde o usuário clica | Gratuito |

> **Nota:** Clarity é especialmente útil para identificar quais ferramentas têm mais uso, onde os usuários abandonam e o que pode ser melhorado na UX — sem precisar adivinhar.

### APIs utilizadas

| Ferramenta | API | Autenticação | Limite gratuito |
|---|---|---|---|
| Busca de CEP | ViaCEP | Não precisa | Sem limite declarado |
| Cotação de moedas | AwesomeAPI | Não precisa | Generoso |
| Tabela FIPE | parallelum.com.br | Não precisa | Sem limite declarado |
| Mapa / Distância | OpenStreetMap + Leaflet.js | Não precisa | Gratuito |

### Sem API (lógica local em JavaScript)
- Gerador / Validador de CPF
- Gerador / Validador de CNPJ
- Gerador de QR Code (biblioteca qrcode.js)
- Gerador de Senha
- Gerador de UUID
- Codificador/Decodificador Base64
- Contador de Caracteres
- Gerador de PIX Copia e Cola (padrão EMV)
- Conversor de Timestamp
- Busca interna global

---

## 7. Requisitos Legais e de Conformidade

### Aviso em ferramentas de documentos
Texto obrigatório em todas as páginas de geração de CPF/CNPJ:
> *"Os dados gerados são fictícios, criados exclusivamente para fins de teste e desenvolvimento. É proibido utilizar estes dados para cadastros reais, fraudes ou qualquer atividade ilícita."*

### LGPD — Posicionamento correto
O BuscaCentral **não exige cadastro nem coleta diretamente dados pessoais dos usuários**. Entretanto, serviços de terceiros integrados ao site (Google AdSense, Google Analytics 4, Microsoft Clarity) podem utilizar cookies e identificadores de navegação conforme suas próprias políticas.

A Política de Privacidade deve informar claramente:
- Quais serviços terceiros estão presentes
- Que tipo de dado cada um coleta (cookies, IP, comportamento de navegação)
- Como o usuário pode optar por não ser rastreado

### Banner de cookies
Obrigatório pela LGPD ao usar AdSense + Analytics. Implementar banner simples de consentimento no primeiro acesso.

### Termos de Uso
Proibir explicitamente o uso de dados gerados para fins ilegais. Limitar responsabilidade do site sobre o uso indevido por terceiros.

---

*Documento vivo — versão 2.0. Atualizar conforme o projeto evolui.*
