/* ============================================================================
   colecao-pedro.js - Dados da Colecao Pedro

   RESPONSABILIDADE:
     Registra uma colecao de exemplo com tres layouts placeholder.

   EXPOE (globais):
     Chama ColLib.register({...}).

   DEPENDENCIAS:
     colecoes/col-core.js.

   ORDEM DE CARREGAMENTO:
     Depois de col-core.js e antes da UI de colecoes.
============================================================================ */

ColLib.register({
  slug: 'colecao-pedro',
  name: 'Colecao Pedro',
  group: 'pedro',
  tags: [],
  layouts: [
    {
      id: 'banner-pedro',
      name: 'Banner Pedro',
      html: `<section class="pedro-banner"><h1>1600 x 650</h1></section>`,
      css: `.pedro-banner{width:1280px;min-height:680px;background:#f59e0b;color:#fff;font-family:Arial,sans-serif;display:grid;place-items:center}.pedro-banner h1{font-size:100px}`
    },
    {
      id: 'texto-pedro',
      name: 'Texto Pedro',
      html: `<section class="pedro-text"><h1>Subtitulo</h1><p>Texto editorial da colecao.</p></section>`,
      css: `.pedro-text{width:1280px;min-height:680px;background:#fff;color:#111;text-align:center;font-family:Georgia,serif;padding-top:120px}.pedro-text h1{font-size:44px}.pedro-text p{font-size:20px;color:#666}`
    },
    {
      id: 'cards-pedro',
      name: 'Cards Pedro',
      html: `<section class="pedro-cards"><div>01</div><div>02</div><div>03</div></section>`,
      css: `.pedro-cards{width:1280px;min-height:680px;background:#fff;display:flex;align-items:center;justify-content:center;gap:28px;font-family:Arial,sans-serif}.pedro-cards div{width:240px;height:220px;background:#f59e0b;color:#fff;display:grid;place-items:center;font-size:60px;font-weight:900}`
    }
  ]
});
