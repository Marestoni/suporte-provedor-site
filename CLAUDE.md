# CLAUDE.md — Suporte Provedor Site

Site (Next.js + React) do chat de suporte de um provedor de internet pequeno. O cliente recebe o link
por resposta automática no WhatsApp (app WhatsApp Business, sem API da Meta), abre este site e conversa
com um agente de IA. Todo o atendimento acontece aqui; o WhatsApp é só a porta de entrada.

Projeto irmão: `G:\ProjetosTeste\SuporteProvedorApi` (.NET + PostgreSQL). Este repo é só o front.
O site **não** chama a Anthropic nem o banco: tudo passa pela API.

> Estado atual: **MVP local funcionando** (`/`, `/chat` com identificação + conversa, `/bloqueado`), testado no
> navegador contra a API em modo simulado. Nada de produção, nada de commit/push sem o OK explícito do usuário.

## Stack
- Next.js 16 (App Router, `cacheComponents` e `partialPrefetching` ligados pelo scaffold) + React 19 + TypeScript (strict)
- Estilo: Tailwind CSS 4 (tokens em `globals.css`, tema claro/escuro automático)
- Node 24 local. Gerenciador: npm
- API: `NEXT_PUBLIC_API_URL` (dev: `http://localhost:5180`; ver `.env.example`, `.env.local` não vai para o git)
- `AGENTS.md` (do scaffold) avisa que esta versão do Next tem mudanças de API: consultar `node_modules/next/dist/docs/`
  antes de usar recursos novos/pouco comuns.

## Rodando localmente
```bash
npm run dev    # http://localhost:3000 (a API precisa estar de pé em :5180; CORS só libera :3000)
```
Clientes de teste (CPF / nascimento) estão no CLAUDE.md da API (ex.: Carla `39053344705` / `1992-11-02`).

## Telas (MVP)
| Rota | Função |
|---|---|
| `/` | Boas-vindas curtas + botão "Iniciar atendimento" (é o destino do link enviado no WhatsApp) |
| `/chat` | Etapa 1: identificação (CPF + data de nascimento). Etapa 2: chat com o agente |
| `/bloqueado` | Página de aviso para cliente suspenso por inadimplência (destino do redirecionamento do walled garden) com botão para o chat |

Fluxo do chat:
1. Ao entrar em `/chat`, cria a conversa (`POST /api/conversas`).
2. Formulário de identificação → `POST /api/conversas/{id}/identificar`; guarda o token de sessão
   **só em memória (estado React)**, nunca em `localStorage`/URL. Recarregar a página reinicia o atendimento (aceito no MVP).
   A conversa é criada ao enviar o formulário (não ao abrir a página).
3. Mensagens → `POST /api/conversas/{id}/mensagens`; exibe resposta do agente (streaming SSE numa fase seguinte).
4. Estados visíveis: digitando, erro de rede com "tentar novamente", conversa transferida para humano, chamado aberto (mostrar protocolo).

## Diretrizes de UX
- **Mobile-first**: a maioria chega pelo celular via WhatsApp (muitas vezes no 4G, sem a internet de casa).
- Página leve e rápida: pouco JS, sem dependências pesadas, funcionar em celular simples.
- Linguagem simples e direta, em português do Brasil. Sem jargão técnico com o cliente.
- Cliente inadimplente precisa conseguir pagar com poucos toques: PIX copia e cola com botão "Copiar".
- Acessível: foco visível, contraste, labels nos campos, `aria-live` na área de mensagens.
- Máscara de CPF e de data no formulário; nunca exibir o CPF completo depois de identificado (`***.456.789-**`).

## Regras inegociáveis
- Nunca colocar CPF, data de nascimento ou token na URL/query string.
- Nenhuma chave de API ou segredo no front (só variáveis `NEXT_PUBLIC_*` não sensíveis).
- Não logar dados pessoais no console nem em analytics.
- Renderizar texto do agente como **texto** (sem `dangerouslySetInnerHTML`); links só de allowlist.
- Validação no front é conveniência; a API é quem decide. Tratar 401/429 da API com mensagem clara.
- Para o walled garden funcionar, o site precisa ser **autossuficiente**: sem CDNs, fontes ou scripts de
  domínios de terceiros (o cliente bloqueado só alcança o domínio do chat). Fontes e assets locais (`next/font/local`).

## Convenções
- TypeScript estrito, sem `any`. Componentes funcionais; Server Components por padrão, `"use client"` só onde precisa (chat, formulário).
- Estrutura: `src/app/` (rotas), `src/components/`, `src/lib/api.ts` (cliente da API tipado), `src/types/`.
- Nomes de componentes/arquivos em inglês; textos de interface em português do Brasil.
- Sem bibliotecas de UI/estado pesadas no MVP; `useState`/`useReducer` bastam.

## Comandos (após criar o projeto)
```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Checklist ANTES DE QUALQUER DEPLOY (obrigatório)
Nenhum deploy sem passar por todos os itens, nesta ordem (registrar o resultado no PR/commit). O checklist completo e o
histórico das revisões estão no CLAUDE.md da API (`SuporteProvedorApi`); este é o resumo para o site.

1. **`/security-review`** — XSS (nada de `dangerouslySetInnerHTML`), token só em memória, nada sensível em URL/log/storage,
   nenhuma chave no bundle (`NEXT_PUBLIC_*` só com valores públicos), site autossuficiente (sem CDN/fonte/script de terceiros).
2. **`/code-review high`** em loop até restarem só achados de baixa severidade (estados de erro do chat: 401/409/429/503/rede).
3. **`/simplify`** nas mudanças, depois de corrigir 1 e 2.
4. **`/run`** — API + site no ar e o fluxo real no navegador (identificação, chat, cliente bloqueado, erro de rede, mobile).
5. **`npm run lint` e `npm run build`** sem erros; `NEXT_PUBLIC_API_URL` apontando para a API do ambiente de destino.
6. **Segredos:** `git diff --cached` sem chaves/senhas; `.env.local` nunca entra (só `.env.example`).
7. A API do destino já deve estar publicada com as migrations aplicadas e o CORS liberando a origem deste site.

## Roadmap
1. ~~Esqueleto Next + páginas `/`, `/chat`, `/bloqueado`.~~ feito
2. ~~Chat funcional contra a API (identificação + mensagens).~~ feito
3. ~~Botão "Copiar" para códigos PIX, protocolo do chamado, estado "encerrado/transferido".~~ feito
   (o "Copiar" detecta strings longas sem espaço no texto do agente — heurística; ideal é a API devolver o PIX estruturado)
4. Streaming (SSE) das respostas do agente.
5. Painel de atendente (se a API ganhar o fluxo de humano) — avaliar como app separado.

## Pendências
- Marca/identidade visual do provedor (logo, cores) e domínio do chat.
- Texto final da mensagem automática do WhatsApp com o link.
