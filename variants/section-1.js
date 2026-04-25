/*
 * Variantes de section-1
 * Responsabilidade: registrar variantes demonstrativas para o layout Section 1.
 * Dependencias: core/senkolib-core.js.
 * Expoe: registros via SenkoLib.registerVariant().
 */
SenkoLib.registerVariant('section-1', [
  /*@@@@Senko - teste1 */
  {
    name: 'teste1',
    html: `<section class="variant-one">
  <div>
    <span>Teste 1</span>
    <h1>Banner com foco em lançamento</h1>
    <p>Use esta variação para campanhas com chamada direta.</p>
  </div>
</section>`,
    css: `.variant-one {
  display: grid;
  min-height: 500px;
  place-items: center;
  padding: 48px 24px;
  background: #111;
  color: #fff;
  font-family: Arial, sans-serif;
}
.variant-one div { width: min(900px, 100%); }
.variant-one span { color: #e36a00; font-weight: 800; text-transform: uppercase; }
.variant-one h1 { margin: 12px 0; font-size: 64px; line-height: .95; }
.variant-one p { max-width: 520px; color: rgba(255,255,255,.7); font-size: 18px; }`
  },
  /*@@@@Senko - teste2 */
  {
    name: 'teste2',
    html: `<section class="variant-two">
  <article>
    <p>Teste 2</p>
    <h1>Uma vitrine limpa para destacar benefícios</h1>
  </article>
</section>`,
    css: `.variant-two {
  display: grid;
  min-height: 500px;
  place-items: center;
  padding: 48px 24px;
  background: #f6f6f6;
  color: #121212;
  font-family: Arial, sans-serif;
}
.variant-two article { width: min(820px, 100%); border-left: 8px solid #e36a00; padding-left: 28px; }
.variant-two p { color: #e36a00; font-weight: 800; text-transform: uppercase; }
.variant-two h1 { margin: 0; font-size: 58px; line-height: 1; }`
  },
  /*@@@@Senko - teste3 */
  {
    name: 'teste3',
    html: `<section class="variant-three">
  <div class="variant-three__panel">
    <strong>Teste 3</strong>
    <h1>Layout compacto com card central</h1>
    <a href="#">Ver detalhes</a>
  </div>
</section>`,
    css: `.variant-three {
  display: grid;
  min-height: 500px;
  place-items: center;
  padding: 48px 24px;
  background: repeating-linear-gradient(45deg, #191919, #191919 12px, #202020 12px, #202020 24px);
  color: #fff;
  font-family: Arial, sans-serif;
}
.variant-three__panel { width: min(520px, 100%); border-radius: 18px; background: #fff; color: #111; padding: 42px; }
.variant-three strong { color: #e36a00; text-transform: uppercase; }
.variant-three h1 { margin: 14px 0 24px; font-size: 42px; line-height: 1.04; }
.variant-three a { color: #e36a00; font-weight: 800; }`
  }
]);
