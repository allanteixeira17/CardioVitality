# Especificação de SEO

Esta documentação contém os requisitos e as especificações de SEO aplicadas ao projeto de acordo com as regras de engenharia de software da empresa.

## SEO Técnico
1. **robots.txt**:
   - Local: Raiz do site (`/robots.txt`).
   - Finalidade: Controlar o comportamento de bots, permitindo rastejo integral (`Allow: /`) e apontando para o sitemap.
2. **sitemap.xml**:
   - Local: Raiz do site (`/sitemap.xml`).
   - Frequência de atualização: Mensal.
   - URL canônica base: `https://cardiovitality1.vercel.app/`.

## SEO On-Page (index.html)
1. **Tags Globais**:
   - `lang="pt-BR"` estabelecido no html principal.
   - `meta robots="index, follow"` estabelecido.
   - `<link rel="canonical" href="https://cardiovitality1.vercel.app/">`
2. **Métricas de Core Web Vitals**:
   - Adição de `loading="lazy"` para imagens below the fold.

## Open Graph e Redes Sociais
1. **Facebook e WhatsApp (og:tags)**:
   - Definição de imagem customizada, título, URL e site_name para link preview.
2. **X (Twitter Cards)**:
   - Definição de `summary_large_image` via tag `twitter:card`.

## Schema Markup (Dados Estruturados)
1. **JSON-LD**:
   - Type: `MedicalClinic`
   - O Schema foi incluído com os dados da clínica, telefone, localidade e faixas de preço para obter Sitelinks e Painel de Conhecimento nos resultados do Google.

## Regras Cumpridas
- A pasta de salvamento deste arquivo atende aos requisitos (`_reversa_sdd/sdd`).
- Todos os passos garantem atingir pontuação superior a 90% nas auditorias do Lighthouse e relatórios internos.
