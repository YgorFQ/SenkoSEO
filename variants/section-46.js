// @ts-nocheck
SenkoLib.registerVariant('section-46', [
/*@@@@Senko - variavel-1 */
  {
    name: 'variavel-1',
    html: `  <div class="section-46-y reverse-46">

    <!-- IMAGEM -->
    <div class="section-46-y-img">
      <img
        src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao4.jpg"
        alt="Imagem representativa do produto">
    </div>

    <!-- CONTEÚDO -->
    <div class="section-46-y-content">

      <!-- Título padrão -->
      <h2>
        Isso é um título. <br> Isso é um título.
      </h2>

      <!-- Descrição padrão -->
      <p class="section-46-y-desc">
        Isso é uma descrição gamer. Isso é uma descrição gamer.
      </p>

      <!-- Box com ícone (invertido) -->
      <div class="section-46-y-box reverse-icon-46">
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

      <!-- Box com ícone (normal) -->
      <div class="section-46-y-box">
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

      <!-- LISTA 1 — Bullet padrão -->
      <ul class="section-46-y-list">
        <li>Item de lista padrão um</li>
        <li>Item de lista padrão dois</li>
        <li>Item de lista padrão três</li>
      </ul>

      <!-- LISTA 2 — Marcador customizado (troque o símbolo em data-marker) -->
      <ul class="section-46-y-list" data-marker="✓">
        <li>Item com check um</li>
        <li>Item com check dois</li>
        <li>Item com check três</li>
      </ul>

      <!-- LISTA 3 — Numerada -->
      <ol class="section-46-y-list list-numbered-46">
        <li>Primeiro item numerado</li>
        <li>Segundo item numerado</li>
        <li>Terceiro item numerado</li>
      </ol>

      <!-- LISTA 4 — Com divisória -->
      <ul class="section-46-y-list list-divided-46">
        <li>Item com divisória um</li>
        <li>Item com divisória dois</li>
        <li>Item com divisória três</li>
      </ul>

      <!-- LISTA 5 — Com ícone img -->
      <ul class="section-46-y-list list-icon-46">
        <li>
          <img src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao47.jpg" alt="">
          Item com ícone um
        </li>
        <li>
          <img src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao47.jpg" alt="">
          Item com ícone dois
        </li>
        <li>
          <img src="https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/EQUIPE_QUALIDADE_CONTEUDO/sessao47.jpg" alt="">
          Item com ícone três
        </li>
      </ul>

    </div>
  </div>`,
    css: `  <style>

    /* ===== CONTAINER PRINCIPAL ===== */
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

    /* ===== BOX COM ÍCONE ===== */
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

    /* ===== LISTAS ===== */
    .section-46-y-list {
      list-style: none;
      padding: 0;
      margin: 0 0 25px;
    }

    .section-46-y-list li {
      font-family: sans-serif;
      font-size: clamp(14px, 1.4vw, 24px);
      color: #1b1b1b;
      line-height: 1.6;
      padding: 6px 0 6px 28px;
      position: relative;
    }

    .section-46-y-list li::before {
      content: '•';
      position: absolute;
      left: 8px;
      color: #1b1b1b;
    }

    /* Marcador customizado via data-marker */
    .section-46-y-list[data-marker] li::before {
      content: attr(data-marker);
    }

    /* Lista numerada */
    .section-46-y-list.list-numbered-46 {
      counter-reset: list46;
    }

    .section-46-y-list.list-numbered-46 li {
      counter-increment: list46;
    }

    .section-46-y-list.list-numbered-46 li::before {
      content: counter(list46) '.';
      font-weight: 700;
      color: inherit;
    }

    /* Lista com divisória */
    .section-46-y-list.list-divided-46 li {
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 10px;
      margin-bottom: 4px;
    }

    .section-46-y-list.list-divided-46 li:last-child {
      border-bottom: none;
    }

    /* Lista com ícone img */
    .section-46-y-list.list-icon-46 li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding-left: 0;
    }

    .section-46-y-list.list-icon-46 li::before {
      display: none;
    }

    .section-46-y-list.list-icon-46 li img {
      width: 20px;
      height: 20px;
      object-fit: contain;
      flex-shrink: 0;
      margin-top: 3px;
    }

    /* ===== BREAKPOINTS ===== */

    @media (max-width: 1060px) {
      .section-46-y-content h1 { font-size: 3.8vw; }
      .section-46-y-desc { font-size: 1.8vw; line-height: 1.5; }
      .section-46-y-box-text h3 { font-size: 2.4vw; }
      .section-46-y-box-text p { font-size: 1.8vw; }
      .section-46-y-list li { font-size: 1.8vw; }
    }

    @media (max-width: 960px) {
      .section-46-y-content h1 { font-size: 4.3vw; }
      .section-46-y-desc { font-size: 2vw; }
      .section-46-y-box-text h3 { font-size: 2.7vw; }
      .section-46-y-box-text p { font-size: 2.3vw; }
      .section-46-y-list li { font-size: 2vw; }
    }

    @media (max-width: 800px) {
      .section-46-y,
      .section-46-y.reverse-46 {
        flex-direction: column !important;
      }

      .section-46-y-img {
        width: 81%;
      }

      .section-46-y-box,
      .section-46-y-box.reverse-icon-46 {
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

      .section-46-y-list li {
        font-size: 2.2vw;
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

      .section-46-y-content h1 { font-size: 5vw; }
      .section-46-y-desc { font-size: 2.7vw; }
      .section-46-y-box-text h3 { font-size: 3.3vw; }

      .section-46-y-box-text p {
        font-size: 2.5vw;
        text-align: left;
      }

      .section-46-y-list li {
        font-size: 2.5vw;
        text-align: left;
      }
    }

    @media (max-width: 500px) {
      .section-46-y-content h1 { font-size: 6vw; }
      .section-46-y-desc { font-size: 3.5vw; }
      .section-46-y-box-text h3 { font-size: 4vw; line-height: 1.1; }

      .section-46-y-box-text p {
        font-size: 3.3vw;
        line-height: 1.1;
        text-align: left;
      }

      .section-46-y-list li {
        font-size: 3.3vw;
        line-height: 1.5;
        text-align: left;
      }
    }

    @media (max-width: 420px) {
      .section-46-y-content h1 { font-size: 7vw; }
      .section-46-y-desc { font-size: 4vw; }
      .section-46-y-box-text h3 { font-size: 5vw; line-height: 1.1; }

      .section-46-y-box-text p {
        font-size: 3.8vw;
        line-height: 1.1;
        text-align: left;
      }

      .section-46-y-list li {
        font-size: 3.8vw;
        line-height: 1.5;
        text-align: left;
      }
    }

    /* ===== VARIANTES DE DIREÇÃO ===== */
    .section-46-y.reverse-46 {
      flex-direction: row-reverse;
    }

    .section-46-y-box.reverse-icon-46 {
      flex-direction: row-reverse;
      text-align: right;
    }

  </style>`,
  },
]);
