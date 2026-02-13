import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../../constants/contractAddress';
import { CONTRACT_ABI } from '../../constants/contractABI';
import { useWallet } from '../../hooks/useWallet';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { formatAddress, formatDate } from '../../utils/formatters';
import { Shield, Upload, UserPlus, UserMinus, Activity } from 'lucide-react';

export const AuditLog = () => {
    const { provider } = useWallet();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const fetchEvents = async () => {
            if (!provider) return;

            try {
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

                // Fetch all relevant event types
                const [stored, granted, revoked, registered] = await Promise.all([
                    contract.queryFilter(contract.filters.RecordStored()),
                    contract.queryFilter(contract.filters.AccessGranted()),
                    contract.queryFilter(contract.filters.AccessRevoked()),
                    contract.queryFilter(contract.filters.RoleRegistered())
                ]);

                // Normalize events
                const normalize = (ev, type) => ({
                    type,
                    blockNumber: ev.blockNumber,
                    transactionHash: ev.transactionHash,
                    args: ev.args,
                    timestamp: ev.args.timestamp // Assuming we added timestamp to events. If not, we need to fetch block.
                    // Note: In my solidity contract, I added timestamp to events.
                });

                const allEvents = [
                    ...stored.map(e => normalize(e, 'UPLOAD')),
                    ...granted.map(e => normalize(e, 'GRANT')),
                    ...revoked.map(e => normalize(e, 'REVOKE')),
                    ...registered.map(e => normalize(e, 'REGISTER'))
                ].sort((a, b) => {
                    // Sort by timestamp desc (if available) or block number desc
                    if (a.args.timestamp && b.args.timestamp) {
                        return Number(b.args.timestamp) - Number(a.args.timestamp);
                    }
                    return b.blockNumber - a.blockNumber;
                });

                setEvents(allEvents);
            } catch (error) {
                console.error("Error fetching audit logs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [provider]);

    const getIcon = (type) => {
        switch (type) {
            case 'UPLOAD': return <Upload className="h-5 w-5 text-blue-500" />;
            case 'GRANT': return <UserPlus className="h-5 w-5 text-green-500" />;
            case 'REVOKE': return <UserMinus className="h-5 w-5 text-red-500" />;
            case 'REGISTER': return <Activity className="h-5 w-5 text-purple-500" />;
            default: return <Shield className="h-5 w-5 text-gray-500" />;
        }
    };

    const getDescription = (event) => {
        switch (event.type) {
            case 'UPLOAD':
                return <>Patient <span className="font-mono text-gray-700">{formatAddress(event.args.patient)}</span> uploaded a new record.</>;
            case 'GRANT':
                return <>Patient <span className="font-mono text-gray-700">{formatAddress(event.args.patient)}</span> granted access to Dr. <span className="font-mono text-gray-700">{formatAddress(event.args.doctor)}</span>.</>;
            case 'REVOKE':
                return <>Patient <span className="font-mono text-gray-700">{formatAddress(event.args.patient)}</span> revoked access from Dr. <span className="font-mono text-gray-700">{formatAddress(event.args.doctor)}</span>.</>;
            case 'REGISTER':
                return <>User <span className="font-mono text-gray-700">{formatAddress(event.args.user)}</span> registered as <span className="font-medium capitalize">{event.args.role}</span>.</>;
            default: return "Unknown system event";
        }
    };

    const filteredEvents = filter === 'ALL' ? events : events.filter(e => e.type === filter);

    if (loading) return <Spinner />;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>System Audit Log</CardTitle>
                <select
                    className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="ALL">All Events</option>
                    <option value="UPLOAD">Uploads</option>
                    <option value="GRANT">Access Grants</option>
                    <option value="REVOKE">Access Revocations</option>
                    <option value="REGISTER">Registrations</option>
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
