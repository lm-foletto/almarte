# Almarte

> A sua alma em forma de cor.

Site institucional da **Almarte** — plataforma de obras de arte.

## Stack

Site estático, sem etapa de build. React via CDN + Babel Standalone para transpilar JSX no navegador.

- `index.html` — página raiz, estilos globais e carregamento dos scripts
- `data.jsx` — dados das obras/conteúdo
- `artwork.jsx` — componente de obra
- `overture.jsx` — abertura / hero
- `site.jsx` — seções da página
- `cocreate.jsx` — fluxo de co-criação
- `app.jsx` — montagem do app no `#root`
- `uploads/` — imagens e assets

## Rodar localmente

Servir a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
```

Acesse http://localhost:8000

## Deploy

Pode ser publicado direto via **GitHub Pages** (raiz do repositório).

Este projeto deve ser acessado em:

- `https://lm-foletto.github.io/almarte`

O deploy automático já está configurado via GitHub Actions para a branch `main`.
