import React from 'react';
import { useWallet } from '../../hooks/useWallet';
import { formatAddress } from '../../utils/formatters';
import { getUserName } from '../../utils/nameStorage';
import { Button } from '../ui/Button';
import { Wallet } from 'lucide-react';

export const WalletConnectButton = () => {
    const { account, connectWallet, isConnecting, disconnectWallet } = useWallet();

    if (account) {
        return (
            <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-sm font-medium text-gray-700">
                        {getUserName(account) || formatAddress(account)}
                    </span>
                    <span className="text-xs text-green-600 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Connected
                    </span>
                </div>
                <Button variant="secondary" onClick={disconnectWallet} size="sm">
                    Disconnect
                </Button>
            </div>
        );
    }

    return (
        <Button onClick={connectWallet} isLoading={isConnecting}>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
        </Button>
    );
};
