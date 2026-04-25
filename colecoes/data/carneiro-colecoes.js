/* ============================================================================
   carneiro-colecoes.js - Dados da Carneiro Colecoes

   RESPONSABILIDADE:
     Registra uma colecao de exemplo vinculada ao grupo Ygor.

   EXPOE (globais):
     Chama ColLib.register({...}).

   DEPENDENCIAS:
     colecoes/col-core.js.

   ORDEM DE CARREGAMENTO:
     Depois de col-core.js e antes da UI de colecoes.
============================================================================ */

ColLib.register({
  slug: 'carneiro-colecoes',
  name: 'Carneiro Colecoes',
  group: 'ygor',
  tags: ['responsivo'],
  layouts: [
    {
      id: 'hero-carneiro',
      name: 'Hero Carneiro',
      html: `<section class="carneiro"><h1>Carneiro Colecoes</h1><p>Placeholder para campanha de PDP.</p></section>`,
      css: `.carneiro{width:1280px;min-height:680px;background:#1a9e52;color:#fff;font-family:Arial,sans-serif;display:grid;place-items:center;text-align:center}.carneiro h1{font-size:70px}.carneiro p{font-size:22px}`
    },
    {
      id: 'grid-carneiro',
      name: 'Grid Carneiro',
      html: `<section class="carneiro-grid"><span></span><span></span><span></span></section>`,
      css: `.carneiro-grid{width:1280px;min-height:680px;background:#fff;display:flex;align-items:center;justify-content:center;gap:20px}.carneiro-grid span{width:260px;height:320px;background:#1a9e52;border-radius:12px}`
    }
  ]
});
