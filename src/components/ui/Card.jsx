import React from 'react';
import { clsx } from 'clsx';

export const Card = ({ children, className, ...props }) => {
    return (
        <div className={clsx("bg-white shadow rounded-lg overflow-hidden", className)} {...props}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className }) => {
    return <div className={clsx("px-4 py-5 sm:px-6 border-b border-gray-200", className)}>{children}</div>;
};

export const CardTitle = ({ children, className }) => {
    return <h3 className={clsx("text-lg leading-6 font-medium text-gray-900", className)}>{children}</h3>;
};

export const CardContent = ({ children, className }) => {
    return <div className={clsx("px-4 py-5 sm:p-6", className)}>{children}</div>;
};

export const CardFooter = ({ children, className }) => {
    return <div className={clsx("px-4 py-4 sm:px-6 bg-gray-50", className)}>{children}</div>;
};
