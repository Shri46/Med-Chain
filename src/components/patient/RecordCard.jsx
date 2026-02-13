import React from 'react';
import { FileIcon } from '../ui/FileIcon';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { formatDate, formatFileSize } from '../../utils/formatters';
import { Eye, Share2, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const RecordCard = ({ record, onShare, onView }) => {
    const { showToast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(record.cid);
        showToast('CID copied to clipboard', 'success');
    };

    return (
        <Card className="mb-4 hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4 overflow-hidden">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <FileIcon type={record.fileType} className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {record.fileName}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 space-x-2">
                            <span>{formatDate(record.timestamp)}</span>
                            <span>•</span>
                            <span className="font-mono bg-gray-100 px-1 rounded truncate max-w-[100px]" title={record.cid}>
                                {record.cid.substring(0, 8)}...
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {onView && (
                        <Button variant="ghost" size="sm" onClick={() => onView(record)} title="View File">
                            <Eye className="h-4 w-4" />
                        </Button>
                    )}

                    <Button variant="ghost" size="sm" onClick={handleCopy} title="Copy CID">
                        <Copy className="h-4 w-4" />
                    </Button>

                    {onShare && (
                        <Button variant="ghost" size="sm" onClick={() => onShare(record)} title="Share Access">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
