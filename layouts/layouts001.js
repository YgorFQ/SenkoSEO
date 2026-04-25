/*
 * Pacote inicial de layouts
 * Responsabilidade: registrar layouts base da biblioteca.
 * Dependencias: core/senkolib-core.js.
 * Expoe: registros via SenkoLib.register().
 */
SenkoLib.register([
  /*@@@@Senko - section-1 */
  {
    id: 'section-1',
    name: 'Section 1',
    tags: ['hero', 'banner', 'placeholder'],
    html: `<section class="senko-hero">
  <div class="senko-hero__content">
    <p class="senko-hero__eyebrow">Nova coleção</p>
    <h1>Produtos prontos para uma vitrine mais forte</h1>
    <p class="senko-hero__text">Um bloco inicial simples para demonstrar previews, variantes e edição.</p>
    <a class="senko-hero__button" href="#">Comprar agora</a>
  </div>
</section>`,
    css: `.senko-hero {
  display: grid;
  min-height: 520px;
  place-items: center;
  padding: 56px 24px;
  background: linear-gradient(135deg, #101010, #2a180a);
  color: #fff;
  font-family: Arial, sans-serif;
}

.senko-hero__content {
  width: min(960px, 100%);
}

.senko-hero__eyebrow {
  margin: 0 0 12px;
  color: #ff9f4a;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.senko-hero h1 {
  max-width: 720px;
  margin: 0;
  font-size: clamp(36px, 6vw, 76px);
  line-height: .96;
}

.senko-hero__text {
  max-width: 560px;
  margin: 20px 0 28px;
  color: rgba(255,255,255,.76);
  font-size: 18px;
  line-height: 1.55;
}

.senko-hero__button {
  display: inline-flex;
  align-items: center;
  min-height: 46px;
  border-radius: 999px;
  background: #e36a00;
  color: #fff;
  padding: 0 22px;
  text-decoration: none;
  font-weight: 800;
}`
  }
]);
