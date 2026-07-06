# SKAD — Catálogo online

Catálogo responsivo da SKAD, construído com Next.js, React, TypeScript e Tailwind CSS.

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

Acesse `http://localhost:3000`.

## Atualizações rápidas

- WhatsApp e redes sociais: `src/config/site.ts`
- Produtos, nomes e categorias: `src/data/products.ts`
- Fotos: `public/products/[nome-do-produto]`

O número do WhatsApp deve conter código do país e DDD, somente com números. Exemplo: `5511999999999`.

## Verificação

```bash
pnpm lint
pnpm build
```
