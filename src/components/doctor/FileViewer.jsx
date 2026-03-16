import React, { useEffect, useState, useCallback } from 'react';
import { X, Download, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useIPFS } from '../../hooks/useIPFS';
import { decryptFile, importKey } from '../../utils/encryption';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { useToast } from '../../context/ToastContext';

export const FileViewer = ({ record, isOpen, onClose }) => {
    const [contentUrl, setContentUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [manualKey, setManualKey] = useState('');
    const { fetchFromIPFS } = useIPFS();
    const { showToast } = useToast();

    const fetchAndDecrypt = useCallback(async (providedKey = null) => {
        if (!isOpen || !record) return;

        setIsLoading(true);
        setError(null);
        setContentUrl(null);

        try {
            // 1. Fetch Encrypted Data from IPFS
            const encryptedFileBuffer = await fetchFromIPFS(record.cid);

            // 2. Retrieve Decryption Key
            const keys = JSON.parse(localStorage.getItem('medchain_keys') || '{}');
            let base64Key = providedKey || keys[record.cid];

            if (!base64Key) {
                try {
                    const res = await fetch('/api/keys');
                    const serverKeys = await res.json();
                    base64Key = serverKeys[record.cid];
                    if (base64Key) {
                        keys[record.cid] = base64Key;
                        localStorage.setItem('medchain_keys', JSON.stringify(keys));
                    }
                } catch (e) { console.error('Error fetching key from server', e); }
            }

            if (!base64Key) {
                throw new Error('Decryption key not found. Ensure the patient has shared the key (Simulated in this demo).');
            }

            // If a manual key was provided and worked, save it
            if (providedKey) {
                keys[record.cid] = providedKey;
                localStorage.setItem('medchain_keys', JSON.stringify(keys));
            }

            const key = await importKey(base64Key);

            // 3. Extract IV and Data
            const iv = encryptedFileBuffer.slice(0, 12);
            const data = encryptedFileBuffer.slice(12);

            // 4. Decrypt
            const decryptedBuffer = await decryptFile(data, key, iv);

            // 5. Create Blob URL
            const blob = new Blob([decryptedBuffer], { type: record.fileType });
            const url = URL.createObjectURL(blob);
            setContentUrl(url);

        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to decrypt file");
            showToast('Decryption failed', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [isOpen, record, fetchFromIPFS, showToast]);

    useEffect(() => {
        fetchAndDecrypt();

        // Cleanup
        return () => {
            if (contentUrl) URL.revokeObjectURL(contentUrl);
        };
    }, [isOpen, record]); // Intentional exclusion of fetchAndDecrypt to avoid infinite loop on mount

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" onClick={onClose}>
                    <div className="absolute inset-0 bg-gray-900 opacity-90"></div>
                </div>

                <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">{record?.fileName}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    CID: {record?.cid}
                                </p>
                            </div>
                            <button onClick={onClose} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="mt-4 min-h-[400px] flex items-center justify-center bg-gray-50 rounded border border-gray-200">
                            {isLoading ? (
                                <div className="text-center">
                                    <Spinner size="lg" className="mx-auto mb-2" />
                                    <p className="text-gray-500">Fetching from IPFS & Decrypting...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center p-6 w-full max-w-lg">
                                    <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-red-500 opacity-50" />
                                    <p className="font-medium text-red-500">Error Viewing File</p>
                                    <p className="text-sm mt-1 text-red-400">{error}</p>

                                    {error.includes('key not found') && (
                                        <div className="mt-6 p-4 bg-white border rounded shadow-sm">
                                            <p className="text-gray-700 text-sm mb-3">Enter the AES decryption key (Base64) provided by the patient:</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="password"
                                                    placeholder="Enter Base64 Key"
                                                    value={manualKey}
                                                    onChange={(e) => setManualKey(e.target.value)}
                                                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-gray-900 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                                />
                                                <Button
                                                    onClick={() => fetchAndDecrypt(manualKey)}
                                                    disabled={!manualKey.trim()}
                                                >
                                                    Decrypt
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : contentUrl ? (
                                record.fileType.startsWith('image/') ? (
                                    <img src={contentUrl} alt="Decrypted Medical Record" className="max-h-[70vh] max-w-full object-contain mx-auto" />
                                ) : (
                                    <iframe src={contentUrl} className="w-full h-[70vh] border-0" title="PDF Viewer" />
                                )
                            ) : null}
                        </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between items-center">
                        {contentUrl && (
                            <a href={contentUrl} download={record.fileName} className="w-full sm:w-auto sm:ml-3">
                                <Button>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Decrypted
                                </Button>
                            </a>
                        )}
                        <div className="flex items-center text-xs text-green-700 mt-3 sm:mt-0">
                            <ShieldCheck className="h-4 w-4 mr-1" />
                            End-to-End Encrypted via AES-256-GCM
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
