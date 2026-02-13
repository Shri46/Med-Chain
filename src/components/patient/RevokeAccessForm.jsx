import React, { useState } from 'react';
import { useContract } from '../../hooks/useContract';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { UserMinus } from 'lucide-react';
import { isAddress } from 'ethers';
import { useToast } from '../../context/ToastContext';

export const RevokeAccessForm = ({ onSuccess }) => {
    const [doctorAddress, setDoctorAddress] = useState('');
    const { revokeAccess, isLoading } = useContract();
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAddress(doctorAddress)) {
            showToast('Invalid Ethereum address', 'error');
            return;
        }

        const success = await revokeAccess(doctorAddress);
        if (success) {
            setDoctorAddress('');
            if (onSuccess) onSuccess();
        }
    };

    return (
        <Card className="border-red-100">
            <CardHeader>
                <CardTitle className="text-red-700">Revoke Access</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="revoke-address" className="block text-sm font-medium text-gray-700">
                            Doctor's Wallet Address
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                id="revoke-address"
                                className="input-field block w-full"
                                placeholder="0x..."
                                value={doctorAddress}
                                onChange={(e) => setDoctorAddress(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <Button
                        variant="danger"
                        type="submit"
                        isLoading={isLoading}
                        disabled={!doctorAddress}
                        className="w-full"
                    >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Revoke Access
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
