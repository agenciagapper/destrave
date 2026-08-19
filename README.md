# Destrave

Landing page estática (HTML + CSS + JS puro, sem build) com formulário.

## Estrutura

```
.
├── index.html            página única
├── assets/
│   ├── css/style.css     tokens de design + estilos
│   ├── js/main.js        scripts (sem dependências)
│   ├── img/              imagens, logo, favicon, og-image
│   └── fonts/            fontes locais (@font-face)
├── .gitignore
├── .editorconfig
└── README.md
```

## Por que sem build

O deploy por Git da Hostinger apenas copia os arquivos do repositório para
`public_html`. Não roda `npm install` nem `npm run build`. Por isso o projeto
entrega HTML/CSS/JS finais direto na raiz — o que está no repo é o que vai ao ar.

## Rodar localmente

Abrir `index.html` no navegador já funciona. Para um servidor local:

```bash
python -m http.server 8000
```

## Prévia no GitHub Pages

Enquanto o domínio não entra, a avaliação visual roda em
`https://agenciagapper.github.io/destrave/`, servido da branch `main` na
raiz. Cada push publica sozinho; o arquivo vazio `.nojekyll` desliga o
processamento Jekyll, que não serve pra nada num site sem build e ignora
caminhos começados com underline.

Quando um push não dispara o build (o evento se perde se a API do GitHub
falhar naquele instante), *Re-run* no workflow "pages build and deployment"
não resolve — ele reconstrói o commit daquela execução, não a ponta da
branch. O que refaz o deploy é gerar um evento novo: qualquer commit novo
na `main`, ou trocar a origem em *Settings → Pages* (para None, salvar, e
de volta para `main` / raiz).

## Deploy na Hostinger (Git)

1. Criar o repositório privado no GitHub e enviar o código.
2. hPanel → **Site** → **Avançado** → **Git**.
3. Em *Criar novo repositório*: colar a URL do repo, branch `main`,
   e deixar o diretório em branco (publica na raiz de `public_html`).
4. Repo privado: copiar a **chave SSH pública** que a Hostinger exibe e
   cadastrá-la no GitHub em *Settings → Deploy keys* do repositório.
5. Cada atualização: botão **Deploy** no hPanel, ou configurar o **webhook**
   que a Hostinger fornece em *Settings → Webhooks* do GitHub para deploy
   automático a cada push.

## Data do evento

Aparece em dois lugares e os dois precisam ser alterados juntos:

- `index.html`, atributo `data-deadline` do bloco `#countdown` (formato ISO com
  fuso, ex. `2026-09-12T19:00:00-03:00`) — alimenta a contagem regressiva.
- `index.html`, parágrafo `.hero__when` — data e cidade exibidas na hero.

## Assets

- **Fontes** ficam em `assets/fonts/` e são carregadas por `@font-face` local,
  sem chamada ao Google Fonts: Archivo (títulos e corpo), Instrument Serif
  itálica (linha de ênfase) e IBM Plex Mono (dígitos do contador).
- **Cards da dobra 2**: `trava-1.webp` (o branco na hora H), `trava-2.webp`
  (perde o fio da apresentação) e `trava-3.webp` (desiste de gravar) são fotos
  geradas no Magnific, 800×1000 (4:5), tratadas no vinho da paleta e com a
  metade de baixo caindo pro escuro — é onde o texto do card entra. Ao trocar
  qualquer uma, manter o nome do arquivo e a mesma receita: vertical 4:5,
  assunto na metade de cima, metade de baixo sem elemento importante.
- **Fotos do evento (dobra 4)**: todas da edição anterior da imersão.
  `evento-sala` (1800×600) abre a dobra sangrando de ponta a ponta;
  `evento-reflexao` (1200×800, recortada em 2:1 pelo CSS), `evento-treino`
  e `evento-palco` (1200×600) e `evento-abraco` (1200×800) entram dentro
  das etapas 01, 03, 06 e 07. Ao trocar, manter os nomes e conferir o
  `object-position` da etapa correspondente pra não cortar rosto.
  `evento-mentor`, `evento-turma` e `evento-microfone` ficam no repositório
  como reserva para as próximas dobras — hoje não são usadas por nenhuma
  página.
- **Foto da hero**: o original `background-hero.png` (2,5 MB) fica no repositório
  como fonte, mas quem vai ao ar são as versões WebP `hero-760`, `hero-1200` e
  `hero-1920`, servidas por media query no CSS (128 KB na maior). Ao trocar a
  foto, gerar as três novamente.

## Onde ajustar a identidade visual

Cores, fontes e escala tipográfica ficam em `:root`, no topo de
`assets/css/style.css`. Trocar ali reflete na página inteira.
