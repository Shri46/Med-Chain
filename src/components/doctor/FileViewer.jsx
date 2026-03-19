import React, { useEffect, useState, useCallback } from 'react';
import { X, Download, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useIPFS } from '../../hooks/useIPFS';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { useToast } from '../../context/ToastContext';

export const FileViewer = ({ record, isOpen, onClose }) => {
    const [contentUrl, setContentUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { fetchFromIPFS } = useIPFS();
    const { showToast } = useToast();

    const fetchAndDisplay = useCallback(async () => {
        if (!isOpen || !record) return;

        setIsLoading(true);
        setError(null);
        setContentUrl(null);

        try {
            const fileBuffer = await fetchFromIPFS(record.cid);
            
            const blob = new Blob([fileBuffer], { type: record.fileType });
            const url = URL.createObjectURL(blob);
            setContentUrl(url);

        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to fetch file");
            showToast('Fetch failed', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [isOpen, record, fetchFromIPFS, showToast]);

    useEffect(() => {
        fetchAndDisplay();

        // Cleanup
        return () => {
            if (contentUrl) URL.revokeObjectURL(contentUrl);
        };
    }, [isOpen, record, fetchAndDisplay]);

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
                                    <p className="text-gray-500">Fetching from IPFS...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center p-6 w-full max-w-lg">
                                    <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-red-500 opacity-50" />
                                    <p className="font-medium text-red-500">Error Viewing File</p>
                                    <p className="text-sm mt-1 text-red-400">{error}</p>
                                </div>
                            ) : contentUrl ? (
                                record.fileType.startsWith('image/') ? (
                                    <img src={contentUrl} alt="Medical Record" className="max-h-[70vh] max-w-full object-contain mx-auto" />
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
                                    Download File
                                </Button>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
