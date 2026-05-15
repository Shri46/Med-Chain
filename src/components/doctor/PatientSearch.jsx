import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, User, FileText } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';

export const PatientSearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axios.get('http://localhost:5000/patients');
                setPatients(res.data);
            } catch (err) {
                console.error("Failed to fetch patients", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.startsWith('0x')) {
            onSearch(searchTerm);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="mb-6">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="patient-search" className="sr-only">Search Patient</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="patient-search"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
                                    placeholder="Search by Patient Name or Wallet Address (0x...)"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="py-3 px-6">
                            Search
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex justify-center p-8"><Spinner size="lg" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.map((patient) => (
                        <Card key={patient.walletAddress} className="hover:shadow-lg transition-all border-l-4 border-l-primary-500">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-primary-50 p-3 rounded-full">
                                        <User className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="font-bold text-gray-900 truncate">{patient.name || 'Unknown'}</h3>
                                        <p className="text-xs text-gray-500 font-mono truncate">{patient.walletAddress}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1 mb-6 flex-grow">
                                    <p><span className="font-medium text-gray-700">DOB:</span> {patient.dob || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-700">Blood Group:</span> {patient.bloodGroup || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-700">Hospital:</span> {patient.hospitalId?.name || 'N/A'}</p>
                                </div>
                                <Button 
                                    variant="outline" 
                                    className="w-full flex items-center justify-center gap-2 border-primary-200 hover:bg-primary-50 text-primary-700"
                                    onClick={() => onSearch(patient.walletAddress)}
                                >
                                    <FileText className="w-4 h-4" /> Expand / View Profile
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {filteredPatients.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No patients found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
