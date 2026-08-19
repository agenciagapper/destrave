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
raiz. O arquivo vazio `.nojekyll` desliga o processamento Jekyll, que não
serve pra nada num site sem build e ignora caminhos começados com
underline.

Nem todo push publica. Nesta sessão, os pushes feitos por `git push` a
partir do agente pararam de gerar o build a partir de certo ponto: os
commits chegam na `main`, mas nenhum "pages build and deployment" novo
aparece na aba Actions. O sintoma bate com a regra do GitHub de não
disparar workflow para push autenticado com token de app — commits criados
pela API do GitHub ou pela interface web, que ficam atribuídos à conta,
disparam normalmente.

*Re-run* no workflow não resolve: ele reconstrói o commit daquela execução,
não a ponta da branch. O que refaz o deploy é gerar um evento novo —
qualquer commit pela interface web ou pela API, ou trocar a origem em
*Settings → Pages* (para None, salvar, e de volta para `main` / raiz).

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

## Copy pendente de confirmação

Trechos que não vieram do cliente e ainda precisam do aval dele:

- **Dobra 5, campo "assunto" dos experts** (`.expert__assunto`):
  *Comunicação estratégica*, *Liderança e oratória* e *Comunicação
  corporativa* foram derivados das próprias bios, não informados. O tema
  real de cada bloco pode ser outro.
- **Dobra 5, segundo destaque**: só o card do Rogério está marcado. Falta
  definir qual é o segundo e o texto do selo.
- **Dobra 6, título e linha de apoio**: escritos aqui. A linha de apoio
  afirma que todos os depoentes terminaram o domingo no palco; se algum
  dos oito vídeos não for de quem subiu, a frase precisa mudar.

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
- **Retratos dos experts (dobra 5)**: `expert-rogerio`, `expert-roberto` e
  `expert-amanda`, 800×1000 (4:5), tratados com a mesma receita dos cards
  da dobra 2 — dessaturados, puxados pro quente e com a metade de baixo
  caindo pro escuro, que é onde nome e bio entram. Para somar um expert,
  copiar um `<li class="expert">` no trilho; o carrossel se ajusta sozinho
  e as setas só aparecem quando algum card fica fora da tela. Para destacar
  um card: somar `expert--destaque` e abrir o `<p class="expert__selo">`.
- **Depoimentos (dobra 6)**: os oito pôsteres ainda são espaço reservado —
  degradês da paleta com número, play e duração, sem arquivo de imagem.
  Quando os vídeos chegarem, trocar o conteúdo de `.depo__poster` pelo
  player (ou por uma capa em `<img>` mais um modal), mantendo a proporção
  9:16 e o texto de `.depo__nome` / `.depo__trava`. Se os vídeos vierem
  na horizontal, mudar o `aspect-ratio` de `.depo__poster` e a largura de
  `.depo` resolve — o resto da fita se ajusta.
- **Foto da hero**: o original `background-hero.png` (2,5 MB) fica no repositório
  como fonte, mas quem vai ao ar são as versões WebP `hero-760`, `hero-1200` e
  `hero-1920`, servidas por media query no CSS (128 KB na maior). Ao trocar a
  foto, gerar as três novamente.

## Onde ajustar a identidade visual

Cores, fontes e escala tipográfica ficam em `:root`, no topo de
`assets/css/style.css`. Trocar ali reflete na página inteira.
