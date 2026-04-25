/* ============================================================================
   section-1.js - Variantes do layout section-1

   RESPONSABILIDADE:
     Registra variantes de exemplo para demonstrar o fluxo de preview,
     favoritos, edicao e persistencia via GitHub.

   EXPOE (globais):
     Chama SenkoLib.registerVariant('section-1', [...]).

   DEPENDENCIAS:
     core/senkolib-core.js.

   ORDEM DE CARREGAMENTO:
     Depois de layouts e antes da UI.
============================================================================ */

SenkoLib.registerVariant('section-1', [
  /*@@@@Senko - teste1 */
  {
    name: 'teste1',
    html: `<section class="v1"><h1>1200x250</h1><p>Variante com laranja solido e texto central.</p></section>`,
    css: `.v1{width:1280px;min-height:680px;background:#fff;font-family:Arial,sans-serif;text-align:center}.v1 h1{height:250px;margin:0;background:#ff6b00;color:#fff;display:grid;place-items:center;font-size:72px}.v1 p{font-size:20px;color:#666;margin-top:70px}`
  },
  /*@@@@Senko - teste2 */
  {
    name: 'teste2',
    html: `<section class="v2"><div><h1>Produto Premium</h1><p>Uma versao editorial para destaque de marca.</p></div></section>`,
    css: `.v2{width:1280px;min-height:680px;background:linear-gradient(rgba(20,24,30,.45),rgba(20,24,30,.45)),url("https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1280&q=60") center/cover;color:#fff;font-family:Arial,sans-serif;display:grid;place-items:center;text-align:center}.v2 h1{font-size:70px;margin:0}.v2 p{font-size:22px}`
  },
  /*@@@@Senko - teste3 */
  {
    name: 'teste3',
    html: `<section class="v3"><aside>LOGO</aside><article><h1>Titulo do Produto</h1><p>Descricao com bloco lateral e area visual limpa.</p></article></section>`,
    css: `.v3{width:1280px;min-height:680px;background:#fff;display:grid;grid-template-columns:420px 1fr;font-family:Arial,sans-serif}.v3 aside{background:#ff6b00;color:#fff;display:grid;place-items:center;font-size:64px;font-weight:900}.v3 article{align-self:center;padding:90px}.v3 h1{font-size:58px}.v3 p{font-size:22px;color:#666;line-height:1.6}`
  }
]);
