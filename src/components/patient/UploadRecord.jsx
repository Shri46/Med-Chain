import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Lock } from 'lucide-react';
import { useIPFS } from '../../hooks/useIPFS';
import { useContract } from '../../hooks/useContract';
import { generateEncryptionKey, exportKey, encryptFile } from '../../utils/encryption';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../ui/Spinner';

export const UploadRecord = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const { uploadToIPFS } = useIPFS();
    const { storeCID } = useContract();
    const { showToast } = useToast();

    const onDrop = useCallback((acceptedFiles) => {
        setFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
    });

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        try {
            // 1. Read file
            const arrayBuffer = await file.arrayBuffer();

            // 2. Generate Key
            const key = await generateEncryptionKey();

            // 3. Encrypt File
            const { encryptedData, iv } = await encryptFile(arrayBuffer, key);

            // Combine IV and Encrypted Data for storage (usually IV is prepended)
            // Here, for simplicity, we'll just upload the encrypted blob.
            // In a real app, we need to store the IV alongside the data or encryption key.
            // OPTIMIZATION: We will prepend the 12-byte IV to the encrypted data
            const combinedData = new Uint8Array(iv.length + encryptedData.length);
            combinedData.set(iv);
            combinedData.set(encryptedData, iv.length);

            // 4. Upload to IPFS
            showToast('Uploading to IPFS...', 'loading');
            const cid = await uploadToIPFS(combinedData);

            // 5. Store Key (DEMO ONLY: LocalStorage)
            // In production, this should be encrypted with the user's wallet public key or stored in a secure vault
            const exportedKey = await exportKey(key);
            const keys = JSON.parse(localStorage.getItem('medchain_keys') || '{}');
            keys[cid] = exportedKey;
            localStorage.setItem('medchain_keys', JSON.stringify(keys));

            // 6. Smart Contract Transaction
            showToast('Confirm transaction in MetaMask...', 'loading');
            const success = await storeCID(cid, file.name, file.type);

            if (success) {
                setFile(null);
                if (onUploadSuccess) onUploadSuccess();
            }

        } catch (error) {
            console.error(error);
            showToast('Upload failed: ' + error.message, 'error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Upload Medical Record</CardTitle>
            </CardHeader>
            <CardContent>
                {!file ? (
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 font-medium">Click or drag file to upload</p>
                        <p className="text-xs text-gray-400 mt-2">PDF, PNG, JPG up to 10MB</p>
                        <div className="flex items-center justify-center mt-4 text-xs text-blue-600 bg-blue-50 py-1 px-2 rounded-full inline-flex">
                            <Lock className="w-3 h-3 mr-1" />
                            Client-side Encrypted
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <File className="h-8 w-8 text-primary-500" />
                                <div>
                                    <p className="font-medium text-gray-900">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <Button
                            onClick={handleUpload}
                            isLoading={isUploading}
                            className="w-full"
                        >
                            {isUploading ? 'Encrypting & Uploading...' : 'Encrypt & Upload Reocrd'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
