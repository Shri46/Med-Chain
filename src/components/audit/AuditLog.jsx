import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../../constants/contractAddress';
import { CONTRACT_ABI } from '../../constants/contractABI';
import { useWallet } from '../../hooks/useWallet';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { formatAddress, formatDate } from '../../utils/formatters';
import { Shield, Upload, UserPlus, UserMinus } from 'lucide-react';
import { getUserName } from '../../utils/nameStorage';

export const AuditLog = ({ role = 'patient', account }) => {
    const { provider } = useWallet();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const fetchEvents = async () => {
            if (!provider || !account) return;

            console.log("Fetching audit events...");
            try {
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
                let allEventsUnsorted = [];

                // Normalize events to a common format
                const normalize = (ev, type) => ({
                    type,
                    blockNumber: ev.blockNumber,
                    transactionHash: ev.transactionHash,
                    args: ev.args,
                    timestamp: ev.args.timestamp || ev.args[ev.args.length - 1]
                });

                if (role === 'patient') {
                    // Patient sees: Uploads related to themselves
                    const stored = await contract.queryFilter('RecordStored');

                    const myStored = stored.filter(e => e.args[0].toLowerCase() === account.toLowerCase());

                    allEventsUnsorted = [
                        ...myStored.map(e => normalize(e, 'UPLOAD'))
                    ];
                } else if (role === 'doctor') {
                    // Doctor sees: Grants & Revokes related to themselves
                    const granted = await contract.queryFilter('AccessGranted');
                    const revoked = await contract.queryFilter('AccessRevoked');

                    const myGranted = granted.filter(e => e.args[1].toLowerCase() === account.toLowerCase());
                    const myRevoked = revoked.filter(e => e.args[1].toLowerCase() === account.toLowerCase());

                    // Determine currently authorized patients to fetch their records
                    const statusMap = {};
                    const accessEvents = [...myGranted, ...myRevoked].sort((a, b) => {
                        if (a.blockNumber !== b.blockNumber) return a.blockNumber - b.blockNumber;
                        return (a.index || 0) - (b.index || 0);
                    });

                    accessEvents.forEach(e => {
                        const evtName = e.eventName || (e.fragment && e.fragment.name);
                        statusMap[e.args[0].toLowerCase()] = evtName === 'AccessGranted';
                    });

                    const authorizedPatients = Object.keys(statusMap).filter(address => statusMap[address]);

                    // Fetch RecordStored only for authorized patients
                    const uploads = [];
                    if (authorizedPatients.length > 0) {
                        const allStored = await contract.queryFilter('RecordStored');
                        const relevantUploads = allStored.filter(e =>
                            authorizedPatients.includes(e.args[0].toLowerCase())
                        );
                        uploads.push(...relevantUploads);
                    }

                    allEventsUnsorted = [
                        ...uploads.map(e => normalize(e, 'UPLOAD'))
                    ];
                }

                const sortedEvents = allEventsUnsorted.sort((a, b) => {
                    // Sort by timestamp desc (if available) or block number desc
                    if (a.args.timestamp && b.args.timestamp) {
                        return Number(b.args.timestamp) - Number(a.args.timestamp);
                    }
                    return b.blockNumber - a.blockNumber;
                });

                setEvents(sortedEvents);
            } catch (error) {
                console.error("Error fetching audit logs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [provider, account, role]);

    const getIcon = (type) => {
        switch (type) {
            case 'UPLOAD': return <Upload className="h-5 w-5 text-blue-500" />;
            default: return <Shield className="h-5 w-5 text-gray-500" />;
        }
    };

    const getDescription = (event) => {
        const renderName = (address) => {
            const name = getUserName(address);
            if (name) {
                return <span className="font-medium text-gray-900">{name} ({formatAddress(address)})</span>;
            }
            return <span className="font-mono text-gray-700">{formatAddress(address)}</span>;
        };

        switch (event.type) {
            case 'UPLOAD':
                return <>Patient {renderName(event.args[0])} uploaded a new record.</>;
            default: return "Unknown system event";
        }
    };

    const filteredEvents = filter === 'ALL' ? events : events.filter(e => e.type === filter);

    if (loading) return <Spinner />;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{role === 'doctor' ? 'Patient Activity Feed' : 'My Activity Log'}</CardTitle>
                <select
                    className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="ALL">All Events</option>
                    <option value="UPLOAD">Uploads</option>
                </select>
            </CardHeader>
            <CardContent>
                <div className="flow-root">
                    <ul className="-mb-8">
                        {filteredEvents.map((event, eventIdx) => (
                            <li key={event.transactionHash + eventIdx}>
                                <div className="relative pb-8">
                                    {eventIdx !== filteredEvents.length - 1 ? (
                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex space-x-3">
                                        <div className="bg-white rounded-full ring-8 ring-white">
                                            {getIcon(event.type)}
                                        </div>
                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    {getDescription(event)}
                                                </p>
                                            </div>
                                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                <time dateTime={new Date(Number(event.args.timestamp) * 1000).toISOString()}>
                                                    {formatDate(event.args.timestamp)}
                                                </time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {filteredEvents.length === 0 && (
                            <li className="py-4 text-center text-gray-500 text-sm">No events found matching criteria.</li>
                        )}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};
