# Fase 1 — Auditoria white-label

Data da auditoria: 2026-09-03.

## Resumo executivo

O projeto continua funcionalmente maduro, mas a camada de apresentação ainda é largamente FUERZA. A identidade aparece em páginas públicas, área administrativa, SEO/PWA, emails, notificações, nomes de armazenamento local, Stripe metadata, migrações, documentação e ficheiros visuais.

Nesta fase não foram renomeados contratos persistidos (cookies, `localStorage`, metadata Stripe, SQL, códigos de pedido ou nomes de migrações). Alterá-los sem compatibilidade poderia perder carrinhos, preferências, associações de subscrições ou histórico de base de dados.

Foram neutralizados apenas os riscos imediatos de comunicação: a moldura dos emails e o fallback de push passam a ler uma configuração mínima de marca; email e telefone públicos deixam de apontar para contactos FUERZA quando não estão configurados.

## 1. Deve virar configuração da marca

| Ocorrência | Local atual | Destino recomendado |
| --- | --- | --- |
| Nome `FUERZA`, wordmark e nome curto | `src/lib/site.ts`, headers, barras do catálogo/checkout, footer, admin shell/navigation, modo produção, prompts PWA e páginas de conta | `brand.name`, `brand.shortName` e componente único de marca |
| Logo principal e versões | `public/01-fuerza-logo.svg`, `public/nombre-fuerza.svg`, `public/logo_fuerza_principal.png`; referências nas barras do catálogo | `brand.logo`, `brand.wordmark`, `brand.logoAlt` |
| Favicon e ícones PWA | `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/manifest.ts` | manifesto e assets derivados/configurados por cliente |
| Imagem social/OG | `public/fuerza.jpeg`; `src/app/layout.tsx`, `src/lib/seo.ts`, `public/sw.js` | `brand.ogImage` e `brand.ogImageAlt` |
| Tagline/descrição de marca | `src/lib/site.ts`, footer, manifesto, JSON-LD, metadata | `brand.tagline` e `brand.description` |
| Nome do plano `Fuerza Habitual` | navegação, páginas e componentes de subscrição, conta, catálogo e admin | nome comercial configurável; “Plan de Pan” pode ser o fallback funcional |
| Cores | tokens no topo de `src/app/globals.css` e vários hex/rgb locais, sobretudo `#F5F1E8`, castanhos/dourados e estados visuais | paleta da marca em CSS variables; cores de estado permanecem no sistema |
| Fontes Fraunces/Inter | `src/app/layout.tsx`, dependências `@fontsource-variable/*`, variáveis em `globals.css` | seleção limitada de fontes por cliente, sem tornar cada regra tipográfica configurável |
| Estilo visual e grafismos | `patron*`, `pilares*`, `ilustraciones*`, `02-*` a `06-*`, imagens de bolsa e comentários CSS “FUERZA” | preset visual/asset pack da marca |

## 2. Deve virar configuração do negócio

| Ocorrência | Local atual | Destino recomendado |
| --- | --- | --- |
| Email `hola@fuerza.com` | footer, contacto e `src/lib/legal-pages.ts` | `business.email`; nunca usar um contacto real como fallback |
| Telefone `+34 697 697 697` | footer | `business.phone` e valor normalizado para `tel:` |
| Avilés/Asturias | Home, Nosotros, Obrador, Contacto, Dónde estamos, SEO, PWA, emails e documentação | endereço estruturado: cidade, província, código postal, país e coordenadas |
| Horários comerciais | footer e textos do Obrador; horários reais também vivem nos pontos de recolha | `business.openingHours`; manter janelas de recolha na base de dados |
| Instagram/Facebook e links `#` | footer | `business.social.*`; esconder redes sem URL |
| Razão social `FUERZA PAN, S.L.` | footer e conteúdo legal | `business.legalName`, identificação fiscal e morada legal |
| Timezone/moeda/locale | locale espanhol em metadata; datas e moeda EUR em código/SQL; timezone operacional precisa de inventário adicional | configuração de negócio validada, mantendo defaults espanhóis enquanto o produto operar em Espanha |

## 3. Deve virar conteúdo editável

- Home: hero, “Hoy en FUERZA”, manifesto, benefícios, CTA e bloco de subscrição em `src/app/(public)/page.tsx` e `src/components/public/hero-carousel.tsx`.
- Nosotros, Obrador, Dónde estamos e Contacto: títulos, descrições, processo, valores e narrativa em `src/app/(public)/*`.
- Reserva y recoge e Plan de Pan: textos comerciais e nomes de campanha em páginas e componentes de catálogo/subscrição. Rótulos de ações e estados continuam no sistema.
- Newsletter: proposta de valor, consentimento, sucesso, baixa e confirmação em `src/components/public/newsletter*.tsx` e `src/app/(public)/newsletter/**`.
- Footer: manifesto, títulos comerciais, horários e identidade legal em `src/components/public/public-footer.tsx`.
- Legal: dados do responsável e descrições específicas em `src/lib/legal-pages.ts`. O texto jurídico deve usar campos validados e revisão humana por cliente.
- Templates armazenados na base e respetivo editor em `src/app/admin/contenido/emails/**`; separar layout de marca dos assuntos/corpos editáveis.
- Imagens editoriais: todo o inventário de `public/` e URLs Unsplash embutidos em Home/Obrador devem ser mapeados por secção, com alt text editável quando descreve conteúdo comercial.

## 4. Configuração técnica

| Área | Ocorrências | Decisão |
| --- | --- | --- |
| URL/domínio | `NEXT_PUBLIC_SITE_URL`, `src/lib/site-url.ts`, metadataBase, sitemap, robots e JSON-LD | variável por deploy; obrigatória em produção |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, anon key, service role, clientes, `supabase/config.toml` | serviço próprio por cliente. Mudar `project_id = "fuerza"` para nome neutro numa fase de setup, sem tocar migrações aplicadas |
| Stripe | secret/publishable/webhook keys e CSP | serviço próprio por cliente. `fuerza_customer_id` e `fuerza_subscription_id` em metadata exigem leitura compatível durante uma migração |
| Resend | API key, from, reply-to, webhook secret e provider | serviço próprio por cliente; estrutura já está corretamente em variáveis server-side |
| Push | VAPID subject/keys/provider | serviço próprio por cliente; nome/ícone vêm da marca |
| PWA/cache | `public/sw.js`: `fuerza-static-v3`, `fuerza-update` e precache de `/fuerza.jpeg` | versionar e neutralizar numa fase PWA, preservando limpeza de caches antigos |
| Persistência no browser | `fuerza-cart`, `fuerza-visits`, consentimento e cookies de ponto/data | migrar com leitura dos nomes antigos; não renomear diretamente |
| Identificadores SQL | prefixo `FZ-`, nomes/comentários de migrações e dados históricos | definir prefixo futuro configurável ou neutro sem reescrever migrações antigas |
| Pacote/documentação | `package.json`, lockfile, README, OPERATIONS e docs FUERZA | renomear para `obrador-base`; arquivar documentação de origem como referência, sem a apresentar como configuração atual |

## 5. Pode permanecer porque pertence ao sistema

- Next.js, TypeScript, Tailwind, Supabase, Stripe, Resend e PWA enquanto integrações/capacidades.
- Rótulos funcionais: Guardar, Cancelar, Pago, Stock bajo, Pedido confirmado, estados, erros, permissões e navegação operacional genérica.
- Regras de autenticação, RLS, auditoria, pagamentos, disponibilidade, inventário, produção e pedidos.
- Nomes de fornecedores em informação legal quando descrevem realmente o tratamento (Stripe/Supabase), sujeitos a confirmação por cliente.
- Idioma funcional espanhol, EUR e regras comerciais atualmente implementadas, até uma fase específica decidir se devem variar.
- Migrações já criadas: são histórico executável. Corrigir o resultado com novas migrações, nunca editar retroativamente apenas para estética.

## 6. Deve ser removido

- Referências operacionais ao projeto remoto FUERZA e ao ref `bmzedimxzmkpgqnevnmn` em `OPERATIONS.md`.
- Os dois DOCX de projeto FUERZA e documentação de direção criativa, depois de extrair apenas decisões reutilizáveis.
- Assets FUERZA sem uso depois de existir um pacote genérico: logos, wordmarks, fotografias com marca, bolsa, padrões, pilares, pássaro e ficheiros `image-gen-*`. Não remover antes de substituir todas as referências.
- Links sociais `href="#"`, dados de contacto fictícios e quaisquer fotografias temporárias/stock não aprovadas.
- Comentários puramente cosméticos com “estética FUERZA” depois de os tokens e componentes terem nomes neutros.

## Mapa de ocorrências por zona

- Identidade pública: `src/components/public/**`, `src/components/catalog/*top-bar.tsx`, `src/app/(public)/**`, `src/app/(catalog)/**`.
- Identidade administrativa: `src/components/admin/admin-shell.tsx`, `src/components/admin/admin-navigation.tsx`, `src/app/admin/layout.tsx`, subscrições, clientes, pontos de recolha e preview de email.
- SEO/PWA: `src/app/layout.tsx`, `src/app/(public)/layout.tsx`, `src/lib/seo.ts`, `src/app/manifest.ts`, `public/sw.js`, `src/app/icon.png`, `src/app/apple-icon.png`.
- Comunicações: `src/lib/notifications/render.ts`, `src/lib/notifications/push.ts`, newsletter e templates/admin de email.
- Persistência/integrações: `src/components/cart/cart-provider.tsx`, `src/components/privacy/cookie-consent.tsx`, `src/lib/pickup-selection.ts`, APIs Stripe/subscrições e migrações Supabase.
- Conteúdo e assets: `public/**`, seis documentos em `docs/`, README e OPERATIONS.
- Testes: `src/lib/phase-*.test.*` e `supabase/tests/**` contêm expectativas/nomenclatura FUERZA; devem acompanhar cada centralização, não ser apagados em bloco.

## Ordem segura para a fase seguinte

1. Criar um contrato único e tipado para `brand`, `business`, `content`, `features` e `services`.
2. Migrar primeiro metadata, PWA, header/footer, admin chrome e comunicações.
3. Migrar páginas comerciais por secção e substituir o inventário de imagens.
4. Introduzir feature flags nas fronteiras de rota/navegação, sem remover módulos.
5. Só então migrar chaves persistidas/Stripe metadata com compatibilidade e remover legado.

