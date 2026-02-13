import { createContext, useContext, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const showToast = (message, type = 'success') => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'loading':
                return toast.loading(message);
            default:
                toast(message);
        }
    };

    const dismissToast = (toastId) => {
        toast.dismiss(toastId);
    };

    return (
        <ToastContext.Provider value={{ showToast, dismissToast }}>
            {children}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#363636',
                    },
                }}
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
