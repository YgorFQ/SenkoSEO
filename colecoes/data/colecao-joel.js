/*
 * Colecao Joel
 * Responsabilidade: registrar colecao de exemplo.
 * Dependencias: colecoes/col-core.js.
 * Expoe: dados via ColLib.register().
 */
ColLib.register({
  slug: 'colecao-joel',
  name: 'Coleção Joel',
  group: 'joel',
  tags: ['responsivo'],
  layouts: [
    {
      id: 'hero-joel',
      name: 'Hero Joel',
      html: `<section class="pdp-demo pdp-demo--blue">
  <h1>Coleção Joel</h1>
  <p>Placeholder responsivo para uma PDP de campanha.</p>
</section>`,
      css: `.pdp-demo{min-height:420px;display:grid;place-items:center;text-align:center;padding:40px;font-family:Arial,sans-serif}.pdp-demo--blue{background:#e8f7fb;color:#083344}.pdp-demo h1{font-size:52px;margin:0 0 10px}.pdp-demo p{font-size:18px;margin:0;color:#335}`
    },
    {
      id: 'benefits-joel',
      name: 'Benefícios Joel',
      html: `<section class="pdp-benefits"><h2>Benefícios principais</h2><ul><li>Entrega rápida</li><li>Design modular</li><li>Conteúdo editável</li></ul></section>`,
      css: `.pdp-benefits{padding:54px 28px;font-family:Arial,sans-serif;background:#fff;color:#111}.pdp-benefits h2{font-size:38px}.pdp-benefits li{margin:10px 0;font-size:18px}`
    }
  ]
});
