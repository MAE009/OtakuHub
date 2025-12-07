// Variables globales
let currentFilter = 'all';
let currentCategory = 'all';
let searchQuery = '';
let favorites = JSON.parse(localStorage.getItem('mangaAnimeFavorites')) || [];
let bookmarks = JSON.parse(localStorage.getItem('mangaAnimeBookmarks')) || {};
let filteredData = [...mangaAnimeData];

// Initialisation du site
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les événements
    initEventListeners();
    
    // Afficher tous les éléments au démarrage
    renderItems(mangaAnimeData);
    
    // Initialiser les données utilisateur
    initUserData();
});

// Initialiser les événements
function initEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter') || 'all';
            handleNavFilter(filter);
            
            // Mettre à jour l'état actif
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Fermer le menu mobile s'il est ouvert
            document.querySelector('.mobile-nav').style.display = 'none';
        });
    });
    
    // Boutons favoris et marque-pages
    document.getElementById('favorites-btn').addEventListener('click', function(e) {
        e.preventDefault();
        showFavorites();
    });
    
    document.getElementById('bookmarks-btn').addEventListener('click', function(e) {
        e.preventDefault();
        showBookmarks();
    });
    
    // Boutons mobiles
    document.getElementById('mobile-favorites-btn').addEventListener('click', function(e) {
        e.preventDefault();
        showFavorites();
        document.querySelector('.mobile-nav').style.display = 'none';
    });
    
    document.getElementById('mobile-bookmarks-btn').addEventListener('click', function(e) {
        e.preventDefault();
        showBookmarks();
        document.querySelector('.mobile-nav').style.display = 'none';
    });
    
    // Filtres par catégorie
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            handleCategoryFilter(category);
            
            // Mettre à jour l'état actif
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Recherche
    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('search-input').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Menu mobile
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
        const mobileNav = document.querySelector('.mobile-nav');
        mobileNav.style.display = mobileNav.style.display === 'block' ? 'none' : 'block';
    });
    
    // Fermer les modales
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });
    
    // Fermer les modales en cliquant à l'extérieur
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// Initialiser les données utilisateur
function initUserData() {
    // Initialiser les bookmarks s'ils n'existent pas
    mangaAnimeData.forEach(item => {
        if (!bookmarks[item.id]) {
            bookmarks[item.id] = item.type === 'anime' 
                ? { episode: 1, season: 1 } 
                : { chapter: 1, volume: 1 };
        }
    });
    saveBookmarks();
}

// Gérer le filtre de navigation (tous, animes, mangas)
function handleNavFilter(filter) {
    currentFilter = filter;
    applyFilters();
}

// Gérer le filtre par catégorie
function handleCategoryFilter(category) {
    currentCategory = category;
    applyFilters();
}

// Appliquer tous les filtres
function applyFilters() {
    let result = mangaAnimeData;
    
    // Filtrer par type (anime/manga)
    if (currentFilter !== 'all') {
        result = result.filter(item => item.type === currentFilter);
    }
    
    // Filtrer par catégorie
    if (currentCategory !== 'all') {
        result = result.filter(item => item.categories.includes(currentCategory));
    }
    
    // Appliquer la recherche
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query) ||
            item.categories.some(cat => cat.toLowerCase().includes(query))
        );
    }
    
    filteredData = result;
    
    // Mettre à jour le titre
    updateContentTitle();
    
    // Afficher les résultats
    renderItems(result);
}

// Effectuer une recherche
function performSearch() {
    searchQuery = document.getElementById('search-input').value.trim();
    applyFilters();
}

// Afficher les favoris
function showFavorites() {
    const favoritesData = mangaAnimeData.filter(item => favorites.includes(item.id));
    filteredData = favoritesData;
    
    // Mettre à jour le titre
    document.getElementById('content-title').textContent = 'Vos favoris';
    
    // Afficher les favoris
    renderItems(favoritesData);
    
    // Mettre à jour la navigation active
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
    });
}

// Afficher les marque-pages
function showBookmarks() {
    const bookmarkedIds = Object.keys(bookmarks).map(id => parseInt(id));
    const bookmarkedData = mangaAnimeData.filter(item => bookmarkedIds.includes(item.id));
    filteredData = bookmarkedData;
    
    // Mettre à jour le titre
    document.getElementById('content-title').textContent = 'Vos marque-pages';
    
    // Afficher les marque-pages
    renderItems(bookmarkedData);
    
    // Mettre à jour la navigation active
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
    });
}

// Mettre à jour le titre du contenu
function updateContentTitle() {
    const titleElement = document.getElementById('content-title');
    let title = '';
    
    if (currentFilter === 'all' && currentCategory === 'all' && !searchQuery) {
        title = 'Tous les mangas et animes';
    } else if (currentFilter !== 'all' && currentCategory === 'all') {
        title = currentFilter === 'anime' ? 'Tous les animes' : 'Tous les mangas';
    } else if (currentCategory !== 'all' && currentFilter === 'all') {
        title = `Catégorie: ${currentCategory}`;
    } else if (currentFilter !== 'all' && currentCategory !== 'all') {
        title = `${currentFilter === 'anime' ? 'Animes' : 'Mangas'} - Catégorie: ${currentCategory}`;
    }
    
    if (searchQuery) {
        title = `Résultats pour "${searchQuery}"`;
    }
    
    titleElement.textContent = title;
}

// Rendre les éléments (cartes) dans la grille
function renderItems(items) {
    const itemsGrid = document.getElementById('items-grid');
    
    if (items.length === 0) {
        itemsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Aucun résultat trouvé</h3>
                <p>Essayez de modifier vos filtres ou votre recherche</p>
            </div>
        `;
        return;
    }
    
    itemsGrid.innerHTML = items.map(item => createItemCard(item)).join('');
    
    // Ajouter les événements aux cartes
    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            openItemModal(itemId);
        });
    });
    
    // Ajouter les événements aux boutons d'action
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemId = parseInt(this.getAttribute('data-id'));
            toggleFavorite(itemId);
        });
    });
    
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const itemId = parseInt(this.getAttribute('data-id'));
            openBookmarkModal(itemId);
        });
    });
}

// Créer une carte d'élément
function createItemCard(item) {
    const isFavorite = favorites.includes(item.id);
    const bookmarkData = bookmarks[item.id] || {};
    
    return `
        <div class="item-card" data-id="${item.id}">
            <img src="${item.poster}" alt="${item.title}" class="item-image">
            <div class="item-content">
                <h3 class="item-title">${item.title}</h3>
                <span class="item-category">${item.category}</span>
                <p class="item-description">${item.description}</p>
                <div class="item-footer">
                    <span class="item-type">${item.type === 'anime' ? 'Anime' : 'Manga'}</span>
                    <div class="item-actions">
                        <button class="action-btn favorite-btn ${isFavorite ? 'active' : ''}" data-id="${item.id}" title="${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="action-btn bookmark-btn ${bookmarkData ? 'active' : ''}" data-id="${item.id}" title="Marquer la progression">
                            <i class="fas fa-bookmark"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Ouvrir le modal d'un élément
function openItemModal(itemId) {
    const item = mangaAnimeData.find(i => i.id === itemId);
    if (!item) return;
    
    const modalBody = document.getElementById('modal-body');
    const isFavorite = favorites.includes(item.id);
    const bookmarkData = bookmarks[item.id] || {};
    
    // Générer le HTML des plateformes
    const platformsHTML = item.platforms.map(platform => `
        <a href="${platform.url}" target="_blank" class="platform">
            <i class="${platform.icon}"></i>
            <span>${platform.name}</span>
        </a>
    `).join('');
    
    // Générer le HTML de progression
    let progressHTML = '';
    if (item.type === 'anime') {
        progressHTML = `
            <div class="progress-section">
                <h3>Votre progression</h3>
                <p>Vous êtes à l'épisode ${bookmarkData.episode || 1} de la saison ${bookmarkData.season || 1}</p>
                <div class="progress-controls">
                    <input type="number" id="episode-input" class="progress-input" min="1" max="${item.progress.totalEpisodes || 100}" value="${bookmarkData.episode || 1}">
                    <span>Épisode</span>
                    <input type="number" id="season-input" class="progress-input" min="1" max="10" value="${bookmarkData.season || 1}">
                    <span>Saison</span>
                    <button class="progress-btn" id="save-progress-btn" data-id="${item.id}">Sauvegarder</button>
                </div>
            </div>
        `;
    } else {
        progressHTML = `
            <div class="progress-section">
                <h3>Votre progression</h3>
                <p>Vous êtes au chapitre ${bookmarkData.chapter || 1}, volume ${bookmarkData.volume || 1}</p>
                <div class="progress-controls">
                    <input type="number" id="chapter-input" class="progress-input" min="1" max="${item.progress.totalChapters || 1000}" value="${bookmarkData.chapter || 1}">
                    <span>Chapitre</span>
                    <input type="number" id="volume-input" class="progress-input" min="1" max="${item.progress.volume || 100}" value="${bookmarkData.volume || 1}">
                    <span>Volume</span>
                    <button class="progress-btn" id="save-progress-btn" data-id="${item.id}">Sauvegarder</button>
                </div>
            </div>
        `;
    }
    
    modalBody.innerHTML = `
        <div class="modal-header">
            <img src="${item.poster}" alt="${item.title}" class="modal-poster">
            <div class="modal-info">
                <h2 class="modal-title">${item.title}</h2>
                <div class="modal-meta">
                    <span class="modal-category">${item.category}</span>
                    <span class="modal-type">${item.type === 'anime' ? 'Anime' : 'Manga'}</span>
                    <span class="modal-rating"><i class="fas fa-star"></i> ${item.rating}/5</span>
                </div>
                <p class="modal-description">${item.description}</p>
                <div class="item-actions">
                    <button class="action-btn favorite-btn ${isFavorite ? 'active' : ''}" data-id="${item.id}" title="${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
                        <i class="fas fa-heart"></i> ${isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    </button>
                    <button class="action-btn bookmark-btn ${bookmarkData ? 'active' : ''}" data-id="${item.id}" title="Marquer la progression">
                        <i class="fas fa-bookmark"></i> Marquer la progression
                    </button>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h3>Où regarder/lire</h3>
            <div class="platforms">
                ${platformsHTML}
            </div>
        </div>
        
        ${progressHTML}
    `;
    
    // Ouvrir le modal
    document.getElementById('item-modal').style.display = 'block';
    
    // Ajouter les événements dans le modal
    document.querySelector('.modal .favorite-btn').addEventListener('click', function() {
        const itemId = parseInt(this.getAttribute('data-id'));
        toggleFavorite(itemId);
        
        // Mettre à jour l'état du bouton dans le modal
        const isNowFavorite = favorites.includes(itemId);
        this.classList.toggle('active', isNowFavorite);
        this.innerHTML = `<i class="fas fa-heart"></i> ${isNowFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}`;
        
        // Mettre à jour l'état du bouton dans la grille
        const gridBtn = document.querySelector(`.item-card[data-id="${itemId}"] .favorite-btn`);
        if (gridBtn) {
            gridBtn.classList.toggle('active', isNowFavorite);
        }
    });
    
    document.querySelector('.modal .bookmark-btn').addEventListener('click', function() {
        const itemId = parseInt(this.getAttribute('data-id'));
        openBookmarkModal(itemId);
    });
    
    document.getElementById('save-progress-btn').addEventListener('click', function() {
        const itemId = parseInt(this.getAttribute('data-id'));
        saveProgress(itemId);
    });
}

// Ouvrir le modal de marque-page
function openBookmarkModal(itemId) {
    const item = mangaAnimeData.find(i => i.id === itemId);
    if (!item) return;
    
    const actionsModalBody = document.getElementById('actions-modal-body');
    const bookmarkData = bookmarks[item.id] || {};
    
    let content = '';
    if (item.type === 'anime') {
        content = `
            <h3>Marquer la progression - ${item.title}</h3>
            <div class="progress-controls">
                <label for="modal-episode-input">Épisode:</label>
                <input type="number" id="modal-episode-input" class="progress-input" min="1" max="${item.progress.totalEpisodes || 100}" value="${bookmarkData.episode || 1}">
                
                <label for="modal-season-input">Saison:</label>
                <input type="number" id="modal-season-input" class="progress-input" min="1" max="10" value="${bookmarkData.season || 1}">
                
                <button class="progress-btn" id="modal-save-progress-btn" data-id="${item.id}">Sauvegarder</button>
            </div>
        `;
    } else {
        content = `
            <h3>Marquer la progression - ${item.title}</h3>
            <div class="progress-controls">
                <label for="modal-chapter-input">Chapitre:</label>
                <input type="number" id="modal-chapter-input" class="progress-input" min="1" max="${item.progress.totalChapters || 1000}" value="${bookmarkData.chapter || 1}">
                
                <label for="modal-volume-input">Volume:</label>
                <input type="number" id="modal-volume-input" class="progress-input" min="1" max="${item.progress.volume || 100}" value="${bookmarkData.volume || 1}">
                
                <button class="progress-btn" id="modal-save-progress-btn" data-id="${item.id}">Sauvegarder</button>
            </div>
        `;
    }
    
    actionsModalBody.innerHTML = content;
    
    // Ouvrir le modal
    document.getElementById('actions-modal').style.display = 'block';
    
    // Ajouter l'événement au bouton de sauvegarde
    document.getElementById('modal-save-progress-btn').addEventListener('click', function() {
        const itemId = parseInt(this.getAttribute('data-id'));
        saveProgress(itemId, true);
    });
}

// Basculer un favori
function toggleFavorite(itemId) {
    const index = favorites.indexOf(itemId);
    
    if (index === -1) {
        favorites.push(itemId);
    } else {
        favorites.splice(index, 1);
    }
    
    saveFavorites();
    
    // Mettre à jour l'affichage si on est dans la vue des favoris
    if (document.getElementById('content-title').textContent === 'Vos favoris') {
        showFavorites();
    }
}

// Sauvegarder la progression
function saveProgress(itemId, fromMiniModal = false) {
    const item = mangaAnimeData.find(i => i.id === itemId);
    if (!item) return;
    
    if (item.type === 'anime') {
        let episode, season;
        
        if (fromMiniModal) {
            episode = parseInt(document.getElementById('modal-episode-input').value);
            season = parseInt(document.getElementById('modal-season-input').value);
        } else {
            episode = parseInt(document.getElementById('episode-input').value);
            season = parseInt(document.getElementById('season-input').value);
        }
        
        bookmarks[itemId] = { episode, season };
    } else {
        let chapter, volume;
        
        if (fromMiniModal) {
            chapter = parseInt(document.getElementById('modal-chapter-input').value);
            volume = parseInt(document.getElementById('modal-volume-input').value);
        } else {
            chapter = parseInt(document.getElementById('chapter-input').value);
            volume = parseInt(document.getElementById('volume-input').value);
        }
        
        bookmarks[itemId] = { chapter, volume };
    }
    
    saveBookmarks();
    
    // Fermer le modal des actions s'il est ouvert
    if (fromMiniModal) {
        document.getElementById('actions-modal').style.display = 'none';
    }
    
    // Mettre à jour l'état des boutons de marque-page
    const bookmarkBtns = document.querySelectorAll(`.bookmark-btn[data-id="${itemId}"]`);
    bookmarkBtns.forEach(btn => {
        btn.classList.add('active');
    });
    
    // Actualiser l'affichage si on est dans la vue des marque-pages
    if (document.getElementById('content-title').textContent === 'Vos marque-pages') {
        showBookmarks();
    }
}

// Sauvegarder les favoris dans le localStorage
function saveFavorites() {
    localStorage.setItem('mangaAnimeFavorites', JSON.stringify(favorites));
}

// Sauvegarder les marque-pages dans le localStorage
function saveBookmarks() {
    localStorage.setItem('mangaAnimeBookmarks', JSON.stringify(bookmarks));
}

// Ajout de styles pour les résultats vides
const style = document.createElement('style');
style.textContent = `
    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: #aaa;
    }
    
    .no-results i {
        font-size: 4rem;
        margin-bottom: 20px;
        color: var(--primary-color);
    }
    
    .no-results h3 {
        font-size: 2rem;
        margin-bottom: 10px;
        color: white;
    }
    
    .no-results p {
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);