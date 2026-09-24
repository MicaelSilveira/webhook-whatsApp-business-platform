# WhatsApp Business Webhook API

API Node.js para receber webhooks do WhatsApp Business, gerar resposta com Gemini e enviar mensagens de volta pelo Graph API.

## Requisitos

- Node.js 20+

## Setup

1. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

2. Preencha as variáveis no `.env`.

3. Instale dependências:

```bash
npm install
```

4. Execute localmente:

```bash
npm run dev
```

## Scripts

- `npm start`: inicia a API
- `npm run dev`: inicia em modo watch

## Endpoints

- `GET /health` - healthcheck
- `GET /` - validação do webhook do Meta
- `POST /` - recebimento do webhook do WhatsApp
- `POST /api/messages` - envio manual de mensagens (JWT obrigatório)

## Observações

- A rota `POST /` valida assinatura `x-hub-signature-256` com `META_APP_SECRET`.
- A rota `POST /api/messages` exige JWT Bearer token.
- Erros de integração (Gemini/WhatsApp) retornam status apropriado (502/504).
