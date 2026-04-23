const STORAGE_KEY = "senkoseo-project-v1";

const blockLibrary = [
  {
    id: "hero",
    title: "Hero de abertura",
    purpose: "Apresenta o produto, o principal benefício e a atmosfera visual da PDP.",
    trust: "Alta",
    imageNeed: "Foto principal do produto ou composição hero com fundo relacionado ao contexto.",
  },
  {
    id: "overview",
    title: "Visão geral",
    purpose: "Resume o que é o produto, para quem serve e onde ele se encaixa.",
    trust: "Alta",
    imageNeed: "Imagem de uso ou 2 a 3 closes do produto.",
  },
  {
    id: "feature",
    title: "Diferencial principal",
    purpose: "Isola a vantagem mais vendável para evitar uma página genérica.",
    trust: "Alta",
    imageNeed: "Close técnico ou cena que evidencie o principal diferencial.",
  },
  {
    id: "workflow",
    title: "Uso no dia a dia",
    purpose: "Mostra como o produto ajuda a rotina, reduz dúvidas práticas e aproxima a venda.",
    trust: "Média",
    imageNeed: "Imagem demonstrando manuseio, painel, seletor ou rotina de uso.",
  },
  {
    id: "specs",
    title: "Especificações visuais",
    purpose: "Organiza os dados técnicos em formato mais fácil de escanear.",
    trust: "Alta",
    imageNeed: "Ícones, tabela ou imagem com chamadas numeradas.",
  },
  {
    id: "design",
    title: "Design e exposição",
    purpose: "Valoriza estética, acabamento, ergonomia e experiência visual do produto.",
    trust: "Média",
    imageNeed: "Ângulos bonitos, detalhes de material e contexto de exposição.",
  },
  {
    id: "credibility",
    title: "Credibilidade da marca",
    purpose: "Fecha a narrativa com prova institucional, tradição ou autoridade técnica.",
    trust: "Alta",
    imageNeed: "Logo da marca, selo ou elemento institucional.",
  },
  {
    id: "faq",
    title: "Dúvidas rápidas",
    purpose: "Responde objeções comuns e aumenta a utilidade da página.",
    trust: "Média",
    imageNeed: "Não exige imagem obrigatória.",
  },
];

const demoProject = {
  projectName: "VM50 Metalfrio PDP",
  brand: "Metalfrio",
  productName: "Freezer expositor Versa VM50",
  category: "Refrigeração comercial",
  audience: "mercados de bairro, conveniência, food service e pequenos varejistas",
  tone: "técnico-comercial, confiável e direto",
  imageUrl: "https://cdn.exemplo.com/versa-vm50.png",
  technicalSheet:
    "Freezer expositor multitemperatura. Ajuste de 8°C a -20°C. Vidro antiembaçante. Iluminação LED. Prateleiras ajustáveis. Fluxo de ar forçado. Frost Free. Marca com mais de 65 anos de mercado.",
  projectRules:
    "Títulos com no máximo 10 palavras.\nFrases curtas e objetivas.\nEvitar superlativos vazios.\nExplicar o benefício antes do detalhe técnico.\nUsar HTML semântico e CSS responsivo.",
  officialSources:
    "https://metalfrio.com.br\nLanding do produto com claims oficiais e ficha técnica.",
  retailSources:
    "Páginas de varejo com descrição resumida, fotos de uso e dúvidas frequentes.",
};

const state = {
  project: loadProject(),
  strategy: null,
  selectedBlocks: [],
  assetGuides: [],
};

const elements = {
  saveStatus: document.querySelector("#save-status"),
  strategySummary: document.querySelector("#strategy-summary"),
  palettePreview: document.querySelector("#palette-preview"),
  riskList: document.querySelector("#risk-list"),
  blocksLibrary: document.querySelector("#blocks-library"),
  assetGuides: document.querySelector("#asset-guides"),
  htmlOutput: document.querySelector("#html-output"),
  cssOutput: document.querySelector("#css-output"),
  finalChecklist: document.querySelector("#final-checklist"),
};

const inputIds = [
  "project-name",
  "brand",
  "product-name",
  "category",
  "audience",
  "tone",
  "image-url",
  "technical-sheet",
  "project-rules",
  "official-sources",
  "retail-sources",
];

hydrateForm();
bindEvents();
renderBlocks();

if (hasProjectContent()) {
  buildStrategy();
}

function bindEvents() {
  document.querySelectorAll(".step-link").forEach((button) => {
    button.addEventListener("click", () => activateStep(button.dataset.stepTarget));
  });

  inputIds.forEach((id) => {
    const element = document.querySelector(`#${id}`);
    element.addEventListener("input", () => {
      syncProjectFromForm();
      persistProject();
      updateSaveStatus("Projeto salvo localmente.");
    });
  });

  document.querySelector("#load-demo").addEventListener("click", () => {
    state.project = { ...demoProject };
    hydrateForm();
    buildStrategy();
    persistProject();
    updateSaveStatus("Exemplo carregado.");
  });

  document.querySelector("#reset-project").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    state.project = emptyProject();
    state.strategy = null;
    state.selectedBlocks = [];
    state.assetGuides = [];
    hydrateForm();
    renderStrategy();
    renderBlocks();
    renderAssetGuides();
    elements.htmlOutput.value = "";
    elements.cssOutput.value = "";
    elements.finalChecklist.innerHTML = '<div class="empty-state">Gere o código para receber a checklist de revisão final.</div>';
    updateSaveStatus("Projeto limpo.");
  });

  document.querySelector("#analyze-product").addEventListener("click", () => {
    syncProjectFromForm();
    buildStrategy();
    activateStep("step-strategy");
  });

  document.querySelector("#recommend-blocks").addEventListener("click", () => {
    if (!state.strategy) buildStrategy();
    state.selectedBlocks = [...state.strategy.recommendedBlocks];
    renderBlocks();
    persistProject();
  });

  document.querySelector("#build-assets").addEventListener("click", () => {
    if (!state.strategy) buildStrategy();
    if (!state.selectedBlocks.length) {
      state.selectedBlocks = [...state.strategy.recommendedBlocks];
    }
    state.assetGuides = buildGuides();
    renderAssetGuides();
    activateStep("step-assets");
  });

  document.querySelector("#generate-output").addEventListener("click", () => {
    if (!state.strategy) buildStrategy();
    if (!state.assetGuides.length) {
      state.assetGuides = buildGuides();
      renderAssetGuides();
    }
    elements.htmlOutput.value = generateHtml();
    elements.cssOutput.value = generateCss();
    renderChecklist();
    activateStep("step-output");
  });

  document.querySelector("#copy-html").addEventListener("click", async () => {
    await copyToClipboard(elements.htmlOutput.value);
    updateSaveStatus("HTML copiado.");
  });

  document.querySelector("#copy-css").addEventListener("click", async () => {
    await copyToClipboard(elements.cssOutput.value);
    updateSaveStatus("CSS copiado.");
  });
}

function emptyProject() {
  return {
    projectName: "",
    brand: "",
    productName: "",
    category: "",
    audience: "",
    tone: "",
    imageUrl: "",
    technicalSheet: "",
    projectRules: "",
    officialSources: "",
    retailSources: "",
  };
}

function loadProject() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return emptyProject();
  try {
    return { ...emptyProject(), ...JSON.parse(saved) };
  } catch (_error) {
    return emptyProject();
  }
}

function persistProject() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.project));
}

function syncProjectFromForm() {
  state.project = {
    projectName: getValue("project-name"),
    brand: getValue("brand"),
    productName: getValue("product-name"),
    category: getValue("category"),
    audience: getValue("audience"),
    tone: getValue("tone"),
    imageUrl: getValue("image-url"),
    technicalSheet: getValue("technical-sheet"),
    projectRules: getValue("project-rules"),
    officialSources: getValue("official-sources"),
    retailSources: getValue("retail-sources"),
  };
}

function hydrateForm() {
  setValue("project-name", state.project.projectName);
  setValue("brand", state.project.brand);
  setValue("product-name", state.project.productName);
  setValue("category", state.project.category);
  setValue("audience", state.project.audience);
  setValue("tone", state.project.tone);
  setValue("image-url", state.project.imageUrl);
  setValue("technical-sheet", state.project.technicalSheet);
  setValue("project-rules", state.project.projectRules);
  setValue("official-sources", state.project.officialSources);
  setValue("retail-sources", state.project.retailSources);
}

function hasProjectContent() {
  return Object.values(state.project).some(Boolean);
}

function buildStrategy() {
  const project = state.project;
  const category = project.category.toLowerCase();
  const sheet = project.technicalSheet.toLowerCase();
  const rules = splitLines(project.projectRules);
  const palette = pickPalette(category, sheet);
  const keyBenefit = deriveKeyBenefit(sheet, category);
  const confidence = project.officialSources ? "Alta" : "Média";

  state.strategy = {
    summary: [
      `${project.productName || "Produto"} deve ser comunicado como ${keyBenefit}.`,
      `Tom recomendado: ${project.tone || "técnico-comercial enxuto"}.`,
      `Público prioritário: ${project.audience || "compradores comparando solução e benefício prático"}.`,
      `Confiança da estratégia: ${confidence}, porque ela depende principalmente da ficha técnica e das fontes oficiais.`,
    ],
    rationale: [
      "A narrativa começa pelo benefício central antes de abrir detalhes técnicos.",
      "Os blocos escolhidos evitam repetição e reforçam a leitura escaneável.",
      "A paleta foi escolhida com base na categoria do produto e na sensação comercial dominante.",
      "A saída final assume revisão humana antes da publicação.",
    ],
    risks: [
      "Sem fotos auxiliares, os blocos visuais dependerão de prompts e placeholders.",
      "Se a ficha técnica estiver incompleta, o sistema pode sugerir benefícios genéricos demais.",
      "A credibilidade da copy cai quando as referências de fabricante são poucas ou fracas.",
      "FAQ e argumentos de comparação exigem revisão, porque o sistema não valida promessas sozinho.",
    ],
    palette,
    keyBenefit,
    recommendedBlocks: recommendBlocks(category, sheet),
    rules,
  };

  if (!state.selectedBlocks.length) {
    state.selectedBlocks = [...state.strategy.recommendedBlocks];
  }

  renderStrategy();
  renderBlocks();
  persistProject();
}

function pickPalette(category, sheet) {
  if (category.includes("refrig") || sheet.includes("gel") || sheet.includes("frost")) {
    return {
      title: "Paleta fria com contraste comercial",
      justification: "Produtos de refrigeração pedem sensação de limpeza, precisão e conservação, sem perder força de venda.",
      colors: [
        { label: "Base escura", value: "#16354b" },
        { label: "Acento quente", value: "#d9622b" },
        { label: "Frio claro", value: "#d8eef5" },
        { label: "Neutro quente", value: "#f8f3eb" },
      ],
    };
  }

  if (category.includes("móvel") || category.includes("decor")) {
    return {
      title: "Paleta quente e material",
      justification: "Móveis costumam ganhar mais força com tons terrosos, contraste suave e sensação tátil.",
      colors: [
        { label: "Madeira escura", value: "#4f3527" },
        { label: "Areia", value: "#dcc7aa" },
        { label: "Neutro claro", value: "#f5f1ea" },
        { label: "Acento mineral", value: "#7c8f8d" },
      ],
    };
  }

  return {
    title: "Paleta institucional equilibrada",
    justification: "Quando a categoria não está tão clara, a melhor saída é uma base neutra com um acento forte de marca.",
    colors: [
      { label: "Base", value: "#1b3146" },
      { label: "Acento", value: "#cb6830" },
      { label: "Claro", value: "#f4efe8" },
      { label: "Suporte", value: "#d8dfda" },
    ],
  };
}

function deriveKeyBenefit(sheet, category) {
  if (sheet.includes("multitemper")) return "a solução versátil que se adapta a diferentes ofertas";
  if (sheet.includes("led") && sheet.includes("vidro")) return "um produto que valoriza a exposição e melhora a leitura visual";
  if (category.includes("refrig")) return "uma solução de conservação com apelo comercial claro";
  return "uma proposta que combina benefício prático com apresentação mais vendável";
}

function recommendBlocks(category, sheet) {
  const ids = ["hero", "overview", "feature", "workflow", "specs", "credibility"];
  if (sheet.includes("vidro") || sheet.includes("design") || category.includes("premium")) {
    ids.splice(5, 0, "design");
  }
  if (sheet.includes("dúvida") || sheet.includes("faq")) {
    ids.push("faq");
  }
  return ids;
}

function renderStrategy() {
  if (!state.strategy) {
    elements.strategySummary.innerHTML = "Preencha o produto e clique em “Gerar estratégia base”.";
    elements.palettePreview.innerHTML = "A paleta aparece aqui com justificativa.";
    elements.riskList.innerHTML = "Os limites do projeto serão listados aqui para manter a geração honesta.";
    return;
  }

  elements.strategySummary.innerHTML = `
    <ul class="checklist">
      ${state.strategy.summary.map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <p class="muted"><strong>Decisões:</strong> ${state.strategy.rationale.join(" ")}</p>
  `;

  elements.palettePreview.innerHTML = `
    <div>
      <strong>${state.strategy.palette.title}</strong>
      <p class="palette-note">${state.strategy.palette.justification}</p>
    </div>
    <div class="palette-swatches">
      ${state.strategy.palette.colors
        .map(
          (color) => `
            <div class="swatch">
              <div class="swatch__chip" style="background:${color.value}"></div>
              <span>${color.label}<br>${color.value}</span>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  elements.riskList.innerHTML = `
    <ul class="checklist">
      ${state.strategy.risks.map((risk) => `<li>${risk}</li>`).join("")}
    </ul>
  `;
}

function renderBlocks() {
  elements.blocksLibrary.innerHTML = blockLibrary
    .map((block, index) => {
      const selected = state.selectedBlocks.includes(block.id);
      const order = state.selectedBlocks.indexOf(block.id);
      return `
        <article class="block-card">
          <div class="block-card__header">
            <div>
              <h4>${block.title}</h4>
              <p>${block.purpose}</p>
            </div>
            <div class="pill">${selected ? `Ativo #${order + 1}` : "Inativo"}</div>
          </div>
          <div class="block-card__meta">
            <span class="pill">Confiança ${block.trust}</span>
            <span class="pill">${block.imageNeed}</span>
          </div>
          <div class="block-card__actions">
            <button type="button" class="mini-button ${selected ? "is-active" : ""}" data-action="toggle" data-id="${block.id}">
              ${selected ? "Remover" : "Ativar"}
            </button>
            <button type="button" class="mini-button" data-action="up" data-id="${block.id}" ${order <= 0 ? "disabled" : ""}>
              Subir
            </button>
            <button type="button" class="mini-button" data-action="down" data-id="${block.id}" ${order === -1 || order === state.selectedBlocks.length - 1 ? "disabled" : ""}>
              Descer
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  elements.blocksLibrary.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleBlockAction(button.dataset.action, button.dataset.id));
  });
}

function handleBlockAction(action, id) {
  const index = state.selectedBlocks.indexOf(id);
  if (action === "toggle") {
    if (index >= 0) {
      state.selectedBlocks.splice(index, 1);
    } else {
      state.selectedBlocks.push(id);
    }
  }

  if (action === "up" && index > 0) {
    [state.selectedBlocks[index - 1], state.selectedBlocks[index]] =
      [state.selectedBlocks[index], state.selectedBlocks[index - 1]];
  }

  if (action === "down" && index >= 0 && index < state.selectedBlocks.length - 1) {
    [state.selectedBlocks[index + 1], state.selectedBlocks[index]] =
      [state.selectedBlocks[index], state.selectedBlocks[index + 1]];
  }

  renderBlocks();
}

function buildGuides() {
  return state.selectedBlocks.map((blockId) => {
    const block = blockLibrary.find((item) => item.id === blockId);
    const headline = buildHeadline(blockId);
    const body = buildBody(blockId);
    const prompt = buildPrompt(block);

    return {
      id: block.id,
      title: block.title,
      purpose: block.purpose,
      headline,
      body,
      imageNeed: block.imageNeed,
      prompt,
    };
  });
}

function renderAssetGuides() {
  if (!state.assetGuides.length) {
    elements.assetGuides.innerHTML = '<div class="empty-state">Gere os guias para ver copy base, orientação visual e prompts.</div>';
    return;
  }

  elements.assetGuides.innerHTML = state.assetGuides
    .map(
      (guide) => `
        <article class="guide-card">
          <h4>${guide.title}</h4>
          <p>${guide.purpose}</p>
          <div class="guide-grid">
            <section class="guide-box">
              <h5>Copy base</h5>
              <p><strong>Título:</strong> ${guide.headline}</p>
              <p><strong>Texto:</strong> ${guide.body}</p>
            </section>
            <section class="guide-box">
              <h5>Imagem e prompt</h5>
              <p><strong>Imagem desejada:</strong> ${guide.imageNeed}</p>
              <p><strong>Prompt:</strong> ${guide.prompt}</p>
            </section>
          </div>
        </article>
      `
    )
    .join("");
}

function buildHeadline(blockId) {
  const product = state.project.productName || "o produto";
  const benefit = state.strategy?.keyBenefit || "o principal diferencial";
  const headlines = {
    hero: `${product}: ${trimWords(benefit, 6)}`,
    overview: `Entenda onde ${shortName(product)} se destaca`,
    feature: `O diferencial que muda a rotina`,
    workflow: `Mais agilidade no uso diário`,
    specs: `Dados técnicos com leitura rápida`,
    design: `Design que reforça valor percebido`,
    credibility: `${state.project.brand || "A marca"} como prova de confiança`,
    faq: `Dúvidas rápidas antes da compra`,
  };
  return headlines[blockId] || "Bloco de conteúdo";
}

function buildBody(blockId) {
  const audience = state.project.audience || "o comprador";
  const benefit = state.strategy?.keyBenefit || "o principal benefício";
  const body = {
    hero: `Abra a página apresentando ${benefit} de forma imediata para ${audience}.`,
    overview: `Explique o que é o produto, para quem serve e por que ele merece atenção logo na primeira dobra.`,
    feature: `Isole um argumento forte da ficha técnica e traduza o detalhe técnico em benefício comercial.`,
    workflow: `Mostre como o produto ajuda a operação do dia a dia e reduz dúvidas práticas.`,
    specs: `Organize especificações em formato escaneável com foco no que impacta compra e uso.`,
    design: `Valorize estética, acabamento e percepção de organização para elevar o valor percebido.`,
    credibility: `Feche a narrativa com provas institucionais, reputação da marca ou histórico técnico.`,
    faq: `Responda objeções curtas que normalmente surgem antes da decisão final.`,
  };
  return body[blockId] || "Descreva o benefício do bloco em linguagem curta.";
}

function buildPrompt(block) {
  const product = state.project.productName || "product";
  const brand = state.project.brand || "brand";
  return `Commercial product scene for ${product}, aligned with ${brand}, clean e-commerce composition, premium lighting, clear focal point, realistic materials, no text, high detail, section goal: ${block.purpose}.`;
}

function generateHtml() {
  const sections = state.assetGuides.map((guide) => buildSectionMarkup(guide)).join("\n\n");
  const projectTitle = state.project.projectName || state.project.productName || "SenkoSEO Project";
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(projectTitle)}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="pdp">
    ${sections}
  </main>
</body>
</html>`;
}

function generateCss() {
  const palette = state.strategy?.palette.colors || [];
  const [base, accent, soft, neutral] = palette;
  return `:root {
  --base: ${base?.value || "#1b3146"};
  --accent: ${accent?.value || "#cb6830"};
  --soft: ${soft?.value || "#d8eef5"};
  --neutral: ${neutral?.value || "#f4efe8"};
  --text: #15212c;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Arial", sans-serif;
  color: var(--text);
  background: linear-gradient(180deg, var(--neutral), #ffffff);
}

img {
  max-width: 100%;
  display: block;
}

.pdp {
  display: grid;
  gap: 24px;
  padding: 24px;
}

.pdp-section {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  align-items: center;
  padding: 32px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.pdp-section--highlight {
  background: linear-gradient(135deg, var(--base), #244c6b);
  color: #ffffff;
}

.pdp-section__copy {
  display: grid;
  gap: 12px;
}

.pdp-section__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.8rem;
  color: var(--accent);
}

.pdp-section--highlight .pdp-section__eyebrow {
  color: #ffd0b7;
}

.pdp-section__title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 0.98;
}

.pdp-section__text {
  margin: 0;
  max-width: 56ch;
  line-height: 1.6;
}

.pdp-section__media {
  min-height: 280px;
  border-radius: 24px;
  background: linear-gradient(180deg, var(--soft), rgba(255, 255, 255, 0.6));
  border: 1px dashed rgba(0, 0, 0, 0.14);
  padding: 16px;
}

.pdp-placeholder {
  height: 100%;
  min-height: 248px;
  display: grid;
  place-items: center;
  text-align: center;
  color: rgba(0, 0, 0, 0.56);
}

@media (max-width: 860px) {
  .pdp {
    padding: 14px;
  }

  .pdp-section {
    grid-template-columns: 1fr;
    padding: 22px;
  }
}`;
}

function buildSectionMarkup(guide) {
  const highlight = guide.id === "hero" ? " pdp-section--highlight" : "";
  return `<section class="pdp-section${highlight}">
  <div class="pdp-section__copy">
    <span class="pdp-section__eyebrow">${escapeHtml(guide.title)}</span>
    <h2 class="pdp-section__title">${escapeHtml(guide.headline)}</h2>
    <p class="pdp-section__text">${escapeHtml(guide.body)}</p>
  </div>
  <div class="pdp-section__media">
    <div class="pdp-placeholder">[IMAGEM_${guide.id.toUpperCase()}]<br>${escapeHtml(guide.imageNeed)}</div>
  </div>
</section>`;
}

function renderChecklist() {
  const checklist = [
    "Trocar todos os placeholders de imagem antes de publicar.",
    "Revisar claims técnicos contra a ficha e o fabricante.",
    "Enxugar títulos ou parágrafos que ficaram longos demais.",
    "Confirmar se a ordem dos blocos acompanha a prioridade comercial real.",
    "Testar a página em desktop e mobile antes de subir na plataforma.",
  ];
  elements.finalChecklist.innerHTML = `<ul class="checklist">${checklist.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function activateStep(targetId) {
  document.querySelectorAll(".step").forEach((step) => {
    step.classList.toggle("is-active", step.id === targetId);
  });
  document.querySelectorAll(".step-link").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.stepTarget === targetId);
  });
}

function getValue(id) {
  return document.querySelector(`#${id}`).value.trim();
}

function setValue(id, value) {
  document.querySelector(`#${id}`).value = value || "";
}

function splitLines(text) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean);
}

function shortName(text) {
  return text.split(" ").slice(0, 2).join(" ");
}

function trimWords(text, maxWords) {
  return text.split(" ").slice(0, maxWords).join(" ");
}

function updateSaveStatus(message) {
  elements.saveStatus.textContent = message;
}

async function copyToClipboard(text) {
  if (!text) return;
  await navigator.clipboard.writeText(text);
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
