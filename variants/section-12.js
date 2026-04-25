// @ts-nocheck
SenkoLib.registerVariant('section-12', [
/*@@@@Senko - section-12 */
  {
    name: 'section-12',
    html: `<section class="section-12-1-container">
    <figure class="section-12-1">
        <div class="section-12-1__wrapper">
            <img class="section-12-1__image-after"
                src=https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/philco/smart-tv-philco-4k-uhd-tecnologia-hdr10-otimizada-01577-22-11928-10.png
                alt="..." loading="lazy" decoding="async" />
            <img class="section-12-1__image-before"
                src=https://static1.efacil.com.br/wcsstore//AuroraStorefrontAssetStore/PDP/philco/smart-tv-philco-4k-uhd-qualidade-imagem-padrao-01577-22-11928-09.png
                alt="..." loading="lazy" decoding="async" />
            <div class="section-12-1__line"></div>
        </div>
    </figure>
</section>`,
    css: `<style>
    .section-12-1-container {
        padding-bottom: 0;
    }

    .section-12-1 {
        margin-left: auto;
        margin-right: auto;
    }

    .section-12-1__wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;
    }

    .section-12-1__image-after {
        display: block;
        width: 100%;
        height: auto;
    }

    .section-12-1__image-before {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        clip-path: inset(0 50% 0 0);
        animation: section-12-1-reveal 4s ease-in-out infinite alternate;
    }

    .section-12-1__line {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px;
        background-color: rgba(255, 255, 255, 0);
        animation: section-12-1-line 4s ease-in-out infinite alternate;
        pointer-events: none;
    }

    @keyframes section-12-1-reveal {
        0% {
            clip-path: inset(0 100% 0 0);
        }

        100% {
            clip-path: inset(0 0% 0 0);
        }
    }

    @keyframes section-12-1-line {
        0% {
            left: 10%;
        }

        100% {
            left: 90%;
        }
    }
</style>`,
  },
]);
