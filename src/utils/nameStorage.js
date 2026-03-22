import { saveUserProfile, getUserProfile } from './sharedStorage';

/**
 * Save a name for a specific wallet address
 * Proxy to shared storage logic
 * @param {string} address Wallet address
 * @param {string} name User's real name
 */
export const saveUserName = (address, name) => {
    saveUserProfile(address, { name });
};

/**
 * Get a user's name by their wallet address
 * Proxy to shared storage logic
 * @param {string} address Wallet address
 * @returns {string|null} The user's name or null if not found
 */
export const getUserName = (address) => {
    const profile = getUserProfile(address);
    return profile ? profile.name : null;
};
