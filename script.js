// app.js
document.addEventListener("DOMContentLoaded", () => {
  // --- Données de démonstration ---
  const DATA = [
    {
      id: "aot",
      title: "Attack on Titan",
      categories: ["Action", "Drame", "Dark Fantasy"],
      description:
        "Dans un monde assiégé par des Titans mangeurs d'humains, Eren et ses amis rejoignent l'armée pour découvrir la vérité.",
      poster: "https://picsum.photos/seed/aot/400/600",
      platforms: [
        { name: "Crunchyroll", url: "https://www.crunchyroll.com" },
        { name: "Netflix", url: "https://www.netflix.com" }
      ]
    },
    {
      id: "op",
      title: "One Piece",
      categories: ["Aventure", "Action", "Comédie"],
      description:
        "Luffy et son équipage voguent sur Grand Line pour trouver le One Piece et devenir le Roi des Pirates.",
      poster: "https://picsum.photos/seed/onepiece/400/600",
      platforms: [
        { name: "Crunchyroll", url: "https://www.crunchyroll.com" },
        { name: "ADN", url: "https://www.animationdigitalnetwork.fr" }
      ]
    },
    {
      id: "ds",
      title: "Demon Slayer",
      categories: ["Action", "Surnaturel"],
      description:
        "Tanjiro combat des démons pour sauver sa soeur et venger sa famille, rejoint par de nouveaux alliés.",
      poster: "https://picsum.photos/seed/demonslayer/400/600",
      platforms: [
        { name: "Crunchyroll", url: "https://www.crunchyroll.com" },
        { name: "Prime Video", url: "https://www.primevideo.com" }
      ]
    },
    {
      id: "mha",
      title: "My Hero Academia",
      categories: ["Action", "Super-héros", "Scolaire"],
      description:
        "Dans un monde où les Alters sont la norme, Izuku rêve de devenir le plus grand héros.",
      poster: "https://picsum.photos/seed/mha/400/600",
      platforms: [
        { name: "Crunchyroll", url: "https://www.crunchyroll.com" }
      ]
    },
    {
      id: "jjk",
      title: "Jujutsu Kaisen",
      categories: ["Action", "Occulte"],
      description:
        "Yuji Itadori rejoint une école d'exorcistes pour contrer des fléaux et contenir Sukuna.",
      poster: "https://picsum.photos/seed/jjk/400/600",
      platforms: [
        { name: "Crunchyroll", url: "https://www.crunchyroll.com" }
      ]
    },
    {
      id: "ghibli",
      title: "Le Voyage de Chihiro",
      categories: ["Fantastique", "Film"],
      description:
        "Chihiro se retrouve piégée dans un monde d'esprits et doit retrouver ses parents transformés.",
      poster: "https://picsum.photos/seed/chihiro/400/600",
      platforms: [
        { name: "Netflix", url: "https://www.netflix.com" }
      ]
    },
    {
      id: "fmab",
      title: "Fullmetal Alchemist: Brotherhood",
      categories: ["Action", "Aventure", "Drame"],
      description:
        "Les frères Elric cherchent la Pierre Philosophale après une transmutation interdite qui a mal tourné.",
      poster: "https://picsum.photos/seed/fmab/400/600",
      platforms: [
        { name: "ADN", url: "https://www.animationdigitalnetwork.fr" },
        { name: "Prime Video", url: "https://www.primevideo.com" }
      ]
    },
    {
      id: "opm",
      title: "One Punch Man",
      categories: ["Action", "Comédie", "Super-héros"],
      description:
        "Saitama, héros par hobby, terrasse ses ennemis d'un seul coup de poing et s'ennuie terriblement.",
      poster: "https://picsum.photos/seed/opm/400/600",
      platforms: [
        { name: "Netflix", url: "https://www.netflix.com" }
      ]
    }
  ];

  // --- Etat & persistance ---
  const LS_KEYS = {
    favorites: "otakulib:favorites",
    progress: "otakulib:progress"
  };
  const state = {
    search: "",
    category: "Tous",
    favoritesOnly: false,
    markedOnly: false
  };

  function loadFavorites(){
    try { return JSON.parse(localStorage.getItem(LS_KEYS.favorites)) || []; }
    catch { return []; }
  }
  function saveFavorites(arr){
    localStorage.setItem(LS_KEYS.favorites, JSON.stringify(arr));
  }
  function loadProgress(){
    try { return JSON.parse(localStorage.getItem(LS_KEYS.progress)) || {}; }
    catch { return {}; }
  }
  function saveProgress(obj){
    localStorage.setItem(LS_KEYS.progress, JSON.stringify(obj));
  }

  let favorites = loadFavorites();
  let progress = loadProgress();

  // --- DOM refs ---
  const chipsWrap = document.getElementById("categoryChips");
  const grid = document.getElementById("grid");
  const noResults = document.getElementById("noResults");
  const searchInput = document.getElementById("searchInput");
  const toggleFav = document.getElementById("toggleFav");
  const toggleMarked = document.getElementById("toggleMarked");

  // --- Catégories ---
  const categories = Array.from(
    new Set(DATA.flatMap(a => a.categories))
  ).sort();
  categories.unshift("Tous");

  function buildCategoryChips(){
    chipsWrap.innerHTML = "";
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "chip";
      btn.type = "button";
      btn.textContent = cat;
      btn.setAttribute("data-cat", cat);
      if(cat === state.category) btn.classList.add("active");
      btn.addEventListener("click", () => {
        state.category = cat;
        [...chipsWrap.querySelectorAll(".chip")].forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        render();
      });
      chipsWrap.appendChild(btn);
    });
  }

  // --- Rendering ---
  function matchSearch(item, q){
    if(!q) return true;
    const s = q.toLowerCase();
    const hay = [
      item.title,
      ...item.categories,
      item.description
    ].join(" ").toLowerCase();
    return hay.includes(s);
  }

  function filterData(){
    return DATA.filter(item => {
      if(state.category !== "Tous" && !item.categories.includes(state.category)) return false;
      if(!matchSearch(item, state.search)) return false;
      if(state.favoritesOnly && !favorites.includes(item.id)) return false;
      if(state.markedOnly && !progress[item.id]) return false;
      return true;
    });
  }

  function cardTemplate(item){
    const fav = favorites.includes(item.id);
    const prog = progress[item.id];
    const progText = prog ? `S${prog.season} · E${prog.episode}` : "Non marqué";
    const progClass = prog ? "pill" : "pill empty";

    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("data-id", item.id);

    // Poster
    const poster = document.createElement("div");
    poster.className = "poster";
    const img = document.createElement("img");
    img.src = item.poster;
    img.alt = `Affiche de ${item.title}`;
    poster.appendChild(img);

    // Badges (premières catégories)
    const badges = document.createElement("div");
    badges.className = "badges";
    item.categories.slice(0, 3).forEach(cat => {
      const b = document.createElement("span");
      b.className = "badge";
      b.textContent = cat;
      badges.appendChild(b);
    });
    poster.appendChild(badges);

    // Body
    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("div");
    title.className = "card-title";
    const h3 = document.createElement("h3");
    h3.textContent = item.title;
    const favBtn = document.createElement("button");
    favBtn.className = "fav-btn";
    favBtn.setAttribute("aria-label", "Basculer favori");
    favBtn.innerHTML = fav ? "❤" : "♡";
    if(fav) favBtn.classList.add("fav-on");
    favBtn.addEventListener("click", e => {
      e.stopPropagation();
      toggleFavorite(item.id, favBtn);
    });
    title.appendChild(h3);
    title.appendChild(favBtn);

    const desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = item.description;

    // Platforms
    const plats = document.createElement("div");
    plats.className = "platforms";
    item.platforms.forEach(p => {
      const a = document.createElement("a");
      a.className = "platform";
      a.href = p.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("data-name", p.name);
      const dot = document.createElement("span");
      dot.className = "dot";
      a.appendChild(dot);
      const span = document.createElement("span");
      span.textContent = p.name;
      a.appendChild(span);
      plats.appendChild(a);
    });

    // Progress
    const progWrap = document.createElement("div");
    progWrap.className = "progress";
    const pill = document.createElement("span");
    pill.className = progClass;
    pill.textContent = `Progression: ${progText}`;
    const progBtn = document.createElement("button");
    progBtn.className = "btn ghost";
    progBtn.textContent = "Mettre à jour";
    progBtn.addEventListener("click", e => {
      e.stopPropagation();
      openProgressModal(item.id);
    });
    progWrap.appendChild(pill);
    progWrap.appendChild(progBtn);

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(plats);
    body.appendChild(progWrap);

    card.appendChild(poster);
    card.appendChild(body);
    return card;
  }

  function render(){
    const items = filterData();
    grid.innerHTML = "";
    if(items.length === 0){
      noResults.hidden = false;
      return;
    }
    noResults.hidden = true;
    const fragment = document.createDocumentFragment();
    items.forEach(it => fragment.appendChild(cardTemplate(it)));
    grid.appendChild(fragment);
    // update toggles visual state
    toggleFav.setAttribute("aria-pressed", String(state.favoritesOnly));
    toggleMarked.setAttribute("aria-pressed", String(state.markedOnly));
  }

  // --- Favoris ---
  function toggleFavorite(id, btn){
    const idx = favorites.indexOf(id);
    if(idx >= 0){ favorites.splice(idx, 1); }
    else { favorites.push(id); }
    saveFavorites(favorites);
    if(btn){
      const isFav = favorites.includes(id);
      btn.innerHTML = isFav ? "❤" : "♡";
      btn.classList.toggle("fav-on", isFav);
    }
    if(state.favoritesOnly){ render(); }
  }

  // --- Modal Progression ---
  const modal = document.getElementById("progressModal");
  const seasonInput = document.getElementById("seasonInput");
  const episodeInput = document.getElementById("episodeInput");
  const progressForm = document.getElementById("progressForm");
  const cancelProgress = document.getElementById("cancelProgress");
  let currentProgressId = null;

  function openProgressModal(id){
    currentProgressId = id;
    const p = progress[id];
    seasonInput.value = p ? p.season : 1;
    episodeInput.value = p ? p.episode : 1;
    modal.hidden = false;
  }
  function closeProgressModal(){
    modal.hidden = true;
    currentProgressId = null;
  }

  modal.addEventListener("click", e => {
    if(e.target === modal) closeProgressModal();
  });
  cancelProgress.addEventListener("click", () => closeProgressModal());

  progressForm.addEventListener("submit", e => {
    e.preventDefault();
    if(!currentProgressId) return;
    const season = Math.max(1, parseInt(seasonInput.value, 10) || 1);
    const episode = Math.max(1, parseInt(episodeInput.value, 10) || 1);
    progress[currentProgressId] = {
      season, episode, updatedAt: new Date().toISOString()
    };
    saveProgress(progress);
    closeProgressModal();
    render();
  });

  // --- Recherche (debounce) ---
  let timer = null;
  searchInput.addEventListener("input", (e) => {
    const val = e.target.value;
    if(timer) clearTimeout(timer);
    timer = setTimeout(() => {
      state.search = val.trim();
      render();
    }, 180);
  });

  // --- Toggles ---
  toggleFav.addEventListener("click", () => {
    state.favoritesOnly = !state.favoritesOnly;
    render();
  });
  toggleMarked.addEventListener("click", () => {
    state.markedOnly = !state.markedOnly;
    render();
  });

  // --- Init ---
  buildCategoryChips();
  render();
});
