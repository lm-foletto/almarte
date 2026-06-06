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

## Google Sheets temporário

Os formulários de e-mail do rodapé e da co-criação agora tentam enviar os dados para um endpoint do Google Sheets se ele estiver configurado em `data.jsx`. Caso não haja endpoint definido, há um fallback local em `localStorage`.

A planilha destinada é:

- https://docs.google.com/spreadsheets/d/1AseYb2Nmx2ZCW7y7LTpMb2NJ_XBGsXPpZiUREoLyLjo/edit

### Como conectar

1. Dentro da planilha, abra `Extensões` → `Apps Script`.
2. Cole um script que receba `POST` e insira os dados na planilha.
3. Publique como Web App e defina o acesso para "Qualquer pessoa, mesmo anônima".
4. Copie a URL do Web App e cole em `SHEET_ENDPOINT` dentro de `data.jsx`.

Atenção: o valor atual de `SHEET_ENDPOINT` está vazio até você publicar a URL real do Apps Script. Enquanto isso, os dados continuam sendo salvos localmente no navegador como fallback.

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById("1AseYb2Nmx2ZCW7y7LTpMb2NJ_XBGsXPpZiUREoLyLjo")
      .getSheetByName("Sheet1");

    const payload = typeof e.postData.contents === "string"
      ? JSON.parse(e.postData.contents)
      : e.parameter;

    const headers = ["Data", "Tipo", "Email", "Título", "Emoção", "Paleta", "História", "Idioma", "Timestamp"];
    if (sheet.getLastRow() === 0) sheet.appendRow(headers);

    const row = [
      new Date().toLocaleString("pt-BR"),
      payload.type || "",
      payload.email || "",
      payload.title || "",
      payload.emotion || "",
      payload.palette || "",
      payload.story || "",
      payload.lang || "",
      payload.at || new Date().toISOString(),
    ];

    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

### Métricas sugeridas para a planilha

Além das colunas de captura, vale criar uma aba chamada `Resumo` com:

- Total de leads
- Total de newsletter
- Total de contatos via WhatsApp
- Taxa de conversão
- Emails únicos
- Último contato
- Status (novo / respondido / em revisão / fechado)

Exemplo de cálculo simples no Apps Script:

```javascript
function atualizarResumo() {
  const ss = SpreadsheetApp.openById("1AseYb2Nmx2ZCW7y7LTpMb2NJ_XBGsXPpZiUREoLyLjo");
  const dados = ss.getSheetByName("Sheet1");
  const resumo = ss.getSheetByName("Resumo") || ss.insertSheet("Resumo");

  const total = dados.getLastRow() - 1;
  const emails = new Set();
  const tipos = {};

  for (let r = 2; r <= dados.getLastRow(); r++) {
    const email = dados.getRange(r, 3).getValue();
    const tipo = dados.getRange(r, 2).getValue();
    if (email) emails.add(String(email).toLowerCase());
    tipos[tipo] = (tipos[tipo] || 0) + 1;
  }

  resumo.clear();
  resumo.appendRow(["Métrica", "Valor"]);
  resumo.appendRow(["Total de registros", total]);
  resumo.appendRow(["Emails únicos", emails.size]);
  resumo.appendRow(["Newsletter", tipos["newsletter"] || 0]);
  resumo.appendRow(["Lead", tipos["lead"] || 0]);
}
```

## GitHub Actions: Secrets e Variables

Para o deploy no GitHub Pages, use o repositório em:

- Settings → Secrets and variables → Actions

### Recomendação de organização

Secrets (valores sensíveis / links de acesso):
- `SHEET_ENDPOINT` — URL do Web App do Apps Script
- `GOOGLE_SHEET_ID` — ID da planilha (se quiser manter privado)
- `WA_NUMBER` — número do WhatsApp
- `IG_HANDLE` — handle do Instagram

Variables (valores não sensíveis):
- `MUSIC_SRC` — caminho do áudio, por padrão: `audio/NearLight.wav`

### Como funciona

O workflow em `.github/workflows/pages.yml` gera automaticamente um arquivo `config.js` no deploy, usando esses valores. Isso evita escrever links e credenciais diretos no código-fonte.

### Passo a passo

1. Abra o repositório no GitHub.
2. Vá em `Settings → Secrets and variables → Actions`.
3. Crie os `Secrets` acima.
4. Crie o `Variable` `MUSIC_SRC` (ou deixe o padrão).
5. Faça push para `main`.
6. O Actions vai gerar `config.js` e publicar o site.

Obs.: nunca faça commit de `config.js` nem de `.env`. O arquivo gerado é ignorado pelo `.gitignore`.

### Desenvolvimento local (venv / .env)

No desenvolvimento local você deve fornecer um `.env` com os valores desejados e usar o script `start.sh`, que:

- ativa `venv` se existir em `./venv`;
- gera `config.js` a partir de `.env` (executa `./make-config.sh` automaticamente);
- inicia um servidor estático com `python3 -m http.server`.

Passos mínimos para dev local:

```bash
# opcional: crie e ative venv
python3 -m venv venv
source venv/bin/activate

# crie .env com suas variáveis (SHEET_ENDPOINT, GOOGLE_SHEET_ID, WA_NUMBER, IG_HANDLE, MUSIC_SRC)
# em seguida rode:
./start.sh 8000
# abra http://localhost:8000
```

Observação: o fluxo local gera `config.js` no diretório do projeto; este arquivo está em `.gitignore` para não ser commitado.
