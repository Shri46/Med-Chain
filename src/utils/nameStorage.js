// Utility for mapping wallet addresses to real names using localStorage

const STORAGE_KEY = 'medchain_user_names';

/**
 * Get all stored names
 * @returns {Object} Mapping of address to name
 */
const getAllNames = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error("Error reading names from localStorage", e);
        return {};
    }
};

/**
 * Save a name for a specific wallet address
 * @param {string} address Wallet address
 * @param {string} name User's real name
 */
export const saveUserName = (address, name) => {
    if (!address || !name) return;

    // Normalize address to lowercase for consistent lookups
    const normalizedAddress = address.toLowerCase();

    const names = getAllNames();
    names[normalizedAddress] = name;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
    } catch (e) {
        console.error("Error saving name to localStorage", e);
    }
};

/**
 * Get a user's name by their wallet address
 * @param {string} address Wallet address
 * @returns {string|null} The user's name or null if not found
 */
export const getUserName = (address) => {
    if (!address) return null;

    const normalizedAddress = address.toLowerCase();
    const names = getAllNames();

    return names[normalizedAddress] || null;
};
