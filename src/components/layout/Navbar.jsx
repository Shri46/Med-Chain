import React from 'react';
import { Link } from 'react-router-dom';
import { WalletConnectButton } from '../wallet/WalletConnectButton';
import { Activity } from 'lucide-react';

export const Navbar = () => {
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <Activity className="h-8 w-8 text-primary-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">MedChain</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <WalletConnectButton />
                    </div>
                </div>
            </div>
        </nav>
    );
};
