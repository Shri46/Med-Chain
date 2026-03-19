import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Lock } from 'lucide-react';
import { useIPFS } from '../../hooks/useIPFS';
import { useContract } from '../../hooks/useContract';
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
            const arrayBuffer = await file.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);

            showToast('Uploading to IPFS...', 'loading');
            const cid = await uploadToIPFS(data);

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
                            {isUploading ? 'Uploading...' : 'Upload Record'}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
