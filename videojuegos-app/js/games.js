// Manejo de videojuegos
class GamesManager {
    constructor() {
        this.games = [];
        this.loadGames();
    }
    
    loadGames() {
        const storedGames = localStorage.getItem('userGames');
        this.games = storedGames ? JSON.parse(storedGames) : [];
    }
    
    saveGames() {
        localStorage.setItem('userGames', JSON.stringify(this.games));
    }
    
    addGame(gameData) {
        const newGame = {
            id: this.games.length > 0 ? Math.max(...this.games.map(g => g.id)) + 1 : 1,
            ...gameData,
            addedAt: new Date().toISOString(),
            hoursPlayed: gameData.hoursPlayed || 0
        };
        
        this.games.push(newGame);
        this.saveGames();
        return newGame;
    }
    
    getGame(gameId) {
        return this.games.find(g => g.id === gameId);
    }
    
    updateGame(gameId, updates) {
        const index = this.games.findIndex(g => g.id === gameId);
        if (index !== -1) {
            this.games[index] = { ...this.games[index], ...updates };
            this.saveGames();
            return this.games[index];
        }
        return null;
    }
    
    deleteGame(gameId) {
        const index = this.games.findIndex(g => g.id === gameId);
        if (index !== -1) {
            this.games.splice(index, 1);
            this.saveGames();
            return true;
        }
        return false;
    }
    
    getGamesByProfile(profileId) {
        return this.games.filter(g => g.profileId === profileId);
    }
    
    getGamesByPlatform(platformId) {
        return this.games.filter(g => g.platformId === platformId);
    }
    
    getGamesByGenre(genre) {
        return this.games.filter(g => g.genre === genre);
    }
    
    searchGames(query) {
        const lowerQuery = query.toLowerCase();
        return this.games.filter(game => 
            game.title.toLowerCase().includes(lowerQuery) ||
            game.genre.toLowerCase().includes(lowerQuery) ||
            game.description?.toLowerCase().includes(lowerQuery) ||
            game.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }
    
    getStats(profileId) {
        const profileGames = this.getGamesByProfile(profileId);
        
        return {
            totalGames: profileGames.length,
            totalHours: profileGames.reduce((sum, game) => sum + (game.hoursPlayed || 0), 0),
            averageRating: profileGames.length > 0 
                ? (profileGames.reduce((sum, game) => sum + game.rating, 0) / profileGames.length).toFixed(1)
                : 0,
            byPlatform: this.getGamesByPlatformGrouped(profileId),
            byGenre: this.getGamesByGenreGrouped(profileId)
        };
    }
    
    getGamesByPlatformGrouped(profileId) {
        const profileGames = this.getGamesByProfile(profileId);
        const grouped = {};
        
        profileGames.forEach(game => {
            grouped[game.platformId] = (grouped[game.platformId] || 0) + 1;
        });
        
        return grouped;
    }
    
    getGamesByGenreGrouped(profileId) {
        const profileGames = this.getGamesByProfile(profileId);
        const grouped = {};
        
        profileGames.forEach(game => {
            grouped[game.genre] = (grouped[game.genre] || 0) + 1;
        });
        
        return grouped;
    }
}

// Exportar instancia global
window.gamesManager = new GamesManager();