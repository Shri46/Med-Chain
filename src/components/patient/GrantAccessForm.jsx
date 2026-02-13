import React, { useState } from 'react';
import { useContract } from '../../hooks/useContract';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { UserPlus } from 'lucide-react';
import { isAddress } from 'ethers';
import { useToast } from '../../context/ToastContext';

export const GrantAccessForm = ({ onSuccess }) => {
    const [doctorAddress, setDoctorAddress] = useState('');
    const { grantAccess, isLoading } = useContract();
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAddress(doctorAddress)) {
            showToast('Invalid Ethereum address', 'error');
            return;
        }

        const success = await grantAccess(doctorAddress);
        if (success) {
            setDoctorAddress('');
            if (onSuccess) onSuccess();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Grant Doctor Access</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="doctor-address" className="block text-sm font-medium text-gray-700">
                            Doctor's Wallet Address
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="text"
                                id="doctor-address"
                                className="input-field block w-full pl-3 pr-3 sm:text-sm"
                                placeholder="0x..."
                                value={doctorAddress}
                                onChange={(e) => setDoctorAddress(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                            The doctor will be able to view and decrypt all your stored records.
                        </p>
                    </div>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        disabled={!doctorAddress}
                        className="w-full"
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Grant Access
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
