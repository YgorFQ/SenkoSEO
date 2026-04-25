/* ============================================================================
   layouts001.js - Pacote inicial de layouts

   RESPONSABILIDADE:
     Registra layouts de exemplo para demonstrar a biblioteca, previews e
     parser baseado nos marcadores @@@@Senko.

   EXPOE (globais):
     Chama SenkoLib.register([...]).

   DEPENDENCIAS:
     core/senkolib-core.js.

   ORDEM DE CARREGAMENTO:
     Depois de SenkoLib e antes da UI.
============================================================================ */

SenkoLib.register([
  /*@@@@Senko - section-1 */
  {
    id: 'section-1',
    name: 'Section-1 (Header Imagem)',
    tags: ['header imagem', 'section 1', 'section-1'],
    html: `<section class="hero-image"><div class="hero-band"><span>1200x250</span></div><div class="badge">LOGO<br>MARCA</div><h1>TITULO DO PRODUTO GAMERE (Nome, modelo, diferencial...)</h1><p>Insira uma descricao breve, clara e comercial para apresentar os principais argumentos do produto.</p></section>`,
    css: `.hero-image{width:1280px;min-height:680px;background:#fff;text-align:center;font-family:Arial,sans-serif;color:#111}.hero-band{height:250px;background:linear-gradient(rgba(255,106,0,.78),rgba(255,106,0,.78)),url("https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1280&q=60") center/cover;display:grid;place-items:center;color:#fff;font-size:62px;font-weight:800}.badge{width:88px;height:88px;border-radius:50%;background:#ff7600;color:#fff;display:grid;place-items:center;margin:-44px auto 38px;border:7px solid #fff;font-size:14px;font-weight:800}h1{max-width:660px;margin:0 auto 24px;font-size:31px;line-height:1.15}p{max-width:680px;margin:0 auto;font-size:16px;color:#666;line-height:1.6}`
  },
  /*@@@@Senko - section-2 */
  {
    id: 'section-2',
    name: 'Section-2 (Header Video)',
    tags: ['header video', 'section 2', 'section-2', 'video'],
    html: `<section class="cotton"><div class="cotton-hero"><div class="logo">Cottonbaby</div></div><div class="badge">Cottonbaby</div><h1>TITULO DO PRODUTO (Nome, modelo, diferencial...)</h1><p>Base para header com video ou imagem de movimento, mantendo a leitura centralizada da PDP.</p></section>`,
    css: `.cotton{width:1280px;min-height:680px;background:#fff;text-align:center;font-family:Arial,sans-serif;color:#111}.cotton-hero{height:250px;background:linear-gradient(rgba(20,28,64,.58),rgba(20,28,64,.58)),url("https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1280&q=60") center/cover;display:grid;place-items:center}.logo{font-size:74px;font-weight:900;color:white;text-shadow:0 4px 0 #3a3269,0 0 8px rgba(255,255,255,.9)}.badge{width:82px;height:82px;border-radius:50%;background:#ff9a00;color:#fff;display:grid;place-items:center;margin:-41px auto 44px;border:7px solid #fff;font-size:12px;font-weight:900}h1{max-width:650px;margin:0 auto 24px;font-size:29px;line-height:1.18}p{max-width:700px;margin:0 auto;color:#666;font-size:16px;line-height:1.6}`
  },
  /*@@@@Senko - section-3 */
  {
    id: 'section-3',
    name: 'section-3',
    tags: ['section 3', 'section-3', 'tabs'],
    html: `<section class="tiles"><h2>Ciroc Vodka Original</h2><div class="tile-row"><span>Francesa</span><span>Vodka</span><span>40%</span><span>750ml</span><span>5x</span><span>Vidro</span></div></section>`,
    css: `.tiles{width:1280px;min-height:680px;background:#fff;text-align:center;font-family:Georgia,serif;color:#0f1933;padding-top:54px}h2{font-size:34px;color:#e6d7bd;font-weight:400;margin:0 0 42px}.tile-row{display:flex;gap:18px;justify-content:center}.tile-row span{width:125px;height:98px;background:#101a36;color:#fff;display:grid;place-items:center;font:18px Arial,sans-serif}`
  },
  /*@@@@Senko - section-4 */
  {
    id: 'section-4',
    name: 'Section-4 (Manual de Instrucao)',
    tags: ['manual de instrucao', 'section 4', 'section-4'],
    html: `<section class="manual"><header><div class="icon">?</div><div><strong>MANUAL</strong><span>DE INSTRUCOES</span></div></header><p>Seu conteudo fica organizado, objetivo e facil de consultar.</p></section>`,
    css: `.manual{width:1280px;min-height:680px;background:#fff;font-family:Arial,sans-serif;text-align:center;color:#111}header{height:250px;background:#ff640f;color:#fff;display:flex;align-items:center;justify-content:center;gap:28px;text-align:left}.icon{width:88px;height:88px;border-radius:14px;background:#fff;color:#ff640f;display:grid;place-items:center;font-size:62px;font-weight:900}strong{display:block;font-size:68px;line-height:.9}span{font-size:34px;letter-spacing:.5px}p{margin:50px auto 0;max-width:580px;color:#777;font-size:16px}`
  },
  /*@@@@Senko - section-5 */
  {
    id: 'section-5',
    name: 'Section-5',
    tags: ['section 5', 'section-5', 'tabela nutricional'],
    html: `<section class="nutri"><header><div class="chart"></div><div><strong>TABELA</strong><span>NUTRICIONAL</span></div></header><p>Valor diario e informacoes nutricionais em composicao limpa.</p></section>`,
    css: `.nutri{width:1280px;min-height:680px;background:#fff;font-family:Arial,sans-serif;color:#111;text-align:center}header{height:250px;background:#ff6412;color:#fff;display:flex;align-items:center;justify-content:center;gap:24px;text-align:left}.chart{width:78px;height:78px;border:8px solid #fff;border-radius:12px;position:relative}.chart:after{content:"";position:absolute;right:-30px;bottom:-8px;width:42px;height:42px;border-radius:50%;background:#fff}strong{display:block;font-size:66px;line-height:.9}span{font-size:34px}p{margin:46px auto;color:#777;font-size:16px}`
  },
  /*@@@@Senko - section-6 */
  {
    id: 'section-6',
    name: 'Section-6',
    tags: ['hero', 'section 6'],
    html: `<section class="orange-hero small"><div>1600 x 650</div></section><h3>Caderno Funny Cat</h3><p>Imagem com area de impacto horizontal para destaque de produto.</p>`,
    css: `.orange-hero{width:1280px;height:360px;background:linear-gradient(rgba(255,106,0,.82),rgba(255,106,0,.82)),url("https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1280&q=60") center/cover;color:#fff;display:grid;place-items:center;font:900 105px Arial,sans-serif}.small{height:330px}h3{width:1280px;margin:0;padding:28px 38px 0;font:700 24px Georgia,serif;color:#111}p{width:1280px;margin:10px 38px;color:#777;font:16px Arial,sans-serif}`
  },
  /*@@@@Senko - section-7 */
  {
    id: 'section-7',
    name: 'Section-7',
    tags: ['fallitens', 'section 7'],
    html: `<section class="full-orange"><h1>1600x865</h1><div><strong>SUB-TITULO</strong><span>Texto de apoio para composicao full banner.</span></div></section>`,
    css: `.full-orange{width:1280px;min-height:680px;background:linear-gradient(rgba(255,106,0,.82),rgba(255,106,0,.82)),url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1280&q=60") center/cover;color:#fff;font-family:Arial,sans-serif;display:grid;align-content:center;text-align:center}h1{font-size:150px;margin:0 0 120px;font-weight:900}strong{display:block;font-size:22px}span{font-size:15px}`
  },
  /*@@@@Senko - section-8 */
  {
    id: 'section-8',
    name: 'Section-8',
    tags: ['section 8', 'split'],
    html: `<section class="legend"><div class="crest">♛</div><h1>A Lenda dos Sete Mares</h1><p>Espaco editorial para contar historias do produto com elegancia e foco na leitura.</p></section>`,
    css: `.legend{width:1280px;min-height:680px;background:#fff;color:#111;text-align:center;font-family:Georgia,serif;padding-top:105px}.crest{font-size:42px;color:#555}h1{font-size:32px;margin:24px 0 45px}p{max-width:820px;margin:0 auto;font-size:16px;line-height:1.8}`
  },
  /*@@@@Senko - section-9 */
  {
    id: 'section-9',
    name: 'Section-9',
    tags: ['grid', 'section 9'],
    html: `<section class="faq"><h1>Resolva suas duvidas</h1><ul><li>O material e resistente?</li><li>Ele acompanha manual?</li><li>Possui garantia?</li><li>Como limpar corretamente?</li></ul></section>`,
    css: `.faq{width:1280px;min-height:680px;background:#fff;color:#111;font-family:Arial,sans-serif;text-align:center;padding-top:55px}h1{font-size:28px;margin:0 0 44px}ul{max-width:760px;margin:0 auto;padding:0;list-style:none;text-align:left}li{border-top:1px solid #ddd;padding:22px 0;font-size:17px}li:after{content:"+";float:right;color:#333}`
  },
  /*@@@@Senko - section-10 */
  {
    id: 'section-10',
    name: 'Section-10',
    tags: ['beneficios', 'section 10'],
    html: `<section class="benefits"><h1>Diferenciais que garantem uma instalacao superior</h1><div><article><b>✓</b><h2>Instalacao simples</h2><p>Processo objetivo para uso no dia a dia.</p></article><article><b>✓</b><h2>Acabamento premium</h2><p>Detalhes pensados para valorizar o produto.</p></article></div></section>`,
    css: `.benefits{width:1280px;min-height:680px;background:#fff;color:#111;font-family:Arial,sans-serif;text-align:center;padding-top:58px}h1{font:800 28px Georgia,serif;margin:0 0 70px}div{display:flex;justify-content:center;gap:150px}article{width:220px;text-align:left}b{display:grid;place-items:center;width:48px;height:48px;border:2px solid #111;border-radius:50%;font-size:25px}h2{font-size:18px}p{color:#666;line-height:1.5}`
  },
  /*@@@@Senko - section-11 */
  {
    id: 'section-11',
    name: 'Section-11',
    tags: ['grid', 'section 11'],
    html: `<section class="features"><h1>Diferenciais que garantem uma instalacao superior</h1><div><article><b>◎</b><h2>Pratico</h2><p>Descricao curta de apoio.</p></article><article><b>◎</b><h2>Seguro</h2><p>Descricao curta de apoio.</p></article><article><b>◎</b><h2>Duravel</h2><p>Descricao curta de apoio.</p></article></div></section>`,
    css: `.features{width:1280px;min-height:680px;background:#fff;color:#111;font-family:Arial,sans-serif;text-align:center;padding-top:55px}h1{font:800 26px Georgia,serif;margin:0 0 70px}div{display:grid;grid-template-columns:repeat(3,220px);gap:95px;justify-content:center}article{text-align:left}b{font-size:44px;color:#333}h2{font-size:18px}p{color:#666;line-height:1.5}`
  },
  /*@@@@Senko - section-12 */
  {
    id: 'section-12',
    name: 'Section-12',
    tags: ['full width', 'section-12', 'slide'],
    html: `<section class="tv"><div class="frame"><span>4K + HDR</span></div><p>Experiencia visual com imagem de alto impacto para vitrines premium.</p></section>`,
    css: `.tv{width:1280px;min-height:680px;background:#fff;text-align:center;font-family:Arial,sans-serif;color:#111;padding-top:62px}.frame{width:960px;height:420px;margin:0 auto;background:url("https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1280&q=60") center/cover;position:relative;border:1px solid #111}.frame:before,.frame:after{content:"";position:absolute;top:0;bottom:0;width:1px;background:#222}.frame:before{left:210px}.frame:after{right:210px}span{position:absolute;right:60px;top:42px;color:white;font-size:46px;font-weight:900}p{font-size:15px;color:#666}`
  },
  /*@@@@Senko - section-13 */
  {
    id: 'section-13',
    name: 'Section-13',
    tags: ['celular', 'section-13'],
    html: `<section class="phone"><div class="device"><div></div></div></section>`,
    css: `.phone{width:1280px;min-height:680px;background:#fff;display:grid;place-items:center}.device{width:250px;height:520px;border:10px solid #0e1a28;border-radius:38px;padding:30px 14px;background:#111;box-shadow:0 12px 40px rgba(0,0,0,.28)}.device div{height:100%;border-radius:24px;background:url("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=70") center/cover}`
  },
  /*@@@@Senko - section-14 */
  {
    id: 'section-14',
    name: 'Section-14',
    tags: ['subtitulo', 'section-14'],
    html: `<section class="textblock"><h2>SUB-TITULO</h2><p>Conteudo textual com largura controlada para descricoes tecnicas, historias de marca e explicacoes de uso.</p></section>`,
    css: `.textblock{width:1280px;min-height:680px;background:#fff;color:#111;text-align:center;font-family:Georgia,serif;padding-top:120px}h2{font-size:28px;margin-bottom:36px}p{max-width:760px;margin:0 auto;font-size:18px;line-height:1.9;color:#555}`
  },
  /*@@@@Senko - section-15 */
  {
    id: 'section-15',
    name: 'Section-15',
    tags: ['dark', 'hero', 'section-15'],
    html: `<section class="darkhero"><h1>Experiencia completa</h1><p>Banner escuro para produtos premium com alto contraste.</p></section>`,
    css: `.darkhero{width:1280px;min-height:680px;background:linear-gradient(rgba(0,0,0,.58),rgba(0,0,0,.58)),url("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1280&q=60") center/cover;color:#fff;font-family:Arial,sans-serif;display:grid;place-items:center;text-align:center}h1{font-size:78px;margin:0}p{font-size:22px;max-width:620px;line-height:1.5}`
  },
  /*@@@@Senko - section-16 */
  {
    id: 'section-16',
    name: 'Section-16',
    tags: ['comparativo', 'section-16'],
    html: `<section class="compare"><h1>Compare os detalhes</h1><div><span>Antes</span><span>Depois</span></div></section>`,
    css: `.compare{width:1280px;min-height:680px;background:#fff;font-family:Arial,sans-serif;text-align:center;padding-top:70px}h1{font-size:42px;margin:0 0 60px}div{display:grid;grid-template-columns:420px 420px;gap:28px;justify-content:center}span{height:330px;display:grid;place-items:center;background:#f2f2f2;border:1px solid #ddd;font-size:34px;font-weight:900;color:#555}`
  },
  /*@@@@Senko - section-17 */
  {
    id: 'section-17',
    name: 'Section-17',
    tags: ['passos', 'section-17'],
    html: `<section class="steps"><h1>Como usar</h1><ol><li>Abra</li><li>Aplique</li><li>Finalize</li></ol></section>`,
    css: `.steps{width:1280px;min-height:680px;background:#fff;font-family:Arial,sans-serif;text-align:center;padding-top:80px}h1{font-size:48px}ol{display:flex;justify-content:center;gap:32px;list-style:none;padding:0;margin:70px 0 0}li{width:220px;height:180px;background:#101725;color:white;display:grid;place-items:center;font-size:26px;font-weight:900;border-radius:18px;position:relative}li:before{content:counter(list-item);position:absolute;top:-20px;width:44px;height:44px;border-radius:50%;background:#ff6b00;display:grid;place-items:center}`
  },
  /*@@@@Senko - section-18 */
  {
    id: 'section-18',
    name: 'Section-18',
    tags: ['grade', 'section-18'],
    html: `<section class="gallery"><h1>Galeria de detalhes</h1><div><span></span><span></span><span></span><span></span></div></section>`,
    css: `.gallery{width:1280px;min-height:680px;background:#fff;font-family:Arial,sans-serif;text-align:center;padding-top:54px}h1{font-size:42px}.gallery div{display:grid;grid-template-columns:repeat(4,210px);gap:18px;justify-content:center;margin-top:60px}span{height:260px;background:linear-gradient(rgba(255,106,0,.18),rgba(255,106,0,.18)),url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=60") center/cover;border-radius:8px}`
  },
  /*@@@@Senko - section-19 */
  {
    id: 'section-19',
    name: 'Section-19',
    tags: ['produto', 'section-19'],
    html: `<section class="product"><div></div><article><h1>Produto em destaque</h1><p>Area para combinar imagem e beneficios sem perder clareza.</p></article></section>`,
    css: `.product{width:1280px;min-height:680px;background:#fff;font-family:Arial,sans-serif;display:grid;grid-template-columns:1fr 1fr;align-items:center}.product div{height:520px;background:linear-gradient(rgba(255,106,0,.28),rgba(255,106,0,.28)),url("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=60") center/cover}.product article{padding:80px}h1{font-size:56px;line-height:1.05}p{font-size:21px;color:#666;line-height:1.6}`
  },
  /*@@@@Senko - section-20 */
  {
    id: 'section-20',
    name: 'Section-20',
    tags: ['manual', 'cards', 'section-20'],
    html: `<section class="manualcards"><h1>Manual rapido</h1><div><article>01</article><article>02</article><article>03</article></div></section>`,
    css: `.manualcards{width:1280px;min-height:680px;background:#fff;font-family:Arial,sans-serif;text-align:center;padding-top:70px}h1{font-size:52px}.manualcards div{display:flex;justify-content:center;gap:24px;margin-top:70px}article{width:260px;height:230px;border:2px solid #ff6b00;border-radius:12px;color:#ff6b00;display:grid;place-items:center;font-size:70px;font-weight:900;background:rgba(255,107,0,.06)}`
  },
  /*@@@@Senko - section-21 */
  {
    id: 'section-21',
    name: 'Section-21',
    tags: ['cta', 'section-21'],
    html: `<section class="cta"><h1>Pronto para vender melhor</h1><p>Fechamento de PDP com chamada clara e visual forte.</p><a>Conheca o produto</a></section>`,
    css: `.cta{width:1280px;min-height:680px;background:#ff6b00;color:#fff;font-family:Arial,sans-serif;display:grid;place-items:center;text-align:center}h1{font-size:76px;max-width:850px;line-height:1.03;margin:0}p{font-size:22px;margin:26px 0}a{display:inline-flex;align-items:center;height:54px;padding:0 34px;border-radius:999px;background:#fff;color:#ff6b00;font-weight:900;text-decoration:none}`
  }
]);
