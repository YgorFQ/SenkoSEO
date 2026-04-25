// @ts-nocheck

 /*  layouts001.js — Primeiro pacote de layouts do SenkoLib

   RESPONSABILIDADE:
     Registra o array principal de layouts via SenkoLib.register().
     Cada objeto representa um bloco HTML/CSS reutilizável.

   ESTRUTURA DE CADA LAYOUT:
     {
       id:   'section-X',         // identificador único (minúsculo)
       name: 'Section-X (...)',   // nome de exibição
       tags: ['tag1', 'tag2'],    // palavras-chave para busca
       html: `...`,               // HTML do layout
       css:  `...`,               // CSS do layout
     }

//  MARCADORES:
//   Cada objeto é precedido por  /*@@@@Senko - [id] */
//   Esse marcador é usado pelos módulos de edição (senko-fsa.js
//   e senko-github-v2.js) para localizar e substituir o objeto
//   no arquivo sem precisar fazer parse completo do JS.
//
//   PARA ADICIONAR MAIS LAYOUTS:
//     Cole um novo objeto antes do fechamento do array ].
//     Para um novo arquivo de layouts, crie layouts002.js
//     seguindo o mesmo padrão e adicione o <script> no index.html.
//═══════════════════════════════════════════════════════ */

SenkoLib.register([

  /*@@@@Senko - section-1 */
  /* variantes: variants/section-1.js */
  {
    id: 'section-1',
    name: 'Section-1 (Header Imagem)',
    tags: ['header imagem', 'section-1', '1', 'section 1'],
    html: `<section class="product-header" aria-label="Cabeçalho do produto">
  <header class="product-header__banner">
    <figure style="width:100%;height:100%;margin:0;">
      <img
        src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/header.jpg"
        alt="Banner do produto" class="product-header__banner-img" loading="eager">
    </figure>

    <div class="product-header__badge" role="img" aria-label="Logo da marca">
      <img
        src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/logo.png"
        alt="imagem png com ícone da marca" class="product-header__badge-img">
    </div>
  </header>

  <article class="product-header__body">
    <small class="product-header__brand">Marca</small>
    <h1 class="product-header__title">
      TÍTULO DO PRODUTO GAMERE (Nome, modelo, diferencial...)
    </h1>
    <p class="product-header__subtitle">
      Isso é uma descrição. Isso é uma descrição. Isso é uma descrição.
      Isso é uma descrição. Isso é uma descrição. Isso é uma descrição.
      Isso é uma descrição. Isso é uma descrição. Isso é uma descrição.
    </p>
  </article>
</section>`,
    css: `<style>
  *{
    margin: 0;
    padding: 0;
  }

  .product-header {
    --badge-size: 8rem;
    --banner-height: 250px;

    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    position: relative;
    font-family: sans-serif;
    container-type: inline-size;
  }

  .product-header__banner {
    width: 100%;
    height: var(--banner-height);
    position: relative;
    display: flex;
    justify-content: center;
  }

  .product-header__banner figure {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  .product-header__banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .product-header__badge {
    position: absolute;
    bottom: calc(var(--badge-size) / -2);
    width: var(--badge-size);
    height: var(--badge-size);
    background-color: #ff9900;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 10;
  }

  .product-header__badge-img {
    max-width: 90px;
    max-height: 90px;
    object-fit: contain;
  }

  .product-header__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: calc(var(--badge-size) / 2 + 1.1rem) 0.3rem 2.5rem;
    text-align: center;
  }

  .product-header__brand {
    color: #ff9900;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .product-header__title {
    font-size: clamp(1.4rem, 4vw, 2.4rem);
    line-height: clamp(1.6rem, 4vw, 3.1rem);
    font-weight: 600;
    max-width: 50rem;
    text-wrap: pretty;
  }

  .product-header__subtitle {
    color: #8a8a8a;
    font-size: clamp(1rem, 2vw, 1.2rem);
    line-height: 120%;
    margin-top: 1rem;
    max-width: 52rem;
    text-wrap: pretty;
  }

  @media (max-width: 768px) {
    .product-header {
      --banner-height: 180px;
    }
  }

  @media (max-width: 470px) {
    .product-header__subtitle {
      text-align: justify;
      font-size: clamp(0.9rem, 2vw, 1.2rem);
    }
  }
</style>`
  },

  /*@@@@Senko - section-2 */
  /* variantes: variants/section-2.js */
  {
    id: 'section-2',
    name: 'Section-2 (Header Vídeo)',
    tags: ['Section-2', 'Section 2', '2', 'vídeo', 'header vídeo'],
    html: `    <section class="video-header" aria-label="Cabeçalho do produto">
      <header class="video-header__banner">
        <video class="video-header__banner-video"
          poster="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/header.jpg" preload="none" autoplay muted loop
          playsinline width="1200" height="250" aria-hidden="true">
          <source
            src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/cottonbaby/header-cottonbaby1.mov"
            loading="eager">
        </video>
        <div class="video-header__badge" role="img" aria-label="Logo da marca">
          <img
            src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/cottonbaby/logo-cottonbaby2.png"
            alt="imagem png com ícone da marca" class="video-header__badge-img">
        </div>
      </header>
      <article class="video-header__body">
        <small class="video-header__brand">Marca</small>
        <h1 class="video-header__title">
          TÍTULO DO PRODUTO (Nome, modelo, diferencial...)
        </h1>
        <p class="video-header__subtitle">
          Isso é uma descrição. Isso é uma descrição. Isso é uma descrição.
          Isso é uma descrição. Isso é uma descrição. Isso é uma descrição.
          Isso é uma descrição. Isso é uma descrição. Isso é uma descrição.
        </p>
      </article>
    </section>`,
    css: `<style>
  * {
    margin: 0;
    padding: 0;
  }

  .video-header {
    --badge-size: 8rem;
    --banner-height: 250px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    position: relative;
    font-family: sans-serif;
    container-type: inline-size;
  }

  .video-header__banner {
    width: 100%;
    height: var(--banner-height);
    position: relative;
    display: flex;
    justify-content: center;
  }

  .video-header__banner-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
  }

  .video-header__badge {
    position: absolute;
    bottom: calc(var(--badge-size) / -2);
    width: var(--badge-size);
    height: var(--badge-size);
    background-color: #ff9900;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 10;
  }

  .video-header__badge-img {
    max-width: 90px;
    max-height: 90px;
    object-fit: contain;
  }

  .video-header__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: calc(var(--badge-size) / 2 + 1.1rem) 0.3rem 2.5rem;
    text-align: center;
  }

  .video-header__brand {
    color: #ff9900;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .video-header__title {
    font-size: clamp(1.4rem, 4vw, 2.4rem);
    line-height: clamp(1.6rem, 4vw, 3.1rem);
    font-weight: 600;
    max-width: 50rem;
    text-wrap: pretty;
  }

  .video-header__subtitle {
    color: #8a8a8a;
    font-size: clamp(1rem, 2vw, 1.2rem);
    line-height: 120%;
    margin-top: 1rem;
    max-width: 52rem;
    text-wrap: pretty;
  }

  @media (max-width: 768px) {
    .video-header {
      --banner-height: 180px;
    }
  }

  @media (max-width: 470px) {
    .video-header__subtitle {
      text-align: justify;
      font-size: clamp(0.9rem, 2vw, 1.2rem);
    }
  }
</style>`
  },

  /*@@@@Senko - section-4 */
  /* variantes: variants/section-4.js */
  {
    id: 'section-4',
    name: 'Section-4 (Manual de Instrução)',
    tags: ['Section-4', '4', 'Section 4', 'manual de instrução'],
    html: `<section class="section-4-manual__container" aria-label="Manual de Instruções do Produto">
  <figure class="section-4-manual__figura">
    <a href="https://static1.efacil.com.br/wcsstore/AuroraStorefrontAssetStore/PDP/philips-walita/2209713-manual.pdf"
      target="_blank" rel="noopener noreferrer" download title="Baixar manual de instruções do produto"
      class="section-4-manual__link">
      <img
        src="https://static1.efacil.com.br/wcsstore/AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/manual.jpg"
        class="section-4-manual__imagem" width="1200" height="250" loading="lazy" decoding="async" fetchpriority="low"
        alt="Manual de instruções do produto"/>
    </a>
    <figcaption class="section-4-manual__legenda">
      Manual de Instruções — clique para baixar
    </figcaption>
  </figure>
</section>`,
    css: `<style>
  .section-4-manual__container {
    width: 100%;
    margin: 0 auto;
    height: auto;
  }

  .section-4-manual__figura {
    margin: 0;
  }

  .section-4-manual__link {
    display: flex;
    align-items: center;
    text-decoration: none;
    width: 100%;
  }

  .section-4-manual__imagem {
    border-radius: 0.25rem;
    height: auto;
    object-fit: cover;
    width: 100%;
  }

  .section-4-manual__legenda {
    font-family: Arial, sans-serif;
    font-size: 0.75rem;
    color: #666;
    margin-top: 0.25rem;
    text-align: center;
  }

  @media (min-width: 820px) {

    .section-4-manual__container,
    .section-4-manual__figura,
    .section-4-manual__imagem {
      height: 250px;
    }
  }
</style>`
  },

  /*@@@@Senko - section-5 */
  /* variantes: variants/section-5.js */
  {
    id: 'section-5',
    name: 'Section-5',
    tags: ['Section-5', '5', 'Section 5', 'Tabela Nutricional'],
    html: `<section class="section-5-tabela-nutricional-" aria-label="Tabela Nutricional do Produto">
    <figure class="section-5-tabela-nutricional-__figura">

        <a href="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/castelo/4900992-tabela.jpg"
            target="_blank" rel="noopener noreferrer" title="Abrir tabela nutricional completa em tamanho original"
            class="section-5-tabela-nutricional-__link">
            <img src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/TABELA-BANNER.jpg"
                class="section-5-tabela-nutricional-__imagem" width="1200" height="250" loading="lazy" decoding="async"
                fetchpriority="low"
                alt="Tabela nutricional do produto: informações sobre calorias, carboidratos, proteínas, gorduras e demais nutrientes por porção.">
        </a>
        <figcaption class="section-5-tabela-nutricional-__legenda">
            Tabela Nutricional — clique para ampliar
        </figcaption>
    </figure>
</section>`,
    css: `<style>
    .section-5-tabela-nutricional- {
        width: 100%;
        margin: 0 auto;
    }

    .section-5-tabela-nutricional-__figura {
        margin: 0;
    }

    .section-5-tabela-nutricional-__link {
        display: flex;
        align-items: center;
        text-decoration: none;
    }

    .section-5-tabela-nutricional-__imagem {
        border-radius: 0.25rem;
        height: auto;
        object-fit: cover;
        width: 100%;
    }

    .section-5-tabela-nutricional-__legenda {
        font-family: Arial, sans-serif;
        font-size: 0.75rem;
        color: #666;
        margin-top: 0.25rem;
        text-align: center;
    }

    @media (min-width: 820px) {

        .section-5-tabela-nutricional-,
        .section-5-tabela-nutricional-__imagem {
            height: 250px;
        }
    }
</style>`
  },

  
  
  
  /*@@@@Senko - section 39.3 (caderno) */
  /* variantes: variants/section 39.3 (caderno).js */
  {
    id: 'section 39.3 (caderno)',
    name: 'Section 39.3 (Caderno)',
    tags: ['Caderno', 'Section 39.3', '39.3', 'interativo'],
    html: `<div class="bookcontainer1">
  <div class="book1">
    <div class="bookfront1">
      <div class="bookcover1"
        style="background-image: url(https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao39.png);">

      </div>
    </div>
  </div>
</div>`,
    css: `<style>
  .bookcontainer1 {

      display: flex;
      justify-content: center;
      /* Alinha os livros no centro horizontalmente */
      gap: 20px;
      /* Espaçamento entre os livros */
      perspective: 2800px;
      z-index: 1;
      margin-top: 15px;
    }

    .bookcontainer1 .book1 {

      display: block;
      position: relative;
      width: 423px;
      height: 552px;
      color: #2b2b2b;
      background: linear-gradient(45deg, #e9e9e9 0%, #e9e9e9 100%);
      border-radius: 3px 4px 4px 3px;
      box-shadow: 12px 12px 7px 0px rgba(115, 114, 116, 0.6);
      font-weight: 400;
      transform-style: preserve-3d;
      transition: transform 0.6s;
    }

    .bookcontainer1 .book1:hover {

      transform: rotate3d(0, 1, 0, 30deg);
    }

    .bookcontainer1 .bookfront1 {

      transform-origin: 0% 50%;
      transform-style: preserve-3d;
      z-index: 10;
      transition: transform 0.6s;
      transform: translate3d(0, 0, 18px);
    }

    .bookcontainer1 .bookfront1>div {

      height: 552px;
      width: 423px;
      border-radius: 0 3px 3px 0;
      box-shadow: inset 3px 0 9px rgba(0, 0, 0, 0.1);
      background-size: cover;
      background-repeat: no-repeat;
      background-position: top left;
    }

    .bookcontainer1 .bookleft1-side {

      height: 540px;
      width: 45px;
      left: -18px;
      transform: rotate3d(0, 1, 0, -90deg);
    }

    .bookcontainer1 .bookcover1:after {

      content: '';
      position: absolute;
      top: 0;
      left: 12px;
      bottom: 0;
      width: 3px;
      background: rgba(0, 0, 0, 0.12);
      box-shadow: 1px 0 3px rgba(255, 255, 255, 0.1);
    }

    .bookcontainer1 .bookfront1:after {

      content: '';
      position: absolute;
      top: 1px;
      bottom: 1px;
      left: -1px;
      width: 1px;
    }

    .bookcover1 {

      background-size: 106%;
    }
</style>`
  },

  /*@@@@Senko - section 39.2 (caderno) */
  /* variantes: variants/section 39.2 (caderno).js */
  {
    id: 'section 39.2 (caderno)',
    name: 'Section 39.2 (Caderno)',
    tags: ['Caderno', 'Section 39.2', '39.2', 'interativo'],
    html: `<div class="bookcontainer3">
  <div class="book3">
    <div class="bookfront3">
      <div class="bookcover3 frontcover3"
        style="background-image: url('https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao39.2.png')">
      </div>
    </div>
    <div class="bookleft3-side"></div>
    <div class="bookback3"
      style="background-image: url(https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao39_02.png);">
      <div class="bookcover3 backcover3"></div>
    </div>
    <div class="bookinnerpage3"
      style="background-image: url(https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao39_02.png);">
    </div>
  </div>
</div>`,
    css: `<style>
  .bookcontainer3 {

    display: flex;
    justify-content: center;
    gap: 20px;
    perspective: 2800px;
    z-index: 1;
  }

  .bookcontainer3 .book3 {

    display: block;
    position: relative;
    width: 520px;
    height: 410px;
    color: #2b2b2b;
    border-radius: 3px 4px 4px 3px;
    box-shadow: 12px 12px 7px 0px rgba(115, 114, 116, 0.6);
    font-weight: 400;
    transform-style: preserve-3d;
    transition: transform 0.6s;
  }

  .bookcontainer3 .book3:hover {

    transform: rotate3d(0, 1, 0, 30deg);
  }

  .bookcontainer3 .bookfront3 {

    transform-origin: 0% 50%;
    transform-style: preserve-3d;
    z-index: 10;
    transition: transform 0.6s;
    transform: translate3d(0, 0, 18px);
  }

  .bookcontainer3 .bookfront3>div {

    height: 410px;
    width: 540px;
    border-radius: 0 3px 3px 0;
    box-shadow: inset 3px 0 9px rgba(0, 0, 0, 0.1);
  }

  .bookcontainer3 .bookleft3-side {

    height: 410px;
    width: 45px;
    left: -18px;
    transform: rotate3d(0, 1, 0, -90deg);
  }

  .bookcontainer3 .bookcover3:after {

    content: '';
    position: absolute;
    top: 0;
    left: 12px;
    bottom: 0;
    width: 3px;
    background: rgba(0, 0, 0, 0.12);
    box-shadow: 1px 0 3px rgba(255, 255, 255, 0.1);
  }

  .bookcontainer3 .bookfront3:after {

    content: '';
    position: absolute;
    top: 1px;
    bottom: 1px;
    left: -1px;
    width: 1px;
  }

  .bookcover3 {

    background-size: 102%;
    transform-origin: left;
    transition: transform 0.6s;
  }

  .bookinnerpage3 {

    background-size: 103%;
    transform-origin: left;
    transition: transform 0.6s;
  }

  .bookcontainer3 .book3:hover .bookcover3 {

    transform: rotateY(-160deg);
  }

  .bookcontainer3 .book3:hover .bookinnerpage3 {

    transform: rotateY(-160deg) translateZ(-11px) translateX(26px);
    opacity: 1;
  }

  .bookback3 {

    position: absolute;
    top: 0;
    left: 0;
    width: 540px;
    height: 410px;
    background-size: 101%;
    border-radius: 3px 4px 4px 3px;
  }

  .bookcontainer3 .bookinnerpage3 {

    position: absolute;
    top: 0;
    opacity: 1;
    left: 20px;
    height: 100%;
    width: 100%;
    background-size: 103%;
    z-index: -1;
    /* Mantém a página atrás do livro */

    transform: translate3d(0px, 0px, 0px);
    /* Leve ajuste de posição */
  }
</style>`
  },

  /*@@@@Senko - section-46 */
  /* variantes: variants/section-46.js */
  {
    id: 'section-46',
    name: 'Section-46',
    tags: ['Imagem quadrada'],
    html: `      <div class="section-46-y reverse-46 ">
        <!--    AQUI É POSSIVEL TROCAR SE A IMAGEM FICA EM CIMA OU EM BAIXO TIRANDO A CLASSE "TROCAR-ORDEM-730PX"-->
        <div class="section-46-y-img trocar-ordem-730px">
          <img
            src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao4.jpg"
            alt="Imagem representativa do do produto">
        </div>
        <div class="section-46-y-content">

          <!-- Título padrão-->
          <h2>
            Isso é um título. <br> Isso é um título.
          </h2>
          <!-- Descrição padrão-->
          <p class="section-46-y-desc">
            Isso é uma descrição gamer. Isso é uma descrição gamer.
          </p>

          <!-- título e Descrição com ícone -->
          <div class="section-46-y-box reverse-icon-46">
            <div class="section-46-y-box-icon reverse-icon-46">
              <img
                src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao47.jpg"
                width="75" height="75" alt="Ícone de qualidade">
            </div>
            <div class="section-46-y-box-text">
              <h3>Isso é um título.</h3>
              <p>Isso é uma descrição gamer. Isso é uma descrição gamer.</p>
            </div>
          </div>

          <!-- título e Descrição com ícone invertido -->
          <div class="section-46-y-box reverse-icon">
            <div class="section-46-y-box-icon">
              <img
                src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao47.jpg"
                width="75" height="75" alt="Ícone de qualidade">
            </div>
            <div class="section-46-y-box-text">
              <h3>Isso é um título.</h3>
              <p>Isso é uma descrição gamer. Isso é uma descrição gamer.</p>
            </div>
          </div>
        </div>
      </div>`,
    css: `<style>
.section-46-y {
      max-width: 1300px;
      margin: 0 auto;
      padding: 40px 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 40px;
      text-align: left;
    }

    .section-46-y.reverse-46 {
      flex-direction: row-reverse;

    }

    /* ===== IMAGEM ===== */
    .section-46-y-img {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .section-46-y-img img {
      width: 100%;
      max-width: 550px;
      border-radius: 12px;
      display: block;
      transition: transform 0.3s ease;
    }

    .section-46-y-img img:hover {
      transform: scale(1.02);
      /*aumentar/diminuir efeito que faz piscar a iamgem */
    }

    /* ===== CONTEÚDO ===== */
    .section-46-y-content {
      flex: 1;
    }

    .section-46-y-content h2 {
      text-align: center;
    }

    .section-46-y-content p {
      text-align: center;
    }

    /* ===== TITULO ===== */
    .section-46-y-content h2 {
      font-family: sans-serif;
      font-size: clamp(22px, 3.2vw, 38px);
      font-weight: 700;
      margin-bottom: 20px;
      line-height: 1.2;
    }

    /* ===== DESCRIÇÃO ===== */
    .section-46-y-desc {
      font-family: sans-serif;
      font-size: clamp(14px, 1.4vw, 26px);
      margin-bottom: 30px;
      color: #1b1b1b;
      line-height: 28px;
    }

    .section-46-y-box {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 25px;
      padding: 12px;
      border-radius: 10px;
      transition: background 0.3s ease, transform 0.3s ease;
    }

    .section-46-y-box:hover {
      background: #29292936;
      transform: translateY(-3px);
    }

    .section-46-y-box-icon img {
      width: 48px;
      height: 48px;
      object-fit: contain;
    }

    .section-46-y-box-text h3 {
      font-family: sans-serif;
      font-size: clamp(16px, 2vw, 32px);
      margin: 0 0 5px;
      line-height: 1.1;
    }

    .section-46-y-box-text p {
      font-family: sans-serif;
      font-size: clamp(12px, 1.4vw, 22px);
      color: #555;
      margin: 0;
      line-height: 1.1;
    }

    @media (max-width: 1060px) {

      .section-46-y-content h1 {
        font-size: 3.8vw;
      }

      .section-46-y-desc {
        font-size: 1.8vw;
      }

      .section-46-y-box-text h3 {
        font-size: 2.4vw;
      }

      .section-46-y-box-text p {
        font-size: 1.8vw;
      }
    }

    @media (max-width: 960px) {

      .section-46-y-content h1 {
        font-size: 4.3vw;
      }

      .section-46-y-desc {
        font-size: 2vw;
      }

      .section-46-y-box-text h3 {
        font-size: 2.7vw;
      }

      .section-46-y-box-text p {
        font-size: 2.3vw;
      }
    }

    @media (max-width: 730px) {

      .section-46-y {
        flex-direction: column;
        text-align: center;
      }

      .section-46-y-box {
        flex-direction: column;
        text-align: center;
      }

      .section-46-y-content h1 {
        font-size: 5vw;
      }

      .section-46-y-desc {
        font-size: 2.7vw;
      }

      .section-46-y-box-text h3 {
        font-size: 3.3vw;
      }

      .section-46-y-box-text p {
        font-size: 2.5vw;
        text-align: left;
      }
    }

    @media (max-width: 800px) {

      .section-46-y,
      .section-46-y.reverse,
      .section-46-y[data-order="invert"] {
        flex-direction: column !important;
        padding: 0 20px 40px 20px;
      }

      .section-46-y-img {
        width: 81%;
      }

      .section-46-y-box,
      .section-46-y-box.reverse-icon,
      .section-46-y-box[data-icon-order="invert"] {
        flex-direction: row !important;
        text-align: center !important;
      }

      .section-46-y-box-text {
        text-align: left !important;
        margin-left: 8px;
      }

      .section-46-y-box-text p {
        text-align: left !important;
      }
    }

    @media (max-width: 500px) {
      .section-46-y-content h1 {
        font-size: 6vw;
      }

      .section-46-y-desc {
        font-size: 3.5vw;
      }

      .section-46-y-box-text h3 {
        font-size: 4vw;
        line-height: 1.1;
      }

      .section-46-y-box-text p {
        font-size: 3.3vw;
        line-height: 1.1;
        text-align: left;
      }
    }

    @media (max-width: 420px) {
      .section-46-y-content h1 {
        font-size: 7vw;
      }

      .section-46-y-desc {
        font-size: 4vw;
      }

      .section-46-y-box-text h3 {
        font-size: 5vw;
        line-height: 1.1;
      }

      .section-46-y-box-text p {
        font-size: 3.8vw;
        line-height: 1.1;
        text-align: left;
      }
    }

    .section-46-y.reverse-46 {
      flex-direction: row-reverse;
    }

    .section-46-y-box.reverse-icon-46 {
      flex-direction: row-reverse;
      text-align: right;
    }
</style>`
  },

  /*@@@@Senko - section-3 */
  /* variantes: variants/section-3.js */
  {
    id: 'section-3',
    name: 'section-3',
    tags: [],
    html: `        <div class="universal-container">
      <section class="section-4 --dark --horizontal">
        <div class="section-4__header">
          <h2 class="section-4__title"><em>Cîroc</em> Vodka Original</h2>
        </div>

        <div class="section-4__grid">
          <div class="section-4__spec">
            <p class="section-4__spec-key">País</p>
            <p class="section-4__spec-val">França</p>
          </div>
          <div class="section-4__spec">
            <p class="section-4__spec-key">Tipo</p>
            <p class="section-4__spec-val">Vodka</p>
          </div>
          <div class="section-4__spec">
            <p class="section-4__spec-key">Alc.</p>
            <p class="section-4__spec-val">40%</p>
          </div>
          <div class="section-4__spec">
            <p class="section-4__spec-key">Vol.</p>
            <p class="section-4__spec-val">750ml</p>
          </div>
          <div class="section-4__spec">
            <p class="section-4__spec-key">Destilado</p>
            <p class="section-4__spec-val">5×</p>
          </div>
          <div class="section-4__spec">
            <p class="section-4__spec-key">Garrafa</p>
            <p class="section-4__spec-val">Vidro</p>
          </div>
        </div>
      </section>
    </div>`,
    css: `<style>
.section-4 {
      --s4-bg: #f8f5ef;
      --s4-text: #0a1428;
      --s4-accent: #0a1428;
      --s4-gold: #9a7820;
      --s4-muted: #6a6a7a;
      --s4-border: rgba(10, 20, 40, 0.1);
      --s4-card: #ffffff;

      container-type: inline-size;
      background: var(--s4-bg);
      padding: clamp(3rem, 7vw, 7rem) clamp(1.5rem, 6vw, 8rem);
    }

    .section-4.--dark {
      --s4-bg: #0a1428;
      --s4-text: #e8e2d4;
      --s4-accent: #c4a44a;
      --s4-gold: #c4a44a;
      --s4-muted: #7080a0;
      --s4-border: rgba(196, 164, 74, 0.15);
      --s4-card: #111d38;
    }

    .section-4.--with-bottle {
      --s4-bg: #050d1f;
      --s4-text: #e8e2d4;
      --s4-accent: #c4a44a;
      --s4-gold: #c4a44a;
      --s4-muted: #7080a0;
      --s4-border: rgba(196, 164, 74, 0.15);
      --s4-card: #0a1428;
    }

    .section-4__header {
      text-align: center;
      margin-block-end: clamp(2rem, 5vw, 4rem);
    }

    .section-4__eyebrow {

      font-size: clamp(0.58rem, 0.85vw, 0.7rem);
      font-weight: 300;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      color: var(--s4-gold);
      display: block;
      margin-block-end: 0.7rem;
    }

    .section-4__title {

      font-size: clamp(2rem, 4vw, 3.5rem);
      font-weight: 300;
      color: var(--s4-text);
      line-height: 1.1;
      letter-spacing: -0.01em;
    }

    .section-4__title em {
      font-style: italic;
    }

    .section-4__with-bottle-layout {
      display: none;
    }

    .section-4.--with-bottle .section-4__with-bottle-layout {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: clamp(1rem, 3vw, 2rem);
      align-items: center;
    }

    .section-4.--with-bottle .section-4__grid {
      display: none;
    }

    .section-4__bottle-col {
      display: flex;
      justify-content: center;
    }

    .section-4__bottle-img {
      width: clamp(100px, 16vw, 200px);
      aspect-ratio: 1/3;
      object-fit: contain;
      filter: drop-shadow(0 30px 60px rgba(196, 164, 74, 0.2));
    }

    .section-4__spec-col {
      display: flex;
      flex-direction: column;
      gap: clamp(0.6rem, 1.5vw, 1rem);
    }

    .section-4__spec-col--right {
      align-items: flex-end;
      text-align: right;
    }

    .section-4__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
      gap: clamp(0.6rem, 1.5vw, 1.2rem);
    }

    .section-4__spec {
      background: var(--s4-card);
      border: 1px solid var(--s4-border);
      padding: clamp(1.2rem, 2.5vw, 2rem) clamp(1rem, 2vw, 1.5rem);
      position: relative;
    }

    .section-4__spec::after {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      translate: -50% 0;
      width: 30px;
      height: 1px;
      background: var(--s4-gold);
    }

    .section-4__spec-key {

      font-size: clamp(0.55rem, 0.75vw, 0.64rem);
      font-weight: 500;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--s4-gold);
      margin-block-end: 0.5em;
    }

    .section-4__spec-val {

      font-size: clamp(1.1rem, 1.8vw, 1.5rem);
      font-weight: 400;
      color: var(--s4-text);
      line-height: 1.2;
    }

    .section-4__spec-sub {

      font-size: clamp(0.6rem, 0.75vw, 0.68rem);
      color: var(--s4-muted);
      margin-block-start: 0.3em;
    }

    .section-4.--horizontal .section-4__grid {
      grid-template-columns: repeat(auto-fit, minmax(min(120px, 100%), 1fr));
      border: 1px solid var(--s4-border);
    }

    .section-4.--horizontal .section-4__spec {
      border: none;
      border-right: 1px solid var(--s4-border);
      text-align: center;
    }

    .section-4.--horizontal .section-4__spec:last-child {
      border-right: none;
    }

    @container (max-width: 580px) {
      .section-4.--with-bottle .section-4__with-bottle-layout {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
      }

      .section-4__bottle-col {
        grid-column: 1 / -1;
        order: -1;
      }

      .section-4__bottle-img {
        width: 100px;
      }

      .section-4__spec-col--right {
        align-items: flex-start;
        text-align: left;
      }
    }
</style>`
  },

  /*@@@@Senko - section-32 */
  /* variantes: variants/section-32.js */
  {
    id: 'section-32',
    name: 'section-32',
    tags: ['section-32', '32', 'imagem', 'hero', '32.11'],
    html: `  <section class="section-32__container" aria-label="Seção de destaque do produto">
    <figure class="section-32__groupimage-section">
      <img src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/metalfrio/2223537_02.jpg"
        alt="!!!!!COLOQUE O TEXTO ALT AQUI!!!!!" style="border-radius: 0px 0px 0px 0px;" width="1600" height="865"
        loading="lazy" decoding="async" fetchpriority="low">
      <figcaption class="section-32__grouptext-overlay left">
        <p style="color: #faca95;">Isso é uma descrição. Isso é uma descrição.</p>
        <h2 style="color: #faca95;"><strong>SUB-TÍTULO</strong></h2>
        <p style="color: #faca95;">Isso é uma descrição. Isso é uma descrição. Isso é uma descrição. Isso é umadescrição.</p>
      </figcaption>
    </figure>
  </section>`,
    css: `  <style>
    .section-32__container {
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
    }

    .section-32__groupimage-section {
      position: relative;
      width: 100%;
      margin: 0;
      contain: layout style;
    }

    .section-32__groupimage-section img {
      width: 100%;
      height: auto;
      display: block;
    }

    .section-32__grouptext-overlay {
      position: absolute;
      max-width: 40%;
      width: 90%;
      line-height: 1.5;
      text-align: center;
      font-family: sans-serif
    }

    .section-32__grouptext-overlay.top {
      top: 3%;
      left: 50%;
      transform: translateX(-50%);
    }

    .section-32__grouptext-overlay.bottom {
      top: 84%;
      left: 50%;
      transform: translateX(-50%);
    }

    .section-32__grouptext-overlay.left {
      top: 50%;
      left: 25%;
      transform: translate(-50%, -50%);
      max-width: 41%;
    }

    .section-32__grouptext-overlay.right {
      top: 50%;
      left: 75%;
      transform: translate(-50%, -50%);
      max-width: 42%;
    }

    .section-32__grouptext-overlay h2 {
      font-size: 2vw;
      font-weight: bold;
      margin-bottom: 1.5px;
      line-height: 120%;
    }

    .section-32__grouptext-overlay p {
      font-size: 1.1vw;
      margin: 0;
      line-height: 120%;
    }

    @media (max-width: 960px) {
      .section-32__grouptext-overlay h2 {
        font-size: 2.1vw;
      }

      .section-32__grouptext-overlay p {
        font-size: 1.5vw;
      }
    }

    @media (max-width: 768px) {
      .section-32__grouptext-overlay h2 {
        font-size: 2.5vw;
      }

      .section-32__grouptext-overlay p {
        font-size: 1.8vw;
      }
    }

    @media (max-width: 500px) {
      .section-32__grouptext-overlay h2 {
        font-size: 3vw;
      }

      .section-32__grouptext-overlay p {
        font-size: 2.3vw;
      }
    }

    @media (max-width: 480px) {
      .section-32__grouptext-overlay h2 {
        font-size: 3vw;
      }

      .section-32__grouptext-overlay p {
        font-size: 2.3vw;
      }
    }

    @media (max-width: 1060px) {
      .section-32__grouptext-overlay.top {
        top: 3%;
      }
    }

    @media (max-width: 960px) {
      .section-32__grouptext-overlay.top {
        top: 3%;
      }
    }

    @media (max-width: 768px) {
      .section-32__grouptext-overlay.top {
        top: 3%;
      }
    }

    @media (max-width: 500px) {
      .section-32__grouptext-overlay.top {
        top: 3%;
      }
    }

    @media (max-width: 480px) {
      .section-32__grouptext-overlay.top {
        top: 3%;
      }
    }

    @media (max-width: 1060px) {
      .section-32__grouptext-overlay.bottom {
        top: 81%;
      }
    }

    @media (max-width: 960px) {
      .section-32__grouptext-overlay.bottom {
        top: 79%
      }
    }

    @media (max-width: 480px) {
      .section-32__grouptext-overlay.bottom {
        top: 81%
      }
    }

    @media (max-width: 768px) {
      .section-32__grouptext-overlay.bottom {
        top: 76%;
      }
    }

    @media (max-width: 500px) {
      .section-32__grouptext-overlay.bottom {
        top: 67%;
      }
    }
    
    @media (max-width: 480px) {

      .section-32__grouptext-overlay.right {
        top: 50%;
        left: 73%;
        transform: translate(-50%, -50%);
      }
    }

    @media (max-width: 480px) {

      .section-32__grouptext-overlay.left {
        top: 50%;
        left: 27%;
        transform: translate(-50%, -50%);
      }
    }

    .grouptext-overlay-Background {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4.5vw;
        padding: 0.5rem;
        backdrop-filter: blur(0.8vw);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        -webkit-backdrop-filter: blur(10px);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.3);
        max-width: 70%;
        z-index: 100;
    }
  </style>`
  },

  /*@@@@Senko - section-33 */
  /* variantes: variants/section-33.js */
  {
    id: 'section-33',
    name: 'section-33',
    tags: ['section-33', 'section 33', '33', 'video'],
    html: `  <div class="section-33__container">
    <section class="section-33__mov-section" aria-label="Seção de destaque em vídeo">
      <figure class="section-33__mov-figure">
        <video class="section-33__mov-figure__video"
          src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/metalfrio/2223537_video2.mov"
          autoplay muted loop playsinline style="border-radius: 0px 0px 0px 0px;" width="1600" height="865"
          aria-label="Vídeo de destaque do produto">
          <track kind="descriptions" label="Descrição do vídeo"/>
          Desculpe, mas o vídeo não pode ser carregado...
        </video>
      </figure>
    </section>
  </div>`,
    css: `  <style>
    .section-33__container {
      width: 100%;
      margin: 0 auto;
    }

    .section-33__container--spaced {
      margin-bottom: 50px;
      align-self: center;
    }

    .section-33__mov-section {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .section-33__mov-figure {
      position: relative;
      width: 100%;
      margin: 0;
    }

    .section-33__mov-figure__video {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }

    /* Suporte a imagem como fallback */
    .section-33__mov-figure__img {
      width: 100%;
      height: auto;
      display: block;
    }

  </style>`
  },

  /*@@@@Senko - section 41 */
  /* variantes: variants/section 41.js */
  {
    id: 'section-41',
    name: 'Section-41 (tabela)',
    tags: ['tabela', 'section 41', '41', 'footer', 'semantico'],
    html: `<footer>

          <section class="table-container-custom" aria-label="tabela contendo produtos relacionados e citados dentre deste conteúdo">
          <h1 class="table-text-custom">ITENS RELACIONADOS</h1><br />
          <table class="table-design-custom">
            <thead class="table-head-custom">
               <tr class="table-tr-custom">
                 <th class="table-text-custom table-th-custom" style="background-color: #fb8d00; border-radius: 10px 0 0 0;">SKU
                 </th>
                 <!--Replicar para adicionar mais COLUNAS-->
                 <th class="table-text-custom table-th-custom" style="background-color: #fb8d00; border-radius: 0 10px 0 0;">TÍTULO
                 </th>
               </tr>
             </thead>
             <tbody>
               <tr class="table-tr-custom">
                 <td class="table-text-custom table-td-custom-title">SKU 1</td>
                 <td class="table-text-custom table-td-custom-sub">DESCRIÇÃO DO PRODUTO 1</td>
               </tr>
               <tr class="table-tr-custom">
                 <td class="table-text-custom table-td-custom-title">SKU 2</td>
                 <td class="table-text-custom table-td-custom-sub">DESCRIÇÃO DO PRODUTO 2</td>
               </tr>
               <tr class="table-tr-custom">
                 <td class="table-text-custom table-td-custom-title">SKU 3</td>
                 <td class="table-text-custom table-td-custom-sub">DESCRIÇÃO DO PRODUTO 3</td>
               </tr>
               <tr class="table-tr-custom">
                 <td class="table-text-custom table-td-custom-title ">SKU 4</td>
                 <td class="table-text-custom table-td-custom-sub">DESCRIÇÃO DO PRODUTO 4</td>
               </tr>
             </tbody>
           </table>
         </section>
        </footer>`,
    css: `.table-container-custom {

    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    display: block;
    }

  .table-design-custom {

    width: 100%;
    border-collapse: collapse;
    margin: 0 auto;
    }

  .table-head-custom {
    color: rgb(255, 255, 255);
    border-radius: 10px;

    }

  .table-text-custom {

    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #979797;
    font-family: sans-serif;
     }

  .table-row-custom:hover {

    background-color: #f1f1f1;
    filter: brightness(0.9);
    }

  .table-th-custom {

    font-weight: bold;
    }

  .table-td-custom {

    color: #555;
    }

  /* Efeito de zebrado nas linhas */

  .table-tr-custom:nth-child(even) {

    background-color: #f1f1f1;
    }


 @media (max-width: 600px) {

    .table-container-custom {

      padding: 10px;
    }

    .table-text-custom,
    .table-th-custom,
    .table-td-custom {

      padding: 8px;
    }
    }`
  },

  
  /*@@@@Senko - section 39.1 (caderno) */
  /* variantes: variants/section 39.1 (caderno).js */
  {
    id: 'section 39.1 (caderno)',
    name: 'Section 39.1 (Caderno)',
    tags: ['interativo', 'Section 39.1', '39.1', 'caderno'],
    html: `<div class="bookcontainer">
  <div class="book">
    <div class="bookfront">
      <div class="bookcover frontcover"
        style="background-image: url('https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao39.png')">
      </div>
    </div>
    <div class="bookleft-side"></div>
    <div class="bookback"
      style="background-image: url(https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao39_02.png);">
      <div class="bookcover backcover"></div>
    </div>
    <div class="bookinnerpage"
      style="background-image: url(https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao39_02.png);">
    </div>
  </div>
</div>`,
    css: `<style>
  .bookcontainer {

    display: flex;
    justify-content: center;
    gap: 20px;
    perspective: 2800px;
    z-index: 1;
  }

  .bookcontainer .book {

    display: block;
    position: relative;
    width: 400px;
    height: 540px;
    color: #2b2b2b;
    border-radius: 3px 4px 4px 3px;
    box-shadow: 12px 12px 7px 0px rgba(115, 114, 116, 0.6);
    font-weight: 400;
    transform-style: preserve-3d;
    transition: transform 0.6s;
  }

  .bookcontainer .book:hover {

    transform: rotate3d(0, 1, 0, 30deg);

  }

  .bookcontainer .bookfront {

    transform-origin: 0% 50%;
    transform-style: preserve-3d;
    z-index: 10;
    transition: transform 0.6s;
    transform: translate3d(0, 0, 18px);
  }

  .bookcontainer .bookfront>div {

    height: 540px;
    width: 410px;
    border-radius: 0 3px 3px 0;
    box-shadow: inset 3px 0 9px rgba(0, 0, 0, 0.1);
  }

  .bookcontainer .bookleft-side {

    height: 540px;
    width: 45px;
    left: -18px;
    transform: rotate3d(0, 1, 0, -90deg);
  }

  .bookcontainer .bookcover:after {

    content: '';
    position: absolute;
    top: 0;
    left: 12px;
    bottom: 0;
    width: 3px;
    background: rgba(0, 0, 0, 0.12);
    box-shadow: 1px 0 3px rgba(255, 255, 255, 0.1);
  }

  .bookcontainer .bookfront:after {

    content: '';
    position: absolute;
    top: 1px;
    bottom: 1px;
    left: -1px;
    width: 1px;
  }

  .bookcover {

    background-size: 102%;
    transform-origin: left;
    transition: transform 0.6s;
  }

  .bookinnerpage {

    background-size: 103%;
    transform-origin: left;
    transition: transform 0.6s;
  }

  .bookcontainer .book:hover .bookcover {

    transform: rotateY(-160deg);

  }

  .bookcontainer .book:hover .bookinnerpage {

    transform: rotateY(-160deg) translateZ(-11px) translateX(26px);
    opacity: 1;
  }

  .bookback {

    position: absolute;
    top: 0;
    left: 0;
    width: 410px;
    height: 540px;
    background-size: 101%;
    border-radius: 3px 4px 4px 3px;
  }

  .bookcontainer .bookinnerpage {

    position: absolute;
    top: 0;
    opacity: 1;
    left: 20px;
    height: 100%;
    width: 98%;
    background-size: 103%;
    z-index: -1;
    /* Mantém a página atrás do livro */

    background-size: cover;
    background-position: center;
    object-fit: cover;
    transform: translate3d(0px, 0px, 0px);
    /* Leve ajuste de posição */
  }
</style>`
  },

  




/*@@@@Senko - section-6 */
  /* variantes: variants/section-6.js */
  {
    id: 'section-6',
    name: 'Section-6',
    tags: ['Section 6', 'Hero', '6'],
    html: `    <section class="section-6" aria-label="Destaque do produto com texto">
      <picture>
        <source media="(max-width: 760px)"
          srcset="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/section-49-2.png"
          width="780" height="400">
        <img class="section-6__image"
          src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/section-49-1.png"
          alt="Caderno Funny Cat com estampa de gatinhos, capa colorida e espiral" width="1600" height="650"
          loading="eager" fetchpriority="high" decoding="async">
      </picture>
      <div class="section-6__content">
        <h1 class="section-6__title">Caderno Funny Cat</h1>
        <p class="section-6__description">Organize seus estudos com fofura e estilo!</p>
      </div>
    </section>`,
    css: `    <style>
        /* ===== HERO SECTION — VARIÁVEIS ===== */
        .section-6 {
            --pos-y: 50%;
            --pos-x: 7%;
            --color-title: #ffe178;
            --bg-box: rgba(0, 0, 0, 0.33);

            width: 100%;
            position: relative;
            border-radius: 20px;
            overflow: hidden;
        }

        /* ===== IMAGEM ===== */
        .section-6__image {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 20px;
        }

        /* ===== CONTEÚDO SOBREPOSTO ===== */
        .section-6__content {
            position: absolute;
            top: var(--pos-y);
            left: clamp(1%, var(--pos-x), 100%);
            transform: translateY(-50%);
            max-width: min(40%, 480px);
            z-index: 10;
            background-color: var(--bg-box);
            padding: clamp(12px, 2vw, 20px);
            border-radius: 15px;
            backdrop-filter: blur(4px);
        }

        .section-6__title {
            font-size: clamp(1.4rem, 3.5vw, 2.6rem);
            color: var(--color-title);
            margin: 0 0 10px;
            line-height: 1.2;
            text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
            font-weight: 800;
        }

        .section-6__description {
            font-size: clamp(0.95rem, 2vw, 1.4rem);
            color: #fff;
            margin: 0 0 24px;
            line-height: 1.5;
            text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.35);
        }

        /* ===== MOBILE ===== */
        @media (max-width: 760px) {
            .section-6__ {
                border-radius: 0;
            }

            .section-6__content {
                position: static;
                transform: none;
                max-width: 100%;
                padding: 24px 20px 0 20px;
                background: transparent;
                backdrop-filter: none;
                text-align: center;
            }

            .section-6__title {
                font-size: 1.8rem;
                color: #333;
                text-shadow: none;
            }

            .section-6__description {
                margin-bottom: 0;
                font-size: 1.1rem;
                color: #555;
                text-shadow: none;
            }

            .section-6__image {
                width: 95%;
                margin: auto;
                height: auto;
                display: block;
                border-radius: 20px;
            }
        }

        @media (max-width: 480px) {
            .section-6__title {
                font-size: 1.5rem;
            }

            .section-6__description {
                font-size: 1rem;
            }
        }
    </style>`
  },












/*@@@@Senko - section-7 */
  /* variantes: variants/section-7.js */
  {
    id: 'section-7',
    name: 'Section-7',
    tags: ['Fallitens', 'section 7', '7'],
    html: `<section class="section-7__banner" style="--d1:0.1; --d2:0.7; --d3:0.3; --d4:0.5; --d5:0.2;"
  aria-label="Banner promocional">
  <!-- Falling items (decorativos, aria-hidden) -->
  <img class="section-7__falling-item"
    src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/logo-efacil.png"
    width="200" height="200" aria-hidden="true" alt="">
  <img class="section-7__falling-item"
    src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/logo-efacil.png"
    width="200" height="200" aria-hidden="true" alt="">
  <img class="section-7__falling-item"
    src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/logo-efacil.png"
    width="200" height="200" aria-hidden="true" alt="">
  <img class="section-7__falling-item"
    src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/logo-efacil.png"
    width="200" height="200" aria-hidden="true" alt="">
  <img class="section-7__falling-item"
    src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/logo-efacil.png"
    width="200" height="200" aria-hidden="true" alt="">
  <!-- Imagem de fundo -->
  <img class="section-7__banner-image"
    src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao32.jpg"
    width="1600" height="865" alt="Produto em destaque — qualidade, praticidade e estilo no dia a dia">
  <!-- Overlay de texto -->
  <figcaption class="section-7__grouptext-overlay bottom">
    <p style="color: #ffffff;">Isso é uma descrição. Isso é uma descrição.</p>
    <h2 style="color: #ffffff;"><strong>SUB-TÍTULO</strong></h2>
    <p style="color: #ffffff;">Isso é uma descrição. Isso é uma descrição. Isso é uma descrição. Isso é umadescrição.
    </p>
  </figcaption>
</section>`,
    css: `<style>
  :root {
    --fall-duration: 5s;
    --fall-delay-range: 4s;
  }

  .section-7__wrapper {
    width: 100%;
    margin-inline: auto;
  }

  .section-7__banner {
    position: relative;
    width: 100%;
    overflow: hidden;
    margin: -1px;
  }

  .section-7__banner-image {
    width: 100%;
    height: auto;
    display: block;
  }

  .section-7__grouptext-overlay {
    position: absolute;
    max-width: 40%;
    width: 90%;
    line-height: 1.5;
    text-align: center;
    font-family: sans-serif
  }

  .section-7__grouptext-overlay.top {
    top: 3%;
    left: 50%;
    transform: translateX(-50%);
  }

  .section-7__grouptext-overlay.bottom {
    top: 84%;
    left: 50%;
    transform: translateX(-50%);
  }

  .section-7__grouptext-overlay.left {
    top: 50%;
    left: 25%;
    transform: translate(-50%, -50%);
    max-width: 41%;
  }

  .section-7__grouptext-overlay.right {
    top: 50%;
    left: 75%;
    transform: translate(-50%, -50%);
    max-width: 42%;
  }

  .section-7__grouptext-overlay h2 {
    font-size: 2vw;
    font-weight: bold;
    margin-bottom: 1.5px;
    line-height: 120%;
  }

  .section-7__grouptext-overlay p {
    font-size: 1.1vw;
    margin: 0;
    line-height: 120%;
  }

  @media (max-width: 960px) {
    .section-7__grouptext-overlay h2 {
      font-size: 2.1vw;
    }

    .section-7__grouptext-overlay p {
      font-size: 1.5vw;
    }
  }

  @media (max-width: 768px) {
    .section-7__grouptext-overlay h2 {
      font-size: 2.5vw;
    }

    .section-7__grouptext-overlay p {
      font-size: 1.8vw;
    }
  }

  @media (max-width: 500px) {
    .section-7__grouptext-overlay h2 {
      font-size: 3vw;
    }

    .section-7__grouptext-overlay p {
      font-size: 2.3vw;
    }
  }

  @media (max-width: 480px) {
    .section-7__grouptext-overlay h2 {
      font-size: 3vw;
    }

    .section-7__grouptext-overlay p {
      font-size: 2.3vw;
    }
  }

  @media (max-width: 1060px) {
    .section-7__grouptext-overlay.top {
      top: 3%;
    }
  }

  @media (max-width: 960px) {
    .section-7__grouptext-overlay.top {
      top: 3%;
    }
  }

  @media (max-width: 768px) {
    .section-7__grouptext-overlay.top {
      top: 3%;
    }
  }

  @media (max-width: 500px) {
    .section-7__grouptext-overlay.top {
      top: 3%;
    }
  }

  @media (max-width: 480px) {
    .section-7__grouptext-overlay.top {
      top: 3%;
    }
  }

  @media (max-width: 1060px) {
    .section-7__grouptext-overlay.bottom {
      top: 81%;
    }
  }

  @media (max-width: 960px) {
    .section-7__grouptext-overlay.bottom {
      top: 79%
    }
  }

  @media (max-width: 480px) {
    .section-7__grouptext-overlay.bottom {
      top: 81%
    }
  }

  @media (max-width: 768px) {
    .section-7__grouptext-overlay.bottom {
      top: 76%;
    }
  }

  @media (max-width: 500px) {
    .section-7__grouptext-overlay.bottom {
      top: 67%;
    }
  }

  @media (max-width: 480px) {

    .section-7__grouptext-overlay.right {
      top: 50%;
      left: 73%;
      transform: translate(-50%, -50%);
    }
  }

  @media (max-width: 480px) {

    .section-7__grouptext-overlay.left {
      top: 50%;
      left: 27%;
      transform: translate(-50%, -50%);
    }
  }

  .section-7__falling-item {
    position: absolute;
    top: -100px;
    width: 8vw;
    height: 8vw;
    opacity: 0;
    z-index: 10;
    transform-origin: center;
    animation: fall var(--fall-duration) infinite linear;
    pointer-events: none;
    user-select: none;
  }

  .section-7__falling-item:nth-child(1) {
    left: 10%;
    --start-rot: -30deg;
    --end-rot: 360deg;
    animation-delay: calc(var(--fall-delay-range) * var(--d1, 0.1));
  }

  .section-7__falling-item:nth-child(2) {
    left: 30%;
    --start-rot: 20deg;
    --end-rot: 360deg;
    animation-delay: calc(var(--fall-delay-range) * var(--d2, 0.7));
  }

  .section-7__falling-item:nth-child(3) {
    left: 50%;
    --start-rot: -45deg;
    --end-rot: 360deg;
    animation-delay: calc(var(--fall-delay-range) * var(--d3, 0.3));
  }

  .section-7__falling-item:nth-child(4) {
    left: 70%;
    --start-rot: 15deg;
    --end-rot: 360deg;
    animation-delay: calc(var(--fall-delay-range) * var(--d4, 0.5));
  }

  .section-7__falling-item:nth-child(5) {
    left: 90%;
    --start-rot: 45deg;
    --end-rot: 360deg;
    animation-delay: calc(var(--fall-delay-range) * var(--d5, 0.2));
  }

  @keyframes fall {
    0% {
      transform: translateY(-100px) rotate(var(--start-rot));
      opacity: 1;
    }

    90% {
      opacity: 1;
    }

    100% {
      transform: translateY(110vh) rotate(var(--end-rot));
      opacity: 0;
    }
  }
</style>`
  },


/*@@@@Senko - section-9 */
  /* variantes: variants/section-9.js */
  {
    id: 'section-9',
    name: 'Section-9',
    tags: ['Section 9', '9', 'grid'],
    html: `        <section class="section-9" aria-labelledby="section-9-title">
            <div class="section-9__header">
                <h2 class="section-9__title" id="section-9-title">Resolva suas dúvidas</h2>
                <p class="section-9__subtitle">Saiba por que o Dove Hialuron-Vit é o favorito para o uso diário</p>
            </div>
            <ul class="section-9__list">
                <li class="section-9__item">
                    <details class="section-9__item">
                        <summary>
                            <span class="section-9__q-text">O ácido hialurônico serve para o meu cabelo?</span>
                            <span class="section-9__icon" aria-hidden="true"></span>
                        </summary>
                        <div class="section-9__a-inner">
                            <p class="section-9__a-text">Sim. Ele funciona em todos os tipos de fios, agindo como um imã de hidratação para cabelos ressecados e sem brilho.</p>
                        </div>
                    </details>
                </li>
                <li class="section-9__item">
                    <details class="section-9__item">
                        <summary>
                            <span class="section-9__q-text">Ele deixa o cabelo pesado ou oleoso?</span>
                            <span class="section-9__icon" aria-hidden="true"></span>
                        </summary>
                        <div class="section-9__a-inner">
                            <p class="section-9__a-text">Não. A fórmula é leve e garante fios 100% mais macios, mantendo o movimento natural sem pesar.</p>
                        </div>
                    </details>
                </li>
                <li class="section-9__item">
                    <details class="section-9__item">
                        <summary>
                            <span class="section-9__q-text">Posso usar todos os dias?</span>
                            <span class="section-9__icon" aria-hidden="true"></span>
                        </summary>
                        <div class="section-9__a-inner">
                            <p class="section-9__a-text">Sim. Ele é dermatologicamente testado e ideal para uso diário, proporcionando hidratação contínua.</p>
                        </div>
                    </details>
                </li>
                <li class="section-9__item">
                    <details class="section-9__item">
                        <summary>
                            <span class="section-9__q-text">Onde ele entra no meu Cronograma Capilar?</span>
                            <span class="section-9__icon" aria-hidden="true"></span>
                        </summary>
                        <div class="section-9__a-inner">
                            <p class="section-9__a-text">Ele é o aliado perfeito para a etapa de Hidratação, retendo a umidade e combatendo o ressecamento.</p>
                        </div>
                    </details>
                </li>
                <li class="section-9__item">
                    <details class="section-9__item">
                        <summary>
                            <span class="section-9__q-text">Cabelo com química ou tintura pode usar?</span>
                            <span class="section-9__icon" aria-hidden="true"></span>
                        </summary>
                        <div class="section-9__a-inner">
                            <p class="section-9__a-text">Com certeza. Ele ajuda a recuperar a maciez e o brilho que os fios perdem durante processos químicos.</p>
                        </div>
                    </details>
                </li>
            </ul>
        </section>`,
    css: ` <style>
        .section-9 {
            width: 100%;
            padding: 2rem 16px;
            box-sizing: border-box;
            margin: 0 auto 25px;
            padding-top: 0;
            font-family: sans-serif;
        }

        .section-9__header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .section-9__title {
            font-size: clamp(1.5rem, 3vw, 2rem);
            font-weight: bold;
            color: #333;
            margin: 0 0 12px;
            line-height: 98%;
        }

        .section-9__subtitle {
            font-size: 1rem;
            color: #666;
            margin: 0;
        }

        .section-9__list {
            list-style: none;
            margin: 0 auto;
            padding: 0;
            max-width: 56rem;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .section-9__item {
            background: #fff;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            overflow: hidden;
        }

        .section-9__item summary {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 16px 20px;
            cursor: pointer;
            list-style: none;
        }

        .section-9__item summary::-webkit-details-marker {
            display: none;
        }

        .section-9__item summary:hover {
            background: #f9f9f9;
        }

        .section-9__q-text {
            font-size: 1rem;
            font-weight: bold;
            color: #333;
            flex: 1;
        }

          .section-9__q-text:hover {
            color: #ea5b0c;
        }

        .section-9__icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
            position: relative;
        }

        .section-9__icon::before,
        .section-9__icon::after {
            content: '';
            position: absolute;
            background: #888;
            border-radius: 2px;
            transition: transform 0.25s ease, opacity 0.25s ease;
        }

        .section-9__icon::before {
            width: 12px;
            height: 1.5px;
            top: 9px;
            left: 4px;
        }

        .section-9__icon::after {
            width: 1.5px;
            height: 12px;
            top: 4px;
            left: 9px;
        }

        .section-9__item[open] .section-9__icon::after {
            transform: rotate(90deg);
            opacity: 0;
        }

        .section-9__a-inner {
            padding: 14px 20px 16px;
            border-top: 1px solid #e5e5e5;
        }

        .section-9__a-text {
            font-size: 0.9rem;
            color: #555;
            line-height: 1.6;
            margin: 0;
        }

        @media (max-width: 480px) {
            .section-9__q-text {
                font-size: 0.9rem;
            }
        }
    </style>`
  },


/*@@@@Senko - section-8 */
  /* variantes: variants/section-8.js */
  {
    id: 'section-8',
    name: 'Section-8',
    tags: ['section 8', '8', 'split'],
    html: `    <section class="wrapper-section-8" aria-labelledby="section-8-title">
      <div class="text-col-section-8">
        <img src="https://cdn-icons-png.flaticon.com/512/894/894565.png" class="brand-icon-section-8"
          alt="Imagem representativa" width="60" height="60" loading="lazy" />
        <h2 id="section-8-title" class="title-section-8">
          A Lenda dos Sete Mares
        </h2>
        <p class="desc-section-8">
          Capitan Cortez não é apenas um rum, é um convite à descoberta. Inspirado
          nos diários de bordo dos grandes navegadores, nossa receita busca capturar
          a glória da tradição em cada garrafa. Uma homenagem àqueles que ousam ir
          além do horizonte.
        </p>
      </div>
      <!-- Imagem Principal-->
      <div class="image-col-section-8">
        <img src="C:UsersygorqDownloadscabo-flexivel-corfio-1-5mm-bobina-vermelho-4203788-01.jpg"
          class="bg-image-section-8" alt="Imagem representativa" width="800" height="600" loading="lazy" />
      </div>
    </section>`,
    css: `  <style>
    /* ===== Section-8 ===== */
    .wrapper-section-8 {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      background-color: #f8f8f8;
      min-height: 28rem;
    }

    .text-col-section-8 {
      flex: 1 1 18.75rem;
      padding: 2.5rem 1.25rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      gap: 1.25rem;
    }

    .image-col-section-8 {
      flex: 1 1 18.75rem;
      position: relative;
    }

    .brand-icon-section-8 {
      width: 3.75rem;
      height: auto;
      opacity: 0.8;
      display: block;
    }

    .title-section-8 {
      font-size: clamp(22px, 3.2vw, 38px);
      font-weight: 700;
      line-height: 1.2;
      text-align: center;
    }

    .desc-section-8 {
      font-size: clamp(14px, 1.4vw, 22px);
      color: #1b1b1b;
      line-height: 28px;
    }






    @media (max-width: 1060px) {

      .title-section-8 h1 {
        font-size: 3.8vw;
      }

      .desc-section-8 {
        font-size: 1.8vw;
      }
    }

    @media (max-width: 960px) {

      .title-section-8 h1 {
        font-size: 4.3vw;
      }

      .desc-section-8 {
        font-size: 2vw;
      }

    }

    @media (max-width: 730px) {

      .title-section-8 h1 {
        font-size: 5vw;
      }

      .desc-section-8 {
        font-size: 2.9vw;
      }
    }

    @media (max-width: 500px) {
      .title-section-8 h1 {
        font-size: 6vw;
      }

      .desc-section-8 {
        font-size: 3.5vw;
      }

    }

    @media (max-width: 420px) {
      .title-section-8 h1 {
        font-size: 7vw;
      }

      .desc-section-8 {
        font-size: 4vw;
      }
    }




    .arrow-icon-section-8 {
      font-size: 1rem;
      line-height: 1;
      display: inline-block;
      transition: transform 0.3s;
    }

    .cta-link-section-8:hover .arrow-icon-section-8 {
      transform: translateX(4px);
    }

    .bg-image-section-8 {
      width: 95%;
      height: 95%;
      margin: 0.5rem;
      border-radius: 15px;
      object-fit: cover;
      display: block;
      min-height: 18.75rem;
    }

    @media (min-width: 768px) {
      .text-col-section-8 {
        padding: 1.5rem 1.25rem 0.7rem;
      }

      .reverse-desktop-section-8 {
        flex-direction: row-reverse;
      }
    }

    @media (max-width: 720px) {
      .wrapper-section-8 {
        flex-direction: column-reverse;
      }

      .reverse-mobile-section-8 {
        flex-direction: column;
      }

      .bg-image-section-8 {
        width: 90%;
        height: 100%;
        object-fit: cover;
        display: block;
        min-height: 18.75rem;
        max-width: 95%;
        margin: 0.6rem auto;
        border-radius: 10px;
        aspect-ratio: 26 / 17;
      }
    }
  </style>`
  },




/*@@@@Senko - section-100 */
  /* variantes: variants/section-100.js */
  {
    id: 'section-100',
    name: 'section-100',
    tags: ['section-100'],
    html: `        <div class="pdp-row-product">
            <div class="pdp-row-product-content">
                <h3 class="pdp-product-title tw-text-2xl">
                    A garantia de que o que está por trás das paredes nunca será um problema
                </h3>
                <p class="pdp-product-description">
                    Ao escolher um condutor que une a máxima segurança contra incêndios, a eficiência energética para seus equipamentos de alta potência e a flexibilidade necessária para uma instalação ágil, você garante a proteção do seu patrimônio e a tranquilidade de saber que sua estrutura elétrica foi feita para durar uma vida inteira, sem surpresas na conta de luz ou a necessidade de reformas precoces
                </p>
            </div>
            <img src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao4.jpg" alt="Eletricista com capacete branco e colete laranja em obra garantindo qualidade e segurança Corfio" class="pdp-row-product-image" />
        </div>`,
    css: `    <style>
        .pdp-row-product {
            margin-left: auto;
            margin-right: auto;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
            width: 100%
        }

        .tw-text-2xl {
            font-size: 32px;
            font-weight: 600;
            line-height: 40px
        }

        .pdp-product-title {
            --tw-text-opacity: 1;
            color: rgb(0 0 0/var(--tw-text-opacity));
            max-width: 56rem;
            text-align: center
        }

        .tw-text-lg {
            font-size: 20px;
            font-weight: 700;
            line-height: 28px
        }

        .pdp-product-description {
            --tw-text-opacity: 1;
            color: rgb(138 138 138/var(--tw-text-opacity));
            font-size: 14px;
            line-height: 22px;
            margin-top: 1rem;
            max-width: 56rem;
            text-align: center
        }

        @media (min-width:576px) {
            .pdp-row-product {
                max-width: 576px
            }

            .tw-text-2xl {
                font-size: 32px;
            }
        }

        @media (min-width:768px) {
            .pdp-row-product {
                max-width: 768px
            }

            .tw-text-2xl {
                font-size: 32px;
            }

        }



        @media (min-width:992px) {
            .pdp-row-product {
                max-width: 992px
            }

            .tw-text-2xl {
                font-size: 32px;
            }
        }

        @media (min-width:1200px) {
            .pdp-row-product {
                max-width: 1200px
            }

            .tw-text-2xl {
                font-size: 32px;
            }
        }

        @media (min-width:1536px) {
            .pdp-row-product {
                max-width: 1536px
            }

            .tw-text-2xl {
                font-size: 32px;
            }
        }

        .pdp-row-product {
            align-items: center;
            display: flex;
            gap: 1.5rem;
            justify-content: space-between;
            margin-top: 2rem
        }

        .reverse-row-product {
            flex-direction: row-reverse;
        }

        @media not all and (min-width:992px) {
            .pdp-row-product {
                flex-direction: column-reverse
            }
        }

        @media (min-width:992px) {
            .pdp-row-product {
                gap: 6rem
            }
        }

        .pdp-row-product-image {
            max-width: 30rem;
            object-fit: contain;
            width: 100%;
            border-radius: 20px;
        }

        .pdp-row-product-content {
            display: flex;
            flex-direction: column;
            max-width: 28rem;
            width: 100%
        }

        .pdp-row-product-content * {
            text-align: left
        }

        @media (min-width:992px) {
            .pdp-row-product.is-reverse .pdp-row-product-image {
                order: 1
            }

            .pdp-row-product.is-reverse .pdp-row-product-content {
                order: 2
            }
        }

        .pdp-row-product-content {
            display: flex;
            flex-direction: column;
            max-width: 28rem;
            width: 100%
        }

        .pdp-row-product-content * {
            text-align: left
        }

        @media (min-width:992px) {
            .pdp-row-product.is-reverse .pdp-row-product-image {
                order: 1
            }

            .pdp-row-product.is-reverse .pdp-row-product-content {
                order: 2
            }
        }

        @media (max-width:768px) {
            .pdp-row-product-image {
                width: 100%;
                aspect-ratio: 9 / 6;
                object-fit: cover;
            }
        }
    </style>`
  },


/*@@@@Senko - section-11 */
  /* variantes: variants/section-11.js */
  {
    id: 'section-11',
    name: 'Section-11',
    tags: ['Section 11', '11', 'grid'],
    html: `        <section class="section-11" aria-labelledby="section-11-title">
            <div class="section-11-container">
                <header class="section-11__header">
                    <h2 class="section-11__title" id="section-11-title">Diferenciais que garantem uma instalação superior</h2>
                </header>
                <ul class="section-11__grid" role="list">
                    <li class="section-11__item">
                        <figure class="section-11__figure">
                            <img class="section-11__image" src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/corfio/4203786_03-1.png" alt="Ícone de formato universitário"
                                width="74" height="74" loading="lazy">
                        </figure>
                        <h3 class="section-11__name">Flexibilidade Classe 4/5</h3>
                        <p class="section-11__value">Cobre de têmpera mole que desliza facilmente pelos eletrodutos, economizando tempo e esforço na instalação</p>
                    </li>
                </ul>
            </div>
        </section>`,
    css: `    <style>
        .section-11-container {
            padding-bottom: 3rem;
            padding-left: 1rem;
            padding-right: 1rem;
        }

        @media (min-width: 576px) {
            .section-11-container {
                max-width: 576px;
                margin-inline: auto;
            }
        }

        @media (min-width: 768px) {
            .section-11-container {
                max-width: 768px;
            }
        }

        @media (min-width: 992px) {
            .section-11-container {
                max-width: 992px;
            }
        }

        @media (min-width: 1200px) {
            .section-11-container {
                max-width: 1200px;
            }
        }

        @media (min-width: 1536px) {
            .section-11-container {
                max-width: 1536px;
            }
        }

        .section-11__header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .section-11__title {
            font-size: 32px;
            font-weight: 900;
            color: #1a1a1a;
            margin: 0;
            line-height: 1.25;
        }

        .section-11__grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1rem;
            list-style: none;
            margin: 0;
            padding: 0;
        }

        @media (min-width: 768px) {
            .section-11__grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }
        }

        @media (min-width: 992px) {
            .section-11__grid {
                grid-template-columns: repeat(5, minmax(0, 1fr));
            }
        }

        .section-11__item {
            background: #fff;
            border: 0.5px solid rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            padding: 1.5rem 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0.75rem;
            transition: border-color 0.2s;
        }

        .section-11__item:hover {
            border-color: rgba(0, 0, 0, 0.22);
        }

        .section-11__figure {
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 72px;
            height: 72px;
        }

        .section-11__image {
            width: 4.6rem;
            height: auto;
            display: block;
        }

        .section-11__name {
            font-size: 0.9375rem;
            font-weight: 500;
            color: #1a1a1a;
            margin: 0;
            line-height: 1.3;
        }

        .section-11__value {
            font-size: 0.875rem;
            color: #666;
            margin: 0;
            line-height: 1.4;
        }
    </style>`
  },


/*@@@@Senko - section-12 */
  /* variantes: variants/section-12.js */
  {
    id: 'section-12',
    name: 'Section-12',
    tags: ['Section-12', '12', 'full width', 'slide'],
    html: `    <section class="section-12-container">
      <figure class="section-12 section-12--minimal" aria-label="Comparador antes e depois minimalista">
        <div class="section-12__wrapper" role="img" aria-label="Animação comparando antes e depois">
          <img class="section-12__image-after"
            src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/philco/smart-tv-philco-4k-uhd-tecnologia-hdr10-otimizada-01577-22-11928-10.png"
            alt="Tecnologia HDR10 e 4K UHD em Smart TV Philco proporcionando brilho e nitidez superior" loading="lazy"
            decoding="async" />
          <img class="section-12__image-before"
            src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/philco/smart-tv-philco-4k-uhd-qualidade-imagem-padrao-01577-22-11928-09.png"
            alt="Comparativo de qualidade imagem normal em Smart TV Philco exibindo paisagem de aurora boreal"
            loading="lazy" decoding="async" />
          <div class="section-12__divider"></div>
        </div>
        <figcaption style="text-align: center; margin-top: 10px; color: #444;">Tecnologia SDR para HDR: Cores mais vivas
          e pretos mais profundos</figcaption>
      </figure>
    </section>`,
    css: `  <style>
    .section-12-container {
      padding-top: 1rem;
      padding-bottom: 0;
      border-radius: 12px;
    }

    .section-12 {
      width: 95%;
      margin-left: auto;
      margin-right: auto;
    }

    .section-12__wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .section-12__image-after {
      display: block;
      width: 100%;
      height: auto;
      border-radius: 12px;
    }

    .section-12__image-before {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      clip-path: inset(0 50% 0 0);
      animation: s12-reveal 4s ease-in-out infinite alternate;
      border-radius: 12px;
    }

    .section-12__divider {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 3px;
      background-color: #fff;
      transform: translateX(-50%);
      animation: s12-line 4s ease-in-out infinite alternate;
    }

    .section-12__handle {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
      animation: s12-line 4s ease-in-out infinite alternate;
    }

    .section-12__handle-arrows {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .section-12__arrow--left {
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-right: 8px solid #333;
    }

    .section-12__arrow--right {
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-left: 8px solid #333;
    }

    @keyframes s12-reveal {
      0% {
        clip-path: inset(0 90% 0 0);
      }

      100% {
        clip-path: inset(0 10% 0 0);
      }
    }

    @keyframes s12-line {
      0% {
        left: 10%;
      }

      100% {
        left: 90%;
      }
    }

    /* Variação: sem handle */
    .section-12--minimal .section-12__handle {
      display: none;
    }

    @media (min-width: 768px) {
      .section-12 {
        max-width: 768px;
      }
    }

    @media (min-width: 992px) {
      .section-12 {
        max-width: 992px;
      }
    }

    @media (min-width: 1200px) {
      .section-12 {
        max-width: 1200px;
      }
    }

    @media (min-width: 1536px) {
      .section-12 {
        max-width: unset;
      }
    }
  </style>`
  },


/*@@@@Senko - section-13 */
  /* variantes: variants/section-13.js */
  {
    id: 'section-13',
    name: 'Section-13',
    tags: ['13', 'celular', 'section-13'],
    html: `    <div class="section-13-container">
      <section class="section-13" aria-label="Demonstração em vídeo do produto">
        <figure class="section-13__phone-wrap">
          <div class="section-13__phone" role="img" aria-label="Celular exibindo vídeo do produto">
            <div class="section-13__notch" aria-hidden="true"></div>
            <!-- Tela -->
            <div class="section-13__screen">
              <video class="section-13__video" src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/risque/Lollapalooza.mov" autoplay muted loop playsinline
                aria-label="Demonstração em vídeo do produto"></video>
            </div>
          </div>
          <figcaption class="section-13__caption">
            <p class="section-13__caption-title">Veja em ação</p>
            <p class="section-13__caption-desc">Acompanhe como o produto funciona na prática em um vídeo demonstrativo.
            </p>
          </figcaption>
        </figure>
      </section>
    </div>`,
    css: `  <style>
    /* ── CONTAINER UNIVERSAL ─────────────────────────── */
    .section-13-container {
      padding-top: 20px;
      padding-bottom: 20px;
    }

    @media (min-width: 768px) {
      .section-13-container {
        padding-top: 28px;
        padding-bottom: 28px;
      }
    }

    @media (min-width: 1200px) {
      .section-13-container {
        padding-top: 25px;
        padding-bottom: 25px;
      }
    }

    /* ── SECTION BASE ────────────────────────────────── */
    .section-13 {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
    }

    /* ── PHONE WRAPPER ───────────────────────────────── */
    .section-13__phone-wrap {
      position: relative;
      width: 220px;
      flex-shrink: 0;
    }

    @media (min-width: 576px) {
      .section-13__phone-wrap {
        width: 260px;
      }
    }

    @media (min-width: 768px) {
      .section-13__phone-wrap {
        width: 300px;
      }
    }

    @media (min-width: 992px) {
      .section-13__phone-wrap {
        width: 340px;
      }
    }

    /* ── PHONE FRAME ─────────────────────────────────── */
    .section-13__phone {
      position: relative;
      width: 100%;
      aspect-ratio: 9 / 19.5;
      background: #0d0d0d;
      border-radius: 40px;
      box-shadow: 0 0 0 2px #2a2a2a, 0 0 0 4px #111, 0 0 0 6px #3a3a3a, 0 0 15px 1px rgb(0 0 0 / 29%), inset 0 0 0 1px rgba(255, 255, 255, 0.06);
      overflow: hidden;
    }

    /* Brilho lateral esquerdo */
    .section-13__phone::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(115deg,
          rgba(255, 255, 255, 0.08) 0%,
          transparent 40%);
      border-radius: inherit;
      z-index: 3;
      pointer-events: none;
    }

    /* ── NOTCH / DYNAMIC ISLAND ──────────────────────── */
    .section-13__notch {
      position: absolute;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      width: 28%;
      height: 22px;
      background: #0d0d0d;
      border-radius: 20px;
      z-index: 4;
    }

    /* ── SCREEN ──────────────────────────────────────── */
    .section-13__screen {
      position: absolute;
      inset: 0;
      border-radius: 38px;
      overflow: hidden;
      z-index: 2;
    }

    /* ── VIDEO ───────────────────────────────────────── */
    .section-13__video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* ── GLOW AMBIENTAL ──────────────────────────────── */
    .section-13__glow {
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 60px;
      background: radial-gradient(ellipse at center, rgba(80, 140, 255, 0.25) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      filter: blur(8px);
    }

    /* ── CAPTION ─────────────────────────────────────── */
    .section-13__caption {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 1.1rem;
    }

    .section-13__caption-title {
      font-family: sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #111;
      letter-spacing: 0.02em;
    }

    .section-13__caption-desc {
      font-family: sans-serif;
      font-size: 13px;
      color: #666;
      line-height: 1.5;
      max-width: 280px;
    }

    @media (min-width: 768px) {
      .section-13__caption-title {
        font-size: 15px;
      }

      .section-13__caption-desc {
        font-size: 14px;
        max-width: 320px;
      }
    }
  </style>`
  },


/*@@@@Senko - section-14 */
  /* variantes: variants/section-14.js */
  {
    id: 'section-14',
    name: 'Section-14',
    tags: ['Section-14', '14'],
    html: `<div class="section-14-container">
  <section class="section-14" aria-labelledby="section14-title">

    <header class="section-14__header">
      <h3 class="section-14__title" id="section14-title">SUB-TÍTULO</h3>
      <p class="section-14__description">
        Isso é uma descrição. Isso é uma descrição. Isso é uma descrição.
        Isso é uma descrição. Isso é uma descrição. Isso é uma descrição.
        Isso é uma descrição. Isso é uma descrição. Isso é uma descrição.
      </p>
    </header>

    <div class="section-14__body">

      <div class="section-14__column section-14__column--left">
        <article class="section-14__feature">
          <img
            class="section-14__icon"
            src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/check2.png"
            width="56" height="56"
            alt="Ícone de confirmação representando a característica 1"
          >
          <h4 class="section-14__feature-title">Característica 1</h4>
          <p class="section-14__feature-text">Isso é uma descrição. Isso é uma descrição. Isso é uma descrição.</p>
        </article>

        <article class="section-14__feature">
          <img
            class="section-14__icon"
            src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/check2.png"
            width="56" height="56"
            alt="Ícone de confirmação representando a característica 2"
          >
          <h4 class="section-14__feature-title">Característica 2</h4>
          <p class="section-14__feature-text">Isso é uma descrição. Isso é uma descrição. Isso é uma descrição.</p>
        </article>
      </div>

      <figure class="section-14__image-wrap">
        <img
          class="section-14__image"
          src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao4.jpg"
          width="780" height="740"
          alt="Produto em destaque demonstrando suas principais características de uso no dia a dia"
        >
      </figure>

      <div class="section-14__column section-14__column--right">
        <article class="section-14__feature">
          <img
            class="section-14__icon"
            src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/check2.png"
            width="56" height="56"
            alt="Ícone de confirmação representando a característica 3"
          >
          <h4 class="section-14__feature-title">Característica 3</h4>
          <p class="section-14__feature-text">Isso é uma descrição. Isso é uma descrição. Isso é uma descrição.</p>
        </article>

        <article class="section-14__feature">
          <img
            class="section-14__icon"
            src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/check2.png"
            width="56" height="56"
            alt="Ícone de confirmação representando a característica 4"
          >
          <h4 class="section-14__feature-title">Característica 4</h4>
          <p class="section-14__feature-text">Isso é uma descrição. Isso é uma descrição. Isso é uma descrição.</p>
        </article>
      </div>

    </div>
  </section>
</div>`,
    css: `<style>
  /* ── CONTAINER UNIVERSAL ── */
  .section-14-container {
    padding-top: 1.2rem;
    padding-bottom: 1.2rem;
  }

  @media (min-width: 768px) {
    .section-14-container {
      max-width: 768px;
      margin-inline: auto;
    }
  }

  @media (min-width: 992px) {
    .section-14-container {
      max-width: 992px;
    }
  }

  @media (min-width: 1200px) {
    .section-14-container {
      max-width: 1200px;
    }
  }

  @media (min-width: 1536px) {
    .section-14-container {
      max-width: 1536px;
    }
  }

  /* ── HEADER ── */
  .section-14__header {
    text-align: center;
    margin-bottom: 40px;
    padding-inline: 16px;
  }

  .section-14__title {
    font-size: 2rem;
    font-weight: 900;
    color: #111;
    margin: 0 0 16px;
    line-height: 1.1;
  }

  .section-14__description {
    font-size: 0.9375rem;
    color: #555;
    max-width: 700px;
    margin-inline: auto;
    line-height: 1.6;
  }

  /* ── BODY: mobile — coluna única ── */
  .section-14__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding-inline: 16px;
  }

  /* ── FEATURE BLOCK ── */
  .section-14__feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 15px 16px;
  }

  .section-14__icon {
    width: 32px;
    height: 32px;
    border-radius: 12px;
    margin-bottom: 12px;
    padding: 10px;
    background: #ff9100;
    flex-shrink: 0;
  }

  .section-14__feature-title {
    font-size: 1rem;
    font-weight: 700;
    color: #111;
    margin: 0 0 8px;
  }

  .section-14__feature-text {
    font-size: 0.875rem;
    color: #666;
    line-height: 1.5;
    margin: 0;
  }

  /* ── IMAGEM CENTRAL ── */
  .section-14__image-wrap {
    width: 100%;
  }

  .section-14__image {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
    
  }

  /* ── COLUNA DE FEATURES ── */
  .section-14__column {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  /* ─────────────────────────────────────────────────
      @media 768px — imagem central com features
      sobrepostas nas bordas (layout imagem 2)
  ───────────────────────────────────────────────── */
  @media (min-width: 768px) {
    .section-14__body {
      position: relative;
      flex-direction: row;
      align-items: stretch;
      padding-inline: 0;
    }

    .section-14__column {
      width: auto;
      flex: 0 0 220px;
      justify-content: space-around;
      z-index: 2;
    }

    .section-14__column--left {
      align-items: flex-start;
    }

    .section-14__column--right {
      align-items: flex-end;
    }

    .section-14__image-wrap {
      flex: 1;
      min-width: 0;
      position: relative;
    }

    .section-14__image {
      height: 100%;
      border-radius: 16px;
      object-fit: cover;
    }

    .section-14__feature {
      align-items: flex-start;
      text-align: left;
      padding: 12px 16px;
    }

    .section-14__column--right .section-14__feature {
      align-items: flex-end;
      text-align: right;
    }
  }

  @media (max-width: 767px) {
    .section-14__image {
        object-fit: cover;
        width: 88%;
        aspect-ratio: 9 / 6;
        margin: auto;
        border-radius: 20px;
    }
}

  /* ─────────────────────────────────────────────────
      @media 1200px — 3 colunas separadas (layout imagem 3):
      col-esq | imagem | col-dir, sem sobreposição
  ───────────────────────────────────────────────── */
  @media (min-width: 1200px) {
    .section-14__body {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 48px;
    }

    .section-14__column {
      width: 90%;
        margin: auto;
        gap: 58px;
        justify-content: flex-start;
    }

    .section-14__column--left {
      align-items: flex-start;
    }

    .section-14__column--right {
      align-items: flex-end;
    }

    .section-14__image-wrap {
      flex: unset;
      width: 420px;
    }

    .section-14__image {
      height: auto;
      border-radius: 4px;
      border-radius: 18px;
    }

    .section-14__feature {
      padding: 0;
    }
  }
</style>`
  },

]);
