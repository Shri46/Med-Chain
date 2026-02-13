import React, { useState } from 'react';
import { isAddress } from 'ethers';
import { Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { useToast } from '../../context/ToastContext';

export const PatientSearch = ({ onSearch }) => {
    const [address, setAddress] = useState('');
    const { showToast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isAddress(address)) {
            showToast('Invalid Ethereum address', 'error');
            return;
        }
        onSearch(address);
    };

    return (
        <Card className="mb-6">
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="patient-search" className="sr-only">Search Patient Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="patient-search"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="Enter Patient Wallet Address (0x...)"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button type="submit">
                        Search Records
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
