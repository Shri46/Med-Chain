import React from 'react';
import { FileText, Image, File } from 'lucide-react';

export const FileIcon = ({ type, className }) => {
    if (type.startsWith('image/')) {
        return <Image className={className} />;
    }
    if (type === 'application/pdf') {
        return <FileText className={className} />;
    }
    return <File className={className} />;
};
