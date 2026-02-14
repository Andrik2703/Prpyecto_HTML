// Manejo de autenticación y perfiles
class AuthManager {
    constructor() {
        this.currentProfile = null;
        this.profiles = [];
        this.loadProfiles();
    }
    
    loadProfiles() {
        const storedProfiles = localStorage.getItem('gameProfiles');
        this.profiles = storedProfiles ? JSON.parse(storedProfiles) : [];
    }
    
    saveProfiles() {
        localStorage.setItem('gameProfiles', JSON.stringify(this.profiles));
    }
    
    createProfile(profileData) {
        const newProfile = {
            id: this.profiles.length > 0 ? Math.max(...this.profiles.map(p => p.id)) + 1 : 1,
            ...profileData,
            createdAt: new Date().toISOString()
        };
        
        this.profiles.push(newProfile);
        this.saveProfiles();
        return newProfile;
    }
    
    getProfile(profileId) {
        return this.profiles.find(p => p.id === profileId);
    }
    
    updateProfile(profileId, updates) {
        const index = this.profiles.findIndex(p => p.id === profileId);
        if (index !== -1) {
            this.profiles[index] = { ...this.profiles[index], ...updates };
            this.saveProfiles();
            return this.profiles[index];
        }
        return null;
    }
    
    deleteProfile(profileId) {
        const index = this.profiles.findIndex(p => p.id === profileId);
        if (index !== -1) {
            this.profiles.splice(index, 1);
            this.saveProfiles();
            return true;
        }
        return false;
    }
    
    setCurrentProfile(profileId) {
        const profile = this.getProfile(profileId);
        if (profile) {
            this.currentProfile = profile;
            localStorage.setItem('currentProfile', JSON.stringify(profile));
            return true;
        }
        return false;
    }
    
    getCurrentProfile() {
        if (!this.currentProfile) {
            const stored = localStorage.getItem('currentProfile');
            this.currentProfile = stored ? JSON.parse(stored) : null;
        }
        return this.currentProfile;
    }
    
    logout() {
        this.currentProfile = null;
        localStorage.removeItem('currentProfile');
    }
}

// Exportar instancia global
window.authManager = new AuthManager();