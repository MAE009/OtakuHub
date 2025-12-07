// Données d'exemple pour les mangas et animes
const mangaAnimeData = [
    {
        id: 1,
        title: "L'Attaque des Titans",
        type: "anime",
        category: "action",
        categories: ["action", "aventure", "drame", "fantasy"],
        description: "Dans un monde où les humains vivent entourés d'immenses murs pour se protéger des Titans, des créatures géantes mystérieuses qui dévorent les humains, l'histoire suit Eren Yeager et ses amis Mikasa et Armin qui rejoignent l'armée pour combattre les Titans après que leur ville ait été détruite et la mère d'Eren dévorée.",
        poster: "https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.8,
        platforms: [
            { name: "Crunchyroll", icon: "fas fa-play-circle", url: "https://www.crunchyroll.com" },
            { name: "Netflix", icon: "fas fa-film", url: "https://www.netflix.com" },
            { name: "Wakanim", icon: "fas fa-tv", url: "https://www.wakanim.tv" }
        ],
        progress: { episode: 12, season: 4, totalEpisodes: 75 }
    },
    {
        id: 2,
        title: "One Piece",
        type: "manga",
        category: "aventure",
        categories: ["aventure", "action", "comedie", "fantasy"],
        description: "Monkey D. Luffy, un jeune garçon, rêve de devenir le Roi des Pirates en trouvant le trésor légendaire, le One Piece. Après avoir mangé un fruit du démon, son corps acquiert les propriétés du caoutchouc. Avec son équipage de pirates, nommé l'équipage du Chapeau de Paille, Luffy explore Grand Line à la recherche du One Piece tout en combattant d'autres pirates.",
        poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.9,
        platforms: [
            { name: "Crunchyroll", icon: "fas fa-play-circle", url: "https://www.crunchyroll.com" },
            { name: "Netflix", icon: "fas fa-film", url: "https://www.netflix.com" }
        ],
        progress: { chapter: 1057, volume: 103, totalChapters: null }
    },
    {
        id: 3,
        title: "Death Note",
        type: "anime",
        category: "drame",
        categories: ["drame", "fantasy", "mystère", "thriller"],
        description: "Light Yagami, un étudiant surdoué, découvre un carnet surnaturel, le Death Note, qui permet à son utilisateur de tuer toute personne dont il écrit le nom, à condition de connaître son visage. Light décide d'utiliser le Death Note pour éliminer les criminels et créer un monde nouveau, purgé du mal. Mais ses actions attirent l'attention du mystérieux détective L.",
        poster: "https://images.unsplash.com/photo-1639322537502-9e1a6b8b1b6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.7,
        platforms: [
            { name: "Netflix", icon: "fas fa-film", url: "https://www.netflix.com" },
            { name: "Crunchyroll", icon: "fas fa-play-circle", url: "https://www.crunchyroll.com" }
        ],
        progress: { episode: 25, season: 1, totalEpisodes: 37 }
    },
    {
        id: 4,
        title: "Demon Slayer",
        type: "anime",
        category: "action",
        categories: ["action", "aventure", "fantasy"],
        description: "Tanjiro Kamado est un jeune garçon qui devient chasseur de démons après que sa famille ait été massacrée par un démon et que sa sœur Nezuko soit transformée en démon. Il rejoint les Pourfendeurs de démons pour venger sa famille et trouver un remède pour sa sœur.",
        poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.8,
        platforms: [
            { name: "Crunchyroll", icon: "fas fa-play-circle", url: "https://www.crunchyroll.com" },
            { name: "Netflix", icon: "fas fa-film", url: "https://www.netflix.com" },
            { name: "Funimation", icon: "fas fa-tv", url: "https://www.funimation.com" }
        ],
        progress: { episode: 18, season: 2, totalEpisodes: 44 }
    },
    {
        id: 5,
        title: "Naruto",
        type: "manga",
        category: "action",
        categories: ["action", "aventure", "comedie"],
        description: "Naruto Uzumaki est un jeune ninja de Konoha qui rêve de devenir Hokage, le chef de son village, pour être reconnu par les autres. Contenant en lui le démon renard à neuf queues, Kyûbi, il est rejeté par les autres villageois. L'histoire suit Naruto et ses amis dans leur croissance en tant que ninjas.",
        poster: "https://images.unsplash.com/photo-1541562232579-512a21360020?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.6,
        platforms: [
            { name: "Crunchyroll", icon: "fas fa-play-circle", url: "https://www.crunchyroll.com" },
            { name: "Netflix", icon: "fas fa-film", url: "https://www.netflix.com" }
        ],
        progress: { chapter: 320, volume: 36, totalChapters: 700 }
    },
    {
        id: 6,
        title: "Your Lie in April",
        type: "anime",
        category: "drame",
        categories: ["drame", "romance", "musique"],
        description: "Kōsei Arima est un pianiste prodige qui a arrêté de jouer après la mort de sa mère. Sa vie monotone change lorsqu'il rencontre la violoniste Kaori Miyazono, une fille libre et énergique qui l'aide à redécouvrir la musique et à affronter son passé.",
        poster: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.7,
        platforms: [
            { name: "Crunchyroll", icon: "fas fa-play-circle", url: "https://www.crunchyroll.com" },
            { name: "Netflix", icon: "fas fa-film", url: "https://www.netflix.com" }
        ],
        progress: { episode: 8, season: 1, totalEpisodes: 22 }
    },
    {
        id: 7,
        title: "My Hero Academia",
        type: "anime",
        category: "action",
        categories: ["action", "comedie", "science-fiction"],
        description: "Dans un monde où 80% de la population possède des super-pouvoirs appelés 'Alters', Izuku Midoriya fait partie des 20% sans pouvoir. Malgré cela, il rêve de devenir un héros. Sa rencontre avec le plus grand héros de tous les temps, All Might, va changer sa vie.",
        poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.5,
        platforms: [
            { name: "Crunchyroll", icon: "fas fa-play-circle", url: "https://www.crunchyroll.com" },
            { name: "Funimation", icon: "fas fa-tv", url: "https://www.funimation.com" }
        ],
        progress: { episode: 24, season: 5, totalEpisodes: 113 }
    },
    {
        id: 8,
        title: "Tokyo Ghoul",
        type: "manga",
        category: "horreur",
        categories: ["horreur", "drame", "fantasy"],
        description: "Ken Kaneki est un étudiant timide qui, après un rendez-vous avec une belle fille, se retrouve transformé en hybride mi-humain mi-ghoul. Il doit apprendre à vivre dans les deux mondes tout en étant poursuivi par les investigateurs qui chassent les ghouls.",
        poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        rating: 4.3,
        platforms: [
            { name: "Crunchyroll", icon: "fas fa-play-circle", url: "https://www.crunchyroll.com" },
            { name: "Netflix", icon: "fas fa-film", url: "https://www.netflix.com" }
        ],
        progress: { chapter: 79, volume: 9, totalChapters: 144 }
    }
];