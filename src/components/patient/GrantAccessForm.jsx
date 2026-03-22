import React, { useState, useEffect } from 'react';
import { useContract } from '../../hooks/useContract';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { UserPlus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import { formatAddress } from '../../utils/formatters';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const GrantAccessForm = ({ onSuccess }) => {
    const [hospitals, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [doctorAddress, setDoctorAddress] = useState('');
    const [isFetchingHospitals, setIsFetchingHospitals] = useState(true);
    const [isFetchingDoctors, setIsFetchingDoctors] = useState(false);

    const { grantAccess, isLoading } = useContract();
    const { showToast } = useToast();

    // Fetch hospitals on mount
    useEffect(() => {
        const fetchHospitals = async () => {
            setIsFetchingHospitals(true);
            try {
                const res = await axios.get(`${BACKEND_URL}/hospitals`);
                setHospitals(res.data);
            } catch (error) {
                console.error("Error fetching hospitals:", error);
                showToast("Failed to load hospitals", "error");
            } finally {
                setIsFetchingHospitals(false);
            }
        };
        fetchHospitals();
    }, []);

    // Fetch doctors when hospital changes
    useEffect(() => {
        const fetchDoctors = async () => {
            if (!selectedHospital) {
                setDoctors([]);
                setDoctorAddress('');
                return;
            }
            setIsFetchingDoctors(true);
            try {
                const res = await axios.get(`${BACKEND_URL}/doctors?hospitalId=${selectedHospital}`);
                setDoctors(res.data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
                showToast("Failed to load doctors", "error");
            } finally {
                setIsFetchingDoctors(false);
            }
        };
        fetchDoctors();
    }, [selectedHospital]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!doctorAddress) {
            showToast('Please select a doctor', 'error');
            return;
        }

        const success = await grantAccess(doctorAddress);
        if (success) {
            setDoctorAddress('');
            setSelectedHospital('');
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
                        <label htmlFor="hospital-select" className="block text-sm font-medium text-gray-700">
                            Select Hospital
                        </label>
                        <select
                            id="hospital-select"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border bg-white"
                            value={selectedHospital}
                            onChange={(e) => {
                                setSelectedHospital(e.target.value);
                                setDoctorAddress('');
                            }}
                            disabled={isLoading || isFetchingHospitals}
                        >
                            <option value="">-- Choose a hospital --</option>
                            {hospitals.map((h) => (
                                <option key={h._id} value={h._id}>{h.name}</option>
                            ))}
                        </select>
                    </div>

                    {selectedHospital && (
                        <div>
                            <label htmlFor="doctor-select" className="block text-sm font-medium text-gray-700">
                                Select Doctor
                            </label>
                            <select
                                id="doctor-select"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border bg-white"
                                value={doctorAddress}
                                onChange={(e) => setDoctorAddress(e.target.value)}
                                disabled={isLoading || isFetchingDoctors || !selectedHospital}
                            >
                                <option value="">-- Choose a doctor --</option>
                                {doctors.map((doc) => (
                                    <option key={doc.walletAddress} value={doc.walletAddress}>
                                        {doc.name} ({formatAddress(doc.walletAddress)})
                                    </option>
                                ))}
                            </select>
                            {isFetchingDoctors && (
                                <p className="mt-2 text-xs text-primary-600">Loading doctors...</p>
                            )}
                            {!isFetchingDoctors && doctors.length === 0 && (
                                <p className="mt-2 text-xs text-red-500">No doctors registered for this hospital.</p>
                            )}
                        </div>
                    )}

                    <p className="mt-2 text-xs text-gray-500">
                        The selected doctor will be granted access to decrypt and view all your stored records.
                    </p>
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        disabled={!doctorAddress || isLoading}
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
