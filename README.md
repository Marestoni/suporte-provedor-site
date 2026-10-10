# Suporte Provedor — Site

[![CI](https://github.com/Marestoni/suporte-provedor-site/actions/workflows/ci.yml/badge.svg)](https://github.com/Marestoni/suporte-provedor-site/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Front-end (Next.js + React + TypeScript) do **chat de suporte com IA para provedores de internet pequenos**. O cliente
recebe o link por resposta automática no WhatsApp, abre este site, se identifica e conversa com um agente que consulta
fatura, conexão e abre chamado de visita técnica.

> Projeto de portfólio, com dados fictícios. API: [suporte-provedor-api](https://github.com/Marestoni/suporte-provedor-api)
> (.NET 10 + PostgreSQL), onde ficam o agente, as ferramentas e as regras de negócio.

## Telas

| Rota | Função |
|---|---|
| `/` | boas-vindas e botão "Iniciar atendimento" (destino do link do WhatsApp) |
| `/chat` | identificação (CPF + data de nascimento) e conversa com o agente |
| `/bloqueado` | aviso para cliente suspenso por inadimplência, com acesso ao chat |

## Decisões

- **Mobile-first e leve:** o público chega pelo celular, muitas vezes no 4G. Sem bibliotecas de UI/estado; `useState` basta.
- **Autossuficiente (walled garden):** sem CDN, fontes ou scripts de terceiros. O cliente bloqueado por inadimplência só
  alcança o domínio do chat, então o site precisa funcionar sozinho.
- **Sem segredos no navegador:** o site não chama o modelo de IA nem o banco; tudo passa pela API.
- **Token só em memória:** o token de sessão vive no estado do React, nunca em `localStorage` ou na URL.
- **Texto do agente sempre como texto** (sem `dangerouslySetInnerHTML`); códigos PIX longos ganham botão "Copiar".
- **Acessível:** foco visível, labels, `aria-live` na conversa, tema claro/escuro automático.

## Como rodar

Requisitos: Node 20+ e a API rodando (padrão `http://localhost:5180`).

```bash
cp .env.example .env.local     # NEXT_PUBLIC_API_URL
npm install
npm run dev                    # http://localhost:3000/chat
```

Clientes de teste (CPF / nascimento) estão no README da API.

```bash
npm run lint
npm run build
```

## Licença

[MIT](LICENSE) © 2026 André Marestoni
