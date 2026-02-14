// Variables globales
let currentProfile = null;
let profiles = [];
let games = [];
let platforms = [];
let currentSection = 'dashboard';

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si estamos en la página de carga o principal
    if (document.querySelector('.loading-page')) {
        initLoadingPage();
    } else {
        initMainPage();
    }
});

// Inicializar página de carga
function initLoadingPage() {
    const loadingProgress = document.getElementById('loadingProgress');
    const loadingText = document.getElementById('loadingText');
    const profilesSection = document.getElementById('profilesSection');
    const loginForm = document.getElementById('loginForm');
    const newProfileBtn = document.getElementById('newProfileBtn');
    const cancelProfileBtn = document.getElementById('cancelProfileBtn');
    const profileForm = document.getElementById('profileForm');
    
    // Simular carga del sistema
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 10;
        loadingProgress.style.width = `${progress}%`;
        
        if (progress === 30) loadingText.textContent = 'Cargando módulos...';
        if (progress === 60) loadingText.textContent = 'Inicializando base de datos...';
        if (progress === 90) loadingText.textContent = 'Cargando perfiles...';
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            loadingText.textContent = '¡Listo!';
            
            // Mostrar selección de perfiles después de 500ms
            setTimeout(() => {
                loadProfiles();
                profilesSection.style.display = 'block';
            }, 500);
        }
    }, 200);
    
    // Event listeners
    newProfileBtn.addEventListener('click', () => {
        profilesSection.style.display = 'none';
        loginForm.style.display = 'block';
    });
    
    cancelProfileBtn.addEventListener('click', () => {
        loginForm.style.display = 'none';
        profilesSection.style.display = 'block';
        profileForm.reset();
    });
    
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        createNewProfile();
    });
}

// Cargar perfiles existentes
function loadProfiles() {
    const profilesList = document.getElementById('profilesList');
    profilesList.innerHTML = '';
    
    // Cargar perfiles de localStorage
    const storedProfiles = localStorage.getItem('gameProfiles');
    if (storedProfiles) {
        profiles = JSON.parse(storedProfiles);
    } else {
        // Crear perfil por defecto si no hay ninguno
        const defaultProfile = {
            id: 1,
            name: 'Jugador',
            age: 25,
            email: 'jugador@ejemplo.com',
            phone: '',
            photo: '',
            createdAt: new Date().toISOString()
        };
        profiles = [defaultProfile];
        localStorage.setItem('gameProfiles', JSON.stringify(profiles));
    }
    
    // Mostrar perfiles
    profiles.forEach(profile => {
        const profileItem = document.createElement('div');
        profileItem.className = 'profile-item';
        profileItem.innerHTML = `
            <div class="profile-avatar-small">
                <img src="${profile.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name) + '&background=6c5ce7&color=fff'}" alt="${profile.name}">
            </div>
            <div class="profile-info-small">
                <h3>${profile.name}</h3>
                <p>${profile.age} años • ${profile.email}</p>
            </div>
        `;
        
        profileItem.addEventListener('click', () => {
            selectProfile(profile.id);
        });
        
        profilesList.appendChild(profileItem);
    });
}

// Crear nuevo perfil
function createNewProfile() {
    const name = document.getElementById('profileName').value;
    const age = document.getElementById('profileAge').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    const photo = document.getElementById('profilePhoto').value;
    
    const newProfile = {
        id: profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1,
        name,
        age: parseInt(age),
        email,
        phone,
        photo,
        createdAt: new Date().toISOString()
    };
    
    profiles.push(newProfile);
    localStorage.setItem('gameProfiles', JSON.stringify(profiles));
    
    // Seleccionar el nuevo perfil y redirigir
    selectProfile(newProfile.id);
}

// Seleccionar perfil y redirigir a la página principal
function selectProfile(profileId) {
    const selectedProfile = profiles.find(p => p.id === profileId);
    if (selectedProfile) {
        localStorage.setItem('currentProfile', JSON.stringify(selectedProfile));
        // Redirigir a la página principal
        window.location.href = 'main.html';
    }
}

// Inicializar página principal
function initMainPage() {
    // Cargar perfil actual
    const storedProfile = localStorage.getItem('currentProfile');
    if (storedProfile) {
        currentProfile = JSON.parse(storedProfile);
        updateProfileDisplay();
    } else {
        // Si no hay perfil, redirigir a la página de carga
        window.location.href = 'index.html';
        return;
    }
    
    // Cargar datos
    loadPlatforms();
    loadGames();
    
    // Configurar navegación
    setupNavigation();
    
    // Configurar eventos
    setupEventListeners();
    
    // Mostrar sección actual
    showSection(currentSection);
}

// Actualizar visualización del perfil
function updateProfileDisplay() {
    if (!currentProfile) return;
    
    document.getElementById('currentProfileName').textContent = currentProfile.name;
    document.getElementById('currentProfileEmail').textContent = currentProfile.email;
    
    const avatar = document.getElementById('currentProfileAvatar').querySelector('img');
    avatar.src = currentProfile.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentProfile.name) + '&background=6c5ce7&color=fff';
    avatar.alt = currentProfile.name;
}

// Configurar navegación
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remover clase active de todos los enlaces
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Agregar clase active al enlace clickeado
            link.classList.add('active');
            
            // Mostrar sección correspondiente
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
    
    // Configurar botón de logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('currentProfile');
        window.location.href = 'index.html';
    });
    
    // Configurar botón para cambiar perfil
    document.getElementById('switchProfileBtn').addEventListener('click', () => {
        showSwitchProfileModal();
    });
}

// Mostrar sección
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Actualizar contenido específico de la sección
        updateSectionContent(sectionId);
    }
}

// Actualizar contenido de la sección
function updateSectionContent(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'my-games':
            displayGames();
            break;
        case 'delete-games':
            displayGamesForDeletion();
            break;
        case 'profiles':
            displayAllProfiles();
            break;
        case 'stats':
            updateStatistics();
            break;
    }
}

// Cargar plataformas
function loadPlatforms() {
    const storedPlatforms = localStorage.getItem('gamePlatforms');
    if (storedPlatforms) {
        platforms = JSON.parse(storedPlatforms);
    } else {
        // Plataformas por defecto
        platforms = [
            {
                id: 1,
                name: 'PC',
                manufacturer: 'Varios',
                releaseYear: 1970,
                icon: 'fas fa-desktop',
                color: '#6c5ce7',
                gameCount: 0
            },
            {
                id: 2,
                name: 'PlayStation 5',
                manufacturer: 'Sony',
                releaseYear: 2020,
                icon: 'fas fa-gamepad',
                color: '#0070d1',
                gameCount: 0
            },
            {
                id: 3,
                name: 'Xbox Series X',
                manufacturer: 'Microsoft',
                releaseYear: 2020,
                icon: 'fas fa-gamepad',
                color: '#107c10',
                gameCount: 0
            },
            {
                id: 4,
                name: 'Nintendo Switch',
                manufacturer: 'Nintendo',
                releaseYear: 2017,
                icon: 'fas fa-gamepad',
                color: '#e60012',
                gameCount: 0
            }
        ];
        localStorage.setItem('gamePlatforms', JSON.stringify(platforms));
    }
    
    // Actualizar contador de juegos por plataforma
    updatePlatformGameCounts();
}

// Cargar juegos
function loadGames() {
    const storedGames = localStorage.getItem('userGames');
    if (storedGames) {
        games = JSON.parse(storedGames);
    } else {
        games = [];
        localStorage.setItem('userGames', JSON.stringify(games));
    }
    
    // Actualizar estadísticas
    updateGameStats();
}

// Configurar event listeners
function setupEventListeners() {
    // Configurar formulario de agregar juego
    const addGameForm = document.getElementById('addGameForm');
    if (addGameForm) {
        addGameForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewGame();
        });
        
        // Actualizar valor de rating
        const ratingInput = document.getElementById('gameRating');
        const ratingValue = document.getElementById('ratingValue');
        if (ratingInput && ratingValue) {
            ratingInput.addEventListener('input', () => {
                ratingValue.textContent = ratingInput.value;
            });
        }
        
        // Cargar plataformas en el select
        const platformSelect = document.getElementById('gamePlatform');
        if (platformSelect) {
            platformSelect.innerHTML = '<option value="">Selecciona plataforma</option>';
            platforms.forEach(platform => {
                const option = document.createElement('option');
                option.value = platform.id;
                option.textContent = platform.name;
                platformSelect.appendChild(option);
            });
        }
        
        // Géneros predefinidos
        const genreSelect = document.getElementById('gameGenre');
        if (genreSelect) {
            const genres = ['Acción', 'Aventura', 'RPG', 'Estrategia', 'Deportes', 'Carreras', 'Shooter', 'Indie', 'Simulación', 'Puzzle'];
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre;
                option.textContent = genre;
                genreSelect.appendChild(option);
            });
        }
    }
    
    // Configurar modal de plataforma
    const addPlatformBtn = document.getElementById('addPlatformBtn');
    if (addPlatformBtn) {
        addPlatformBtn.addEventListener('click', () => {
            showPlatformModal();
        });
    }
    
    // Configurar eliminación de juegos
    setupDeleteFunctionality();
    
    // Configurar gestión de perfiles
    const addNewProfileBtn = document.getElementById('addNewProfileBtn');
    if (addNewProfileBtn) {
        addNewProfileBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

// Agregar nuevo juego
function addNewGame() {
    const title = document.getElementById('gameTitle').value;
    const platformId = parseInt(document.getElementById('gamePlatform').value);
    const genre = document.getElementById('gameGenre').value;
    const rating = parseInt(document.getElementById('gameRating').value);
    const description = document.getElementById('gameDescription').value;
    const imageUrl = document.getElementById('gameImage').value;
    const releaseYear = document.getElementById('gameRelease').value;
    const tags = document.getElementById('gameTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    // Validar campos obligatorios
    if (!title || !platformId || !genre) {
        alert('Por favor, completa todos los campos obligatorios');
        return;
    }
    
    const newGame = {
        id: games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1,
        title,
        platformId,
        genre,
        rating,
        description,
        imageUrl: imageUrl || `https://picsum.photos/400/250?random=${Date.now()}`,
        releaseYear: releaseYear ? parseInt(releaseYear) : null,
        tags,
        profileId: currentProfile.id,
        addedAt: new Date().toISOString(),
        hoursPlayed: 0
    };
    
    games.push(newGame);
    localStorage.setItem('userGames', JSON.stringify(games));
    
    // Actualizar estadísticas
    updatePlatformGameCounts();
    updateGameStats();
    
    // Limpiar formulario
    document.getElementById('addGameForm').reset();
    document.getElementById('ratingValue').textContent = '5';
    
    // Mostrar mensaje de éxito
    alert('¡Juego agregado exitosamente!');
    
    // Redirigir a la sección de mis juegos
    showSection('my-games');
}

// Actualizar dashboard
function updateDashboard() {
    // Actualizar estadísticas
    document.getElementById('totalGames').textContent = games.filter(g => g.profileId === currentProfile.id).length;
    document.getElementById('totalPlatforms').textContent = platforms.length;
    document.getElementById('totalProfiles').textContent = profiles.length;
    
    // Calcular rating promedio
    const userGames = games.filter(g => g.profileId === currentProfile.id);
    const avgRating = userGames.length > 0 
        ? (userGames.reduce((sum, game) => sum + game.rating, 0) / userGames.length).toFixed(1)
        : '0.0';
    document.getElementById('avgRating').textContent = avgRating;
    
    // Mostrar juegos recientes
    displayRecentGames();
}

// Mostrar juegos recientes
function displayRecentGames() {
    const recentGamesContainer = document.getElementById('recentGames');
    if (!recentGamesContainer) return;
    
    const userGames = games.filter(g => g.profileId === currentProfile.id)
        .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
        .slice(0, 6);
    
    recentGamesContainer.innerHTML = '';
    
    if (userGames.length === 0) {
        recentGamesContainer.innerHTML = '<p class="no-games">No tienes juegos agregados todavía.</p>';
        return;
    }
    
    userGames.forEach(game => {
        const platform = platforms.find(p => p.id === game.platformId);
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-image" style="background-image: url('${game.imageUrl}')">
                <span class="game-platform-badge">${platform ? platform.name : 'Desconocido'}</span>
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <span class="game-genre">${game.genre}</span>
                <div class="game-rating">
                    <i class="fas fa-star"></i>
                    <span>${game.rating}/10</span>
                </div>
            </div>
        `;
        
        recentGamesContainer.appendChild(gameCard);
    });
}

// Mostrar todos los juegos
function displayGames() {
    const gamesContainer = document.getElementById('gamesList');
    if (!gamesContainer) return;
    
    const userGames = games.filter(g => g.profileId === currentProfile.id);
    const platformFilter = document.getElementById('platformFilter');
    const genreFilter = document.getElementById('genreFilter');
    
    // Configurar filtros
    setupFilters();
    
    // Aplicar filtros
    let filteredGames = [...userGames];
    
    if (platformFilter && platformFilter.value !== 'all') {
        const platformId = parseInt(platformFilter.value);
        filteredGames = filteredGames.filter(game => game.platformId === platformId);
    }
    
    if (genreFilter && genreFilter.value !== 'all') {
        filteredGames = filteredGames.filter(game => game.genre === genreFilter.value);
    }
    
    // Mostrar juegos
    gamesContainer.innerHTML = '';
    
    if (filteredGames.length === 0) {
        gamesContainer.innerHTML = '<p class="no-games">No se encontraron juegos con los filtros seleccionados.</p>';
        return;
    }
    
    filteredGames.forEach(game => {
        const platform = platforms.find(p => p.id === game.platformId);
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-image" style="background-image: url('${game.imageUrl}')">
                <span class="game-platform-badge">${platform ? platform.name : 'Desconocido'}</span>
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <span class="game-genre">${game.genre}</span>
                <p class="game-description">${game.description || 'Sin descripción disponible.'}</p>
                <div class="game-rating">
                    <i class="fas fa-star"></i>
                    <span>${game.rating}/10</span>
                    ${game.releaseYear ? `<span class="game-year">• ${game.releaseYear}</span>` : ''}
                </div>
                ${game.tags && game.tags.length > 0 ? 
                    `<div class="game-tags">${game.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : 
                    ''}
            </div>
        `;
        
        gamesContainer.appendChild(gameCard);
    });
}

// Configurar filtros
function setupFilters() {
    const platformFilter = document.getElementById('platformFilter');
    const genreFilter = document.getElementById('genreFilter');
    
    if (platformFilter) {
        // Limpiar opciones existentes (excepto la primera)
        while (platformFilter.options.length > 1) {
            platformFilter.remove(1);
        }
        
        // Agregar plataformas
        platforms.forEach(platform => {
            const option = document.createElement('option');
            option.value = platform.id;
            option.textContent = platform.name;
            platformFilter.appendChild(option);
        });
        
        // Actualizar al cambiar filtro
        platformFilter.addEventListener('change', () => {
            displayGames();
        });
    }
    
    if (genreFilter) {
        // Limpiar opciones existentes (excepto la primera)
        while (genreFilter.options.length > 1) {
            genreFilter.remove(1);
        }
        
        // Obtener géneros únicos de los juegos del usuario
        const userGames = games.filter(g => g.profileId === currentProfile.id);
        const uniqueGenres = [...new Set(userGames.map(game => game.genre))].filter(g => g);
        
        uniqueGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
        
        // Actualizar al cambiar filtro
        genreFilter.addEventListener('change', () => {
            displayGames();
        });
    }
}

// Mostrar modal para cambiar perfil
function showSwitchProfileModal() {
    const modal = document.getElementById('switchProfileModal');
    const profilesList = document.getElementById('switchProfilesList');
    
    if (!modal || !profilesList) return;
    
    // Cargar perfiles
    profilesList.innerHTML = '';
    profiles.forEach(profile => {
        const profileItem = document.createElement('div');
        profileItem.className = 'profile-item';
        profileItem.innerHTML = `
            <div class="profile-avatar-small">
                <img src="${profile.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name) + '&background=6c5ce7&color=fff'}" alt="${profile.name}">
            </div>
            <div class="profile-info-small">
                <h3>${profile.name}</h3>
                <p>${profile.age} años • ${profile.email}</p>
            </div>
        `;
        
        profileItem.addEventListener('click', () => {
            currentProfile = profile;
            localStorage.setItem('currentProfile', JSON.stringify(profile));
            updateProfileDisplay();
            updateSectionContent(currentSection);
            closeModal('switchProfileModal');
        });
        
        profilesList.appendChild(profileItem);
    });
    
    // Mostrar modal
    modal.classList.add('active');
    
    // Configurar cierre del modal
    modal.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal('switchProfileModal');
        });
    });
    
    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal('switchProfileModal');
        }
    });
}

// Cerrar modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Actualizar estadísticas
function updateStatistics() {
    const userGames = games.filter(g => g.profileId === currentProfile.id);
    
    // Calcular plataforma más popular
    const platformCounts = {};
    userGames.forEach(game => {
        platformCounts[game.platformId] = (platformCounts[game.platformId] || 0) + 1;
    });
    
    let mostPopularPlatform = '-';
    let maxCount = 0;
    Object.entries(platformCounts).forEach(([platformId, count]) => {
        if (count > maxCount) {
            maxCount = count;
            const platform = platforms.find(p => p.id === parseInt(platformId));
            mostPopularPlatform = platform ? platform.name : 'Desconocido';
        }
    });
    
    document.getElementById('mostPopularPlatform').textContent = mostPopularPlatform;
    
    // Calcular género más popular
    const genreCounts = {};
    userGames.forEach(game => {
        genreCounts[game.genre] = (genreCounts[game.genre] || 0) + 1;
    });
    
    let mostPopularGenre = '-';
    let maxGenreCount = 0;
    Object.entries(genreCounts).forEach(([genre, count]) => {
        if (count > maxGenreCount) {
            maxGenreCount = count;
            mostPopularGenre = genre;
        }
    });
    
    document.getElementById('mostPopularGenre').textContent = mostPopularGenre;
    
    // Calcular juego mejor calificado
    let topRatedGame = '-';
    let maxRating = 0;
    userGames.forEach(game => {
        if (game.rating > maxRating) {
            maxRating = game.rating;
            topRatedGame = game.title;
        }
    });
    
    document.getElementById('topRatedGame').textContent = topRatedGame;
    
    // Calcular total de horas jugadas
    const totalHours = userGames.reduce((sum, game) => sum + (game.hoursPlayed || 0), 0);
    document.getElementById('totalHours').textContent = `${totalHours} horas`;
    
    // Actualizar gráficos (si Chart.js está disponible)
    if (typeof Chart !== 'undefined') {
        updateCharts();
    }
}

// Configurar funcionalidad de eliminación
function setupDeleteFunctionality() {
    const selectAllCheckbox = document.getElementById('selectAllGames');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    const deletePlatformBtn = document.getElementById('deletePlatformBtn');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.game-to-delete input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
            updateDeleteButtonState();
        });
    }
    
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', deleteSelectedGames);
    }
    
    if (deletePlatformBtn) {
        deletePlatformBtn.addEventListener('click', () => {
            const deleteByPlatformSection = document.getElementById('deleteByPlatformSection');
            if (deleteByPlatformSection) {
                deleteByPlatformSection.style.display = 'block';
                setupPlatformDeletion();
            }
        });
    }
    
    // Buscar juegos para eliminar
    const searchInput = document.getElementById('searchDelete');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            displayGamesForDeletion();
        });
    }
}

// Mostrar juegos para eliminación
function displayGamesForDeletion() {
    const gamesToDeleteContainer = document.getElementById('gamesToDelete');
    const searchInput = document.getElementById('searchDelete');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    if (!gamesToDeleteContainer) return;
    
    const userGames = games.filter(g => g.profileId === currentProfile.id);
    
    // Filtrar por término de búsqueda
    let filteredGames = userGames;
    if (searchTerm) {
        filteredGames = userGames.filter(game => 
            game.title.toLowerCase().includes(searchTerm) ||
            game.genre.toLowerCase().includes(searchTerm) ||
            game.description?.toLowerCase().includes(searchTerm)
        );
    }
    
    gamesToDeleteContainer.innerHTML = '';
    
    if (filteredGames.length === 0) {
        gamesToDeleteContainer.innerHTML = '<p class="no-games">No se encontraron juegos para eliminar.</p>';
        return;
    }
    
    filteredGames.forEach(game => {
        const platform = platforms.find(p => p.id === game.platformId);
        const gameItem = document.createElement('div');
        gameItem.className = 'game-to-delete';
        gameItem.innerHTML = `
            <input type="checkbox" data-game-id="${game.id}">
            <div class="game-avatar">
                <img src="${game.imageUrl}" alt="${game.title}">
            </div>
            <div class="game-details">
                <h4>${game.title}</h4>
                <p>${platform ? platform.name : 'Desconocido'} • ${game.genre}</p>
            </div>
        `;
        
        // Marcar/desmarcar al hacer clic
        const checkbox = gameItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            gameItem.classList.toggle('selected', checkbox.checked);
            updateDeleteButtonState();
        });
        
        gamesToDeleteContainer.appendChild(gameItem);
    });
}

// Actualizar estado del botón de eliminación
function updateDeleteButtonState() {
    const checkboxes = document.querySelectorAll('.game-to-delete input[type="checkbox"]:checked');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    
    if (deleteSelectedBtn) {
        deleteSelectedBtn.disabled = checkboxes.length === 0;
    }
}

// Eliminar juegos seleccionados
function deleteSelectedGames() {
    const checkboxes = document.querySelectorAll('.game-to-delete input[type="checkbox"]:checked');
    const gameIds = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-game-id')));
    
    if (gameIds.length === 0) return;
    
    if (confirm(`¿Estás seguro de que quieres eliminar ${gameIds.length} juego(s)?`)) {
        // Filtrar juegos que NO están en la lista de IDs a eliminar
        games = games.filter(game => !gameIds.includes(game.id));
        
        // Guardar cambios
        localStorage.setItem('userGames', JSON.stringify(games));
        
        // Actualizar estadísticas
        updatePlatformGameCounts();
        updateGameStats();
        
        // Actualizar la vista
        displayGamesForDeletion();
        updateDashboard();
        
        alert(`${gameIds.length} juego(s) eliminado(s) exitosamente.`);
    }
}

// Configurar eliminación por plataforma
function setupPlatformDeletion() {
    const platformDeleteList = document.getElementById('platformDeleteList');
    if (!platformDeleteList) return;
    
    platformDeleteList.innerHTML = '';
    
    platforms.forEach(platform => {
        const platformGames = games.filter(g => g.profileId === currentProfile.id && g.platformId === platform.id);
        
        if (platformGames.length > 0) {
            const platformItem = document.createElement('div');
            platformItem.className = 'platform-delete-item';
            platformItem.innerHTML = `
                <div class="platform-info">
                    <div class="platform-icon-small" style="background-color: ${platform.color}">
                        <i class="${platform.icon}"></i>
                    </div>
                    <div>
                        <h4>${platform.name}</h4>
                        <p>${platformGames.length} juego(s)</p>
                    </div>
                </div>
                <button class="btn-delete-platform" data-platform-id="${platform.id}">
                    <i class="fas fa-trash"></i> Eliminar todos
                </button>
            `;
            
            platformDeleteList.appendChild(platformItem);
        }
    });
    
    // Configurar botones de eliminación por plataforma
    document.querySelectorAll('.btn-delete-platform').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const platformId = parseInt(e.currentTarget.getAttribute('data-platform-id'));
            deleteGamesByPlatform(platformId);
        });
    });
}

// Eliminar juegos por plataforma
function deleteGamesByPlatform(platformId) {
    const platformGames = games.filter(g => g.profileId === currentProfile.id && g.platformId === platformId);
    const platform = platforms.find(p => p.id === platformId);
    
    if (platformGames.length === 0) return;
    
    if (confirm(`¿Estás seguro de que quieres eliminar todos los juegos de ${platform.name} (${platformGames.length} juego(s))?`)) {
        // Filtrar juegos que NO son de esta plataforma o NO pertenecen al usuario actual
        games = games.filter(game => !(game.platformId === platformId && game.profileId === currentProfile.id));
        
        // Guardar cambios
        localStorage.setItem('userGames', JSON.stringify(games));
        
        // Actualizar estadísticas
        updatePlatformGameCounts();
        updateGameStats();
        
        // Actualizar vistas
        displayGamesForDeletion();
        updateDashboard();
        
        alert(`Todos los juegos de ${platform.name} han sido eliminados.`);
    }
}

// Mostrar todos los perfiles
function displayAllProfiles() {
    const profilesGrid = document.getElementById('profilesGrid');
    if (!profilesGrid) return;
    
    profilesGrid.innerHTML = '';
    
    profiles.forEach(profile => {
        const profileCard = document.createElement('div');
        profileCard.className = 'profile-card';
        profileCard.innerHTML = `
            <div class="profile-avatar-large">
                <img src="${profile.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name) + '&background=6c5ce7&color=fff'}" alt="${profile.name}">
                ${profile.id === currentProfile.id ? '<span class="current-badge">Actual</span>' : ''}
            </div>
            <div class="profile-info-large">
                <h3>${profile.name}</h3>
                <p><i class="fas fa-birthday-cake"></i> ${profile.age} años</p>
                <p><i class="fas fa-envelope"></i> ${profile.email}</p>
                ${profile.phone ? `<p><i class="fas fa-phone"></i> ${profile.phone}</p>` : ''}
                <p><i class="fas fa-calendar"></i> Creado: ${new Date(profile.createdAt).toLocaleDateString()}</p>
                
                <div class="profile-stats">
                    <div class="stat">
                        <strong>${games.filter(g => g.profileId === profile.id).length}</strong>
                        <span>Juegos</span>
                    </div>
                    <div class="stat">
                        <strong>${new Set(games.filter(g => g.profileId === profile.id).map(g => g.platformId)).size}</strong>
                        <span>Plataformas</span>
                    </div>
                </div>
                
                ${profile.id !== currentProfile.id ? 
                    `<button class="btn-switch-to" data-profile-id="${profile.id}">
                        <i class="fas fa-user-check"></i> Usar este perfil
                    </button>` : 
                    `<button class="btn-current" disabled>
                        <i class="fas fa-check-circle"></i> Perfil actual
                    </button>`
                }
            </div>
        `;
        
        // Configurar botón para cambiar a este perfil
        const switchBtn = profileCard.querySelector('.btn-switch-to');
        if (switchBtn) {
            switchBtn.addEventListener('click', () => {
                if (confirm(`¿Cambiar al perfil de ${profile.name}?`)) {
                    currentProfile = profile;
                    localStorage.setItem('currentProfile', JSON.stringify(profile));
                    updateProfileDisplay();
                    updateSectionContent(currentSection);
                    displayAllProfiles(); // Actualizar la vista
                }
            });
        }
        
        profilesGrid.appendChild(profileCard);
    });
}

// Mostrar modal de plataforma
function showPlatformModal() {
    const modal = document.getElementById('platformModal');
    const platformForm = document.getElementById('platformForm');
    
    if (!modal || !platformForm) return;
    
    // Limpiar formulario
    platformForm.reset();
    document.getElementById('platformColor').value = '#6c5ce7';
    
    // Mostrar modal
    modal.classList.add('active');
    
    // Configurar cierre del modal
    modal.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal('platformModal');
        });
    });
    
    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal('platformModal');
        }
    });
    
    // Configurar envío del formulario
    platformForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewPlatform();
    });
}

// Agregar nueva plataforma
function addNewPlatform() {
    const name = document.getElementById('platformName').value;
    const manufacturer = document.getElementById('platformManufacturer').value;
    const releaseYear = document.getElementById('platformRelease').value;
    const icon = document.getElementById('platformIcon').value || 'fas fa-gamepad';
    const color = document.getElementById('platformColor').value;
    
    if (!name) {
        alert('Por favor, ingresa un nombre para la plataforma');
        return;
    }
    
    const newPlatform = {
        id: platforms.length > 0 ? Math.max(...platforms.map(p => p.id)) + 1 : 1,
        name,
        manufacturer,
        releaseYear: releaseYear ? parseInt(releaseYear) : null,
        icon,
        color,
        gameCount: 0
    };
    
    platforms.push(newPlatform);
    localStorage.setItem('gamePlatforms', JSON.stringify(platforms));
    
    // Actualizar vista de plataformas
    displayPlatforms();
    
    // Cerrar modal
    closeModal('platformModal');
    
    alert(`Plataforma "${name}" agregada exitosamente.`);
}

// Mostrar plataformas
function displayPlatforms() {
    const platformsList = document.getElementById('platformsList');
    if (!platformsList) return;
    
    platformsList.innerHTML = '';
    
    platforms.forEach(platform => {
        const platformCard = document.createElement('div');
        platformCard.className = 'platform-card';
        platformCard.innerHTML = `
            <div class="platform-header">
                <div class="platform-icon" style="background-color: ${platform.color}">
                    <i class="${platform.icon}"></i>
                </div>
                <div>
                    <h3 class="platform-name">${platform.name}</h3>
                    <p class="platform-info">${platform.manufacturer || 'Fabricante desconocido'}${platform.releaseYear ? ` • ${platform.releaseYear}` : ''}</p>
                </div>
            </div>
            <div class="platform-stats">
                <div class="stat">
                    <strong>${platform.gameCount || 0}</strong>
                    <span>Juegos</span>
                </div>
                <div class="stat">
                    <strong>${games.filter(g => g.platformId === platform.id && g.profileId === currentProfile.id).length}</strong>
                    <span>Tus juegos</span>
                </div>
            </div>
        `;
        
        platformsList.appendChild(platformCard);
    });
}

// Actualizar contador de juegos por plataforma
function updatePlatformGameCounts() {
    platforms.forEach(platform => {
        platform.gameCount = games.filter(g => g.platformId === platform.id).length;
    });
    
    // Guardar plataformas actualizadas
    localStorage.setItem('gamePlatforms', JSON.stringify(platforms));
    
    // Actualizar vista si estamos en la sección de plataformas
    if (currentSection === 'platforms') {
        displayPlatforms();
    }
}

// Actualizar estadísticas de juegos
function updateGameStats() {
    // Actualizar estadísticas del dashboard
    if (currentSection === 'dashboard') {
        updateDashboard();
    }
    
    // Actualizar vista de juegos si está activa
    if (currentSection === 'my-games') {
        displayGames();
    }
}

// Actualizar gráficos de estadísticas
function updateCharts() {
    const userGames = games.filter(g => g.profileId === currentProfile.id);
    
    // Gráfico de plataformas
    const platformCtx = document.getElementById('platformsChart');
    if (platformCtx) {
        const platformData = {};
        userGames.forEach(game => {
            const platformName = platforms.find(p => p.id === game.platformId)?.name || 'Desconocido';
            platformData[platformName] = (platformData[platformName] || 0) + 1;
        });
        
        new Chart(platformCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(platformData),
                datasets: [{
                    data: Object.values(platformData),
                    backgroundColor: [
                        '#6c5ce7', '#00b894', '#fd79a8', '#fdcb6e', '#0984e3',
                        '#a29bfe', '#55efc4', '#ffeaa7', '#74b9ff', '#dfe6e9'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Gráfico de géneros
    const genreCtx = document.getElementById('genresChart');
    if (genreCtx) {
        const genreData = {};
        userGames.forEach(game => {
            genreData[game.genre] = (genreData[game.genre] || 0) + 1;
        });
        
        new Chart(genreCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(genreData),
                datasets: [{
                    label: 'Juegos por género',
                    data: Object.values(genreData),
                    backgroundColor: '#6c5ce7'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

// Inicializar la página principal
function initMainPage() {
    // Cargar perfil actual
    const storedProfile = localStorage.getItem('currentProfile');
    if (storedProfile) {
        currentProfile = JSON.parse(storedProfile);
        updateProfileDisplay();
    } else {
        // Si no hay perfil, redirigir a la página de carga
        window.location.href = 'index.html';
        return;
    }
    
    // Cargar perfiles
    const storedProfiles = localStorage.getItem('gameProfiles');
    if (storedProfiles) {
        profiles = JSON.parse(storedProfiles);
    }
    
    // Cargar datos
    loadPlatforms();
    loadGames();
    
    // Configurar navegación
    setupNavigation();
    
    // Configurar eventos
    setupEventListeners();
    
    // Mostrar sección actual
    showSection(currentSection);
}

// Inicializar página de carga
function initLoadingPage() {
    const loadingProgress = document.getElementById('loadingProgress');
    const loadingText = document.getElementById('loadingText');
    const profilesSection = document.getElementById('profilesSection');
    const loginForm = document.getElementById('loginForm');
    const newProfileBtn = document.getElementById('newProfileBtn');
    const cancelProfileBtn = document.getElementById('cancelProfileBtn');
    const profileForm = document.getElementById('profileForm');
    
    // Simular carga del sistema
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 10;
        if (loadingProgress) loadingProgress.style.width = `${progress}%`;
        
        if (progress === 30 && loadingText) loadingText.textContent = 'Cargando módulos...';
        if (progress === 60 && loadingText) loadingText.textContent = 'Inicializando base de datos...';
        if (progress === 90 && loadingText) loadingText.textContent = 'Cargando perfiles...';
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            if (loadingText) loadingText.textContent = '¡Listo!';
            
            // Mostrar selección de perfiles después de 500ms
            setTimeout(() => {
                loadProfiles();
                if (profilesSection) profilesSection.style.display = 'block';
            }, 500);
        }
    }, 200);
    
    // Event listeners
    if (newProfileBtn) {
        newProfileBtn.addEventListener('click', () => {
            if (profilesSection) profilesSection.style.display = 'none';
            if (loginForm) loginForm.style.display = 'block';
        });
    }
    
    if (cancelProfileBtn) {
        cancelProfileBtn.addEventListener('click', () => {
            if (loginForm) loginForm.style.display = 'none';
            if (profilesSection) profilesSection.style.display = 'block';
            if (profileForm) profileForm.reset();
        });
    }
    
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            createNewProfile();
        });
    }
}

// Cargar perfiles existentes
function loadProfiles() {
    const profilesList = document.getElementById('profilesList');
    if (!profilesList) return;
    
    profilesList.innerHTML = '';
    
    // Cargar perfiles de localStorage
    const storedProfiles = localStorage.getItem('gameProfiles');
    if (storedProfiles) {
        profiles = JSON.parse(storedProfiles);
    } else {
        // Crear perfil por defecto si no hay ninguno
        const defaultProfile = {
            id: 1,
            name: 'Jugador',
            age: 25,
            email: 'jugador@ejemplo.com',
            phone: '',
            photo: '',
            createdAt: new Date().toISOString()
        };
        profiles = [defaultProfile];
        localStorage.setItem('gameProfiles', JSON.stringify(profiles));
    }
    
    // Mostrar perfiles
    profiles.forEach(profile => {
        const profileItem = document.createElement('div');
        profileItem.className = 'profile-item';
        profileItem.innerHTML = `
            <div class="profile-avatar-small">
                <img src="${profile.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.name) + '&background=6c5ce7&color=fff'}" alt="${profile.name}">
            </div>
            <div class="profile-info-small">
                <h3>${profile.name}</h3>
                <p>${profile.age} años • ${profile.email}</p>
            </div>
        `;
        
        profileItem.addEventListener('click', () => {
            selectProfile(profile.id);
        });
        
        profilesList.appendChild(profileItem);
    });
}

// Crear nuevo perfil
function createNewProfile() {
    const name = document.getElementById('profileName').value;
    const age = document.getElementById('profileAge').value;
    const email = document.getElementById('profileEmail').value;
    const phone = document.getElementById('profilePhone').value;
    const photo = document.getElementById('profilePhoto').value;
    
    const newProfile = {
        id: profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1,
        name,
        age: parseInt(age),
        email,
        phone,
        photo,
        createdAt: new Date().toISOString()
    };
    
    profiles.push(newProfile);
    localStorage.setItem('gameProfiles', JSON.stringify(profiles));
    
    // Seleccionar el nuevo perfil y redirigir
    selectProfile(newProfile.id);
}

// Seleccionar perfil y redirigir a la página principal
function selectProfile(profileId) {
    const selectedProfile = profiles.find(p => p.id === profileId);
    if (selectedProfile) {
        localStorage.setItem('currentProfile', JSON.stringify(selectedProfile));
        // Redirigir a la página principal
        window.location.href = 'main.html';
    }
}