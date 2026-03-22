import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { getUserProfile } from '../../utils/sharedStorage';
import { formatAddress } from '../../utils/formatters';
import { Spinner } from '../ui/Spinner';
import { CONTRACT_ADDRESS } from '../../constants/contractAddress';
import { CONTRACT_ABI } from '../../constants/contractABI';
import { ethers } from 'ethers';

export const ConnectedPatients = ({ onSelectPatient }) => {
    const { provider, account } = useWallet();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConnectedPatients = async () => {
            if (!provider || !account) return;

            setLoading(true);
            try {
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

                // Query AccessGranted events where doctor = account
                const grantedFilter = contract.filters.AccessGranted(null, account);
                const grantedEvents = await contract.queryFilter(grantedFilter);

                // Query AccessRevoked events where doctor = account
                const revokedFilter = contract.filters.AccessRevoked(null, account);
                const revokedEvents = await contract.queryFilter(revokedFilter);

                // Process events to find currently authorized patients
                const statusMap = {}; // patient_address -> bool

                // Sort all events by block number/log index to replay history
                const allEvents = [
                    ...grantedEvents.map(e => ({ type: 'grant', patient: e.args[0], block: e.blockNumber, index: e.index })),
                    ...revokedEvents.map(e => ({ type: 'revoke', patient: e.args[0], block: e.blockNumber, index: e.index }))
                ].sort((a, b) => {
                    if (a.block !== b.block) return a.block - b.block;
                    return a.index - b.index;
                });

                allEvents.forEach(e => {
                    if (e.type === 'grant') statusMap[e.patient] = true;
                    else statusMap[e.patient] = false;
                });

                const activePatients = Object.keys(statusMap).filter(addr => statusMap[addr]);
                setPatients(activePatients);

            } catch (error) {
                console.error("Error fetching connected patients:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConnectedPatients();
    }, [provider, account]);

    if (loading) return <Spinner size="sm" />;

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Connected Patients</CardTitle>
            </CardHeader>
            <CardContent>
                {patients.length === 0 ? (
                    <p className="text-gray-500 text-sm">No patients have granted you access to their records yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {patients.map(patientAddr => {
                            const profile = getUserProfile(patientAddr);
                            const name = profile ? profile.name : null;
                            return (
                                <li 
                                    key={patientAddr} 
                                    className="py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-md px-3 -mx-3 transition-colors group"
                                    onClick={() => onSelectPatient(patientAddr)}
                                >
                                    <div>
                                        <p className={name ? "text-sm font-medium text-gray-900" : "font-mono text-sm text-gray-700"}>
                                            {name ? name : formatAddress(patientAddr)}
                                        </p>
                                        {name && <p className="text-xs text-gray-500 font-mono">{formatAddress(patientAddr)}</p>}
                                    </div>
                                    <span className="text-xs text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-200 group-hover:bg-primary-100 transition-colors">
                                        View Records
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};
