/* ============================================================================
   colecao-joel.js - Dados da Colecao Joel

   RESPONSABILIDADE:
     Registra uma colecao de exemplo com layouts placeholder.

   EXPOE (globais):
     Chama ColLib.register({...}).

   DEPENDENCIAS:
     colecoes/col-core.js.

   ORDEM DE CARREGAMENTO:
     Depois de col-core.js e antes da UI de colecoes.
============================================================================ */

ColLib.register({
  slug: 'colecao-joel',
  name: 'Colecao Joel',
  group: 'joel',
  tags: ['responsivo'],
  layouts: [
    {
      id: 'hero-joel',
      name: 'Hero Joel',
      html: `<section class="col-sample"><h1>Colecao Joel</h1><p>Layout placeholder responsivo.</p></section>`,
      css: `.col-sample{width:1280px;min-height:680px;background:#fff;color:#111;font-family:Arial,sans-serif;display:grid;place-items:center;text-align:center}.col-sample h1{font-size:72px;color:#06b6d4}.col-sample p{font-size:22px;color:#666}`
    },
    {
      id: 'faq-joel',
      name: 'FAQ Joel',
      html: `<section class="col-faq"><h1>Duvidas frequentes</h1><p>Conteudo de apoio para PDP.</p></section>`,
      css: `.col-faq{width:1280px;min-height:680px;background:#fff;font-family:Arial,sans-serif;text-align:center;padding-top:110px}.col-faq h1{font-size:54px}.col-faq p{font-size:20px;color:#666}`
    }
  ]
});
