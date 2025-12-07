// Sample prototype data. Remplace par ton backend plus tard.
const data = [
  {
    id: "m01",
    title: "Kaze no Yoru",
    type: "Animé",
    categories: ["Action","Aventure"],
    description: "Un jeune héros découvre le pouvoir du vent et part sauver son village.",
    poster: "https://picsum.photos/seed/kaze/800/1200",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ", // remplacer si besoin
    platforms: [
      {name:"CrunchyStream", url:"#", icon:"stream"},
      {name:"MangaPlay", url:"#", icon:"book"}
    ]
  },
  {
    id: "m02",
    title: "Sakura Moon",
    type: "Manga",
    categories: ["Drame","Romance"],
    description: "Une histoire d'amour au fil des saisons et des cerisiers.",
    poster: "https://picsum.photos/seed/sakura/800/1200",
    trailer: "",
    platforms: [
      {name:"MangaNet", url:"#", icon:"book"}
    ]
  },
  {
    id: "m03",
    title: "Mecha Titans",
    type: "Animé",
    categories: ["Mecha","Science-Fiction"],
    description: "Pilotes et robots géants dans une lutte pour la survie de la Terre.",
    poster: "https://picsum.photos/seed/mecha/800/1200",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    platforms: [
      {name:"StreamX", url:"#", icon:"stream"},
      {name:"RentIt", url:"#", icon:"store"}
    ]
  }
];

// LocalStorage keys
const LS_FAV = "otakuhub_favs_v1";
const LS_MARK = "otakuhub_mark_v1";

let favs = new Set(JSON.parse(localStorage.getItem(LS_FAV) || "[]"));
let marks = JSON.parse(localStorage.getItem(LS_MARK) || "{}"); // {id: {episode:"S1E4"}}

const catalogEl = document.getElementById("catalog");
const searchEl = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const markedOnlyBtn = document.getElementById("markedOnlyBtn");
const modal = document.getElementById("detailModal");
const detailBody = document.getElementById("detailBody");
const closeModal = document.getElementById("closeModal");

let showMarkedOnly = false;

// Init categories dropdown
function initCategories(){
  const cats = new Set();
  data.forEach(d => d.categories.forEach(c => cats.add(c)));
  Array.from(cats).sort().forEach(c => {
    const opt = document.createElement("option");
    opt.value = c; opt.textContent = c;
    categoryFilter.appendChild(opt);
  });
}

// Render catalog cards
function renderCatalog(){
  const q = searchEl.value.trim().toLowerCase();
  const chosenCat = categoryFilter.value;
  catalogEl.innerHTML = "";

  const list = data.filter(item => {
    if (showMarkedOnly && !marks[item.id]) return false;
    if (chosenCat && !item.categories.includes(chosenCat)) return false;
    if (!q) return true;
    return (item.title + " " + item.description + " " + item.categories.join(" ")).toLowerCase().includes(q);
  });

  if (list.length === 0){
    catalogEl.innerHTML = `<div class="empty" style="padding:40px;color:var(--muted)">Aucun résultat</div>`;
    return;
  }

  list.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="poster" style="background-image:url('${item.poster}')">
        <div class="badges">
          <span class="badge">${item.type}</span>
          <span class="badge">${item.categories[0] || ""}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="title">
          <h3>${item.title}</h3>
          <div style="text-align:right">
            <div class="meta">${item.categories.join(" • ")}</div>
            <div class="meta" style="font-size:12px">${marks[item.id] ? "Dernier: "+marks[item.id].last : ""}</div>
          </div>
        </div>
        <p class="desc">${item.description}</p>
        <div class="actions">
          <button class="btn" data-id="${item.id}" data-action="open">Détails</button>
          <button class="btn" data-id="${item.id}" data-action="fav">${favs.has(item.id) ? "♥ Favori" : "♡ Favori"}</button>
          <button class="btn primary" data-id="${item.id}" data-action="mark">${marks[item.id] ? "Modifier marq." : "Marquer progrès"}</button>
        </div>
      </div>
    `;
    catalogEl.appendChild(card);
  });
}

// Toggle favorite and save
function toggleFav(id){
  if (favs.has(id)) favs.delete(id);
  else favs.add(id);
  localStorage.setItem(LS_FAV, JSON.stringify(Array.from(favs)));
  renderCatalog();
}

// Open detail modal
function openDetail(id){
  const item = data.find(d => d.id === id);
  if (!item) return;
  modal.setAttribute("aria-hidden", "false");

  const last = marks[id] ? marks[id].last : "";

  detailBody.innerHTML = `
    <div class="detail-grid">
      <div>
        <div class="detail-poster" style="background-image:url('${item.poster}')"></div>
        <div style="margin-top:12px;">
          <div class="meta">Plateformes:</div>
          <div class="platforms">${item.platforms.map(p => platformHTML(p)).join("")}</div>
        </div>
      </div>
      <div>
        <h2>${item.title}</h2>
        <div class="meta">${item.categories.join(" • ")}</div>
        <p style="margin-top:12px">${item.description}</p>
        ${item.trailer ? `<div style="margin-top:12px"><iframe width="100%" height="250" src="${item.trailer}" frameborder="0" allowfullscreen></iframe></div>` : ""}
        <div class="progress">
          <label style="min-width:90px">Dernier épisode / saison :</label>
          <input id="lastInput" placeholder="ex: S1E4 ou Ep.12" value="${last}" />
          <button id="saveMarkBtn" class="btn primary">Enregistrer</button>
          <button id="clearMarkBtn" class="btn">Supprimer</button>
        </div>
      </div>
    </div>
  `;

  // Attach events inside modal
  document.getElementById("saveMarkBtn").addEventListener("click", () => {
    const val = document.getElementById("lastInput").value.trim();
    if (!val) return alert("Entrez un épisode ou saison (ex: S1E4).");
    marks[id] = { last: val, date: new Date().toISOString() };
    localStorage.setItem(LS_MARK, JSON.stringify(marks));
    renderCatalog();
    modal.setAttribute("aria-hidden", "true");
  });

  document.getElementById("clearMarkBtn").addEventListener("click", () => {
    delete marks[id];
    localStorage.setItem(LS_MARK, JSON.stringify(marks));
    renderCatalog();
    modal.setAttribute("aria-hidden", "true");
  });
}

// HTML for platform icons (simple inline SVGs)
function platformHTML(p){
  const icons = {
    stream: `<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="14" x="2" y="5" rx="2" stroke="currentColor"/></svg>`,
    book: `<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19.5V5a2 2 0 012-2h11" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 19.5a2 2 0 00-2-2H6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    store: `<svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9l1-2h16l1 2" stroke="currentColor"/><path d="M21 9v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9" stroke="currentColor"/></svg>`
  };
  const ic = icons[p.icon] || icons.book;
  return `<a class="platform" href="${p.url}" target="_blank" rel="noopener noreferrer">${ic}<span>${p.name}</span></a>`;
}

// Setup events
document.addEventListener("click", (e) => {
  const actionBtn = e.target.closest("[data-action]");
  if (actionBtn){
    const id = actionBtn.dataset.id;
    const action = actionBtn.dataset.action;
    if (action === "fav") toggleFav(id);
    if (action === "open") openDetail(id);
    if (action === "mark") openDetail(id);
  }
});

searchEl.addEventListener("input", renderCatalog);
categoryFilter.addEventListener("change", renderCatalog);

markedOnlyBtn.addEventListener("click", () => {
  showMarkedOnly = !showMarkedOnly;
  markedOnlyBtn.classList.toggle("active", showMarkedOnly);
  markedOnlyBtn.textContent = showMarkedOnly ? "Marqués uniquement" : "Voir marqués";
  renderCatalog();
});

// close modal
closeModal.addEventListener("click", () => modal.setAttribute("aria-hidden","true"));
modal.addEventListener("click", (ev) => {
  if (ev.target === modal) modal.setAttribute("aria-hidden","true");
});

// init
initCategories();
renderCatalog();
