/*
 * Carneiro Colecoes
 * Responsabilidade: registrar colecao de exemplo.
 * Dependencias: colecoes/col-core.js.
 * Expoe: dados via ColLib.register().
 */
ColLib.register({
  slug: 'carneiro-colecoes',
  name: 'Carneiro Coleções',
  group: 'ygor',
  tags: ['responsivo'],
  layouts: [
    {
      id: 'hero-carneiro',
      name: 'Hero Carneiro',
      html: `<section class="carneiro-hero"><h1>Carneiro Coleções</h1><p>Base visual para conjunto de PDPs.</p></section>`,
      css: `.carneiro-hero{min-height:420px;display:grid;place-items:center;text-align:center;background:#ecfdf5;color:#052e16;font-family:Arial,sans-serif;padding:40px}.carneiro-hero h1{font-size:54px;margin:0}.carneiro-hero p{font-size:18px;color:#166534}`
    },
    {
      id: 'strip-carneiro',
      name: 'Faixa Carneiro',
      html: `<section class="carneiro-strip"><span>Responsivo</span><span>Modular</span><span>Pronto para PDP</span></section>`,
      css: `.carneiro-strip{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;padding:54px 24px;background:#052e16;color:#fff;font-family:Arial,sans-serif}.carneiro-strip span{border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:12px 18px;font-weight:800}`
    }
  ]
});
