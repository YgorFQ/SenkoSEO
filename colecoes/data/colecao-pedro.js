/*
 * Colecao Pedro
 * Responsabilidade: registrar colecao de exemplo.
 * Dependencias: colecoes/col-core.js.
 * Expoe: dados via ColLib.register().
 */
ColLib.register({
  slug: 'colecao-pedro',
  name: 'Coleção Pedro',
  group: 'pedro',
  tags: [],
  layouts: [
    {
      id: 'intro-pedro',
      name: 'Intro Pedro',
      html: `<section class="pedro-intro"><p>Pedro</p><h1>Bloco de abertura para produto destaque</h1></section>`,
      css: `.pedro-intro{min-height:420px;padding:54px 32px;background:#fff7ed;color:#1f1308;font-family:Arial,sans-serif}.pedro-intro p{color:#f59e0b;font-weight:800}.pedro-intro h1{max-width:760px;font-size:56px;line-height:1;margin:0}`
    },
    {
      id: 'cards-pedro',
      name: 'Cards Pedro',
      html: `<section class="pedro-cards"><article>Performance</article><article>Conforto</article><article>Garantia</article></section>`,
      css: `.pedro-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:48px;background:#111;color:#fff;font-family:Arial,sans-serif}.pedro-cards article{min-height:160px;border:1px solid #333;border-radius:14px;display:grid;place-items:center;font-size:22px;font-weight:800}`
    },
    {
      id: 'cta-pedro',
      name: 'CTA Pedro',
      html: `<section class="pedro-cta"><h2>Pronto para publicar</h2><a href="#">Adicionar ao carrinho</a></section>`,
      css: `.pedro-cta{min-height:320px;display:grid;place-items:center;gap:20px;background:#f59e0b;color:#111;font-family:Arial,sans-serif;text-align:center}.pedro-cta h2{font-size:44px;margin:0}.pedro-cta a{background:#111;color:#fff;border-radius:999px;padding:14px 22px;text-decoration:none;font-weight:800}`
    }
  ]
});
