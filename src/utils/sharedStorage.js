// Utility for mocking a shared database using localStorage and handling migration

const GLOBAL_PROFILES_KEY = 'medchain_global_profiles';
const OLD_NAMES_KEY = 'medchain_user_names';

/**
 * Initializes and migrates old local storage data to the new structured format.
 * This ensures backward compatibility for previously registered doctors/users.
 * @returns {Object} The current global profiles mapping
 */
export const initSharedStorage = () => {
    try {
        let profiles = JSON.parse(localStorage.getItem(GLOBAL_PROFILES_KEY) || '{}');
        let oldNames = JSON.parse(localStorage.getItem(OLD_NAMES_KEY) || '{}');
        
        let migrated = false;
        
        // Migrate old names if they don't exist in the new profiles
        for (const [address, name] of Object.entries(oldNames)) {
            const normalizedAddress = address.toLowerCase();
            if (!profiles[normalizedAddress]) {
                profiles[normalizedAddress] = {
                    name,
                    migratedAt: Date.now()
                };
                migrated = true;
            }
        }
        
        if (migrated) {
            localStorage.setItem(GLOBAL_PROFILES_KEY, JSON.stringify(profiles));
        }
        
        return profiles;
    } catch (e) {
        console.error("Error initializing shared storage:", e);
        return {};
    }
};

/**
 * Save a user profile.
 * @param {string} address Wallet address
 * @param {Object} profileData Profile data payload (e.g. { name: 'Dr. Smith' })
 */
export const saveUserProfile = (address, profileData) => {
    if (!address) return;
    
    const normalizedAddress = address.toLowerCase();
    const profiles = initSharedStorage();
    
    profiles[normalizedAddress] = {
        ...profiles[normalizedAddress],
        ...profileData,
        updatedAt: Date.now()
    };
    
    try {
        localStorage.setItem(GLOBAL_PROFILES_KEY, JSON.stringify(profiles));
        
        // Also update the old storage just in case some other un-migrated part of the app uses it
        if (profileData.name) {
            const oldNames = JSON.parse(localStorage.getItem(OLD_NAMES_KEY) || '{}');
            oldNames[normalizedAddress] = profileData.name;
            localStorage.setItem(OLD_NAMES_KEY, JSON.stringify(oldNames));
        }
    } catch (e) {
        console.error("Error saving user profile:", e);
    }
};

/**
 * Get a user profile.
 * @param {string} address Wallet address
 * @returns {Object|null} The user's profile or null
 */
export const getUserProfile = (address) => {
    if (!address) return null;
    
    const normalizedAddress = address.toLowerCase();
    const profiles = initSharedStorage();
    
    return profiles[normalizedAddress] || null;
};
