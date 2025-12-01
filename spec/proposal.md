# Proposta Técnica: Chatbot OpenRouter (Grok)

## Visão Geral

Construção de uma interface de chat moderna utilizando **Next.js** e **Tailwind CSS**, conectada ao modelo **Grok** via OpenRouter. A aplicação seguirá a arquitetura de referência (App Router, Server Components, API Routes) para garantir segurança da API Key e alta performance.

## Arquitetura e Tecnologias

- **Framework:** Next.js 14+ (App Router).
- **Linguagem:** TypeScript.
- **Estilização:** Tailwind CSS + shadcn/ui (componentes reutilizáveis).
- **Ícones:** Lucide React.
- **Gerenciamento de Estado:**
  - `useState` / `useRef` para estado local do chat (mensagens, input).
  - (Opcional) `zustand` se a complexidade aumentar.
- **Comunicação API:**
  - **Frontend:** `fetch` para rota interna `/api/chat`.
  - **Backend (Next.js API Route):** Proxy para OpenRouter (protege a API Key).

## Modelo de IA

- **Provider:** OpenRouter
- **Modelo:** `x-ai/grok-4.1-fast:free`

## Estrutura de Arquivos (Padrão Global Spec)

```
src/
  app/
    layout.tsx              # Layout raiz (fontes, estilos globais)
    page.tsx                # Página principal do Chat
    api/
      chat/
        route.ts            # API Route (Proxy para OpenRouter)
  components/
    ui/                     # Componentes shadcn (Button, Input, Card, etc.)
    chat/
      chat-input.tsx        # Área de entrada
      chat-message.tsx      # Bolha de mensagem
      chat-container.tsx    # Lista de mensagens
  lib/
    utils.ts                # Utilitários (cn, fetchers)
  styles/
    globals.css             # Diretivas Tailwind
```

## Fluxo de Dados Seguro

1. **Usuário** envia mensagem no Frontend.
2. **Frontend** faz POST para `/api/chat` (sem expor a chave).
3. **API Route** (Server-side) adiciona a chave `sk-or-v1...` e encaminha para o OpenRouter.
4. **OpenRouter** responde (Stream ou JSON).
5. **API Route** repassa a resposta para o Frontend.

## Configuração

A chave de API será armazenada em `.env.local` como `OPENROUTER_API_KEY` (acessível apenas no servidor).
