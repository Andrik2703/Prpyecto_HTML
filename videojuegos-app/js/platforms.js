// Manejo de plataformas
class PlatformsManager {
    constructor() {
        this.platforms = [];
        this.loadPlatforms();
    }
    
    loadPlatforms() {
        const storedPlatforms = localStorage.getItem('gamePlatforms');
        if (storedPlatforms) {
            this.platforms = JSON.parse(storedPlatforms);
        } else {
            // Plataformas por defecto
            this.platforms = [
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
                },
                {
                    id: 5,
                    name: 'PlayStation 4',
                    manufacturer: 'Sony',
                    releaseYear: 2013,
                    icon: 'fas fa-gamepad',
                    color: '#0070d1',
                    gameCount: 0
                },
                {
                    id: 6,
                    name: 'Xbox One',
                    manufacturer: 'Microsoft',
                    releaseYear: 2013,
                    icon: 'fas fa-gamepad',
                    color: '#107c10',
                    gameCount: 0
                },
                {
                    id: 7,
                    name: 'Mobile',
                    manufacturer: 'Varios',
                    releaseYear: 2007,
                    icon: 'fas fa-mobile-alt',
                    color: '#9b59b6',
                    gameCount: 0
                }
            ];
            this.savePlatforms();
        }
    }
    
    savePlatforms() {
        localStorage.setItem('gamePlatforms', JSON.stringify(this.platforms));
    }
    
    addPlatform(platformData) {
        const newPlatform = {
            id: this.platforms.length > 0 ? Math.max(...this.platforms.map(p => p.id)) + 1 : 1,
            ...platformData,
            gameCount: 0
        };
        
        this.platforms.push(newPlatform);
        this.savePlatforms();
        return newPlatform;
    }
    
    getPlatform(platformId) {
        return this.platforms.find(p => p.id === platformId);
    }
    
    updatePlatform(platformId, updates) {
        const index = this.platforms.findIndex(p => p.id === platformId);
        if (index !== -1) {
            this.platforms[index] = { ...this.platforms[index], ...updates };
            this.savePlatforms();
            return this.platforms[index];
        }
        return null;
    }
    
    deletePlatform(platformId) {
        const index = this.platforms.findIndex(p => p.id === platformId);
        if (index !== -1) {
            this.platforms.splice(index, 1);
            this.savePlatforms();
            return true;
        }
        return false;
    }
    
    updateGameCounts(games) {
        this.platforms.forEach(platform => {
            platform.gameCount = games.filter(g => g.platformId === platform.id).length;
        });
        this.savePlatforms();
    }
    
    getPlatformStats(profileId, games) {
        const stats = {};
        this.platforms.forEach(platform => {
            const profileGames = games.filter(g => g.profileId === profileId && g.platformId === platform.id);
            stats[platform.id] = {
                totalGames: profileGames.length,
                averageRating: profileGames.length > 0 
                    ? (profileGames.reduce((sum, game) => sum + game.rating, 0) / profileGames.length).toFixed(1)
                    : 0,
                totalHours: profileGames.reduce((sum, game) => sum + (game.hoursPlayed || 0), 0)
            };
        });
        return stats;
    }
}

// Exportar instancia global
window.platformsManager = new PlatformsManager();