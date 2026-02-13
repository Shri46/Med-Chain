// src/utils/encryption.js

// Generate a new AES-256-GCM key
export async function generateEncryptionKey() {
    return await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true, // extractable
        ["encrypt", "decrypt"]
    );
}

// Export key to base64 string for storage/sharing
export async function exportKey(cryptoKey) {
    const exported = await window.crypto.subtle.exportKey("raw", cryptoKey);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

// Import key from base64 string
export async function importKey(base64Key) {
    const rawKey = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
        "raw",
        rawKey,
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

// Encrypt file ArrayBuffer → returns { encryptedData: Uint8Array, iv: Uint8Array }
export async function encryptFile(fileArrayBuffer, cryptoKey) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for GCM
    const encryptedContent = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        cryptoKey,
        fileArrayBuffer
    );

    return {
        encryptedData: new Uint8Array(encryptedContent),
        iv: iv,
    };
}

// Decrypt encrypted Uint8Array → returns ArrayBuffer
export async function decryptFile(encryptedData, cryptoKey, iv) {
    return await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        cryptoKey,
        encryptedData
    );
}

// Derive key from wallet address (deterministic, for demo purposes)
// NOTE: This is for demo simplicity only. Real apps should not derive keys from public addresses.
export async function deriveKeyFromAddress(walletAddress) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(walletAddress),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    return await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode("MedChain-Salt"),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}
