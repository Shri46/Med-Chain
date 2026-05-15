import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContract } from '../../hooks/useContract';
import { Spinner } from '../ui/Spinner';
import { AccessibleRecords } from './AccessibleRecords';
import { Card, CardContent } from '../ui/Card';
import { User, Phone, Mail, Activity, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PatientProfileCard = ({ patientAddress }) => {
    const { getPatientRecords } = useContract();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const verifyAndFetch = async () => {
            if (!patientAddress) return;
            setLoading(true);
            try {
                // 1. Verify access via blockchain
                const records = await getPatientRecords(patientAddress);
                setAuthorized(true);

                // 2. Fetch profile from MongoDB
                const res = await axios.get(`http://localhost:5000/patients/${patientAddress}`);
                if (res.data && res.data.walletAddress) {
                    setProfile(res.data);
                }
            } catch (err) {
                console.error(err);
                setAuthorized(false);
                showToast("Access Denied or Patient Not Found", "error");
            } finally {
                setLoading(false);
            }
        };

        verifyAndFetch();
    }, [patientAddress, getPatientRecords, showToast]);

    if (loading) {
        return <div className="flex justify-center p-8"><Spinner size="lg" /></div>;
    }

    if (!authorized) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6 text-center text-red-600">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
                    <h3 className="text-lg font-bold">Access Denied</h3>
                    <p>You do not have permission to view this patient's profile.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="overflow-hidden border-t-4 border-t-primary-600">
                <CardContent className="p-0">
                    <div className="bg-white p-6 sm:p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-primary-100 p-4 rounded-full">
                                <User className="w-8 h-8 text-primary-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{profile?.name || 'Unknown Patient'}</h2>
                                <p className="text-sm text-gray-500 font-mono">{patientAddress}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Personal Info</h3>
                                <div className="space-y-2">
                                    <p><span className="text-gray-500">DOB:</span> <span className="font-medium">{profile?.dob || 'N/A'}</span></p>
                                    <p><span className="text-gray-500">Gender:</span> <span className="font-medium">{profile?.gender || 'N/A'}</span></p>
                                    <p><span className="text-gray-500">Blood Group:</span> <span className="font-medium text-red-600">{profile?.bloodGroup || 'N/A'}</span></p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact Details</h3>
                                <div className="space-y-2">
                                    <p className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-gray-400" /> {profile?.phoneNumber || 'N/A'}
                                    </p>
                                    <p className="flex items-center gap-2 text-sm">
                                        <Mail className="w-4 h-4 text-gray-400" /> {profile?.email || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Guardian Info</h3>
                                <div className="space-y-2">
                                    <p><span className="text-gray-500">Name:</span> <span className="font-medium">{profile?.guardianName || 'N/A'}</span></p>
                                    <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{profile?.guardianPhone || 'N/A'}</span></p>
                                </div>
                            </div>
                        </div>

                        {(profile?.allergies || profile?.chronicConditions || profile?.emergencyNotes) && (
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> Medical Notes
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-orange-50 p-4 rounded-lg">
                                    {profile?.allergies && (
                                        <div>
                                            <p className="text-xs font-semibold text-orange-800 uppercase">Allergies</p>
                                            <p className="text-sm text-orange-900 mt-1">{profile.allergies}</p>
                                        </div>
                                    )}
                                    {profile?.chronicConditions && (
                                        <div>
                                            <p className="text-xs font-semibold text-orange-800 uppercase">Chronic Conditions</p>
                                            <p className="text-sm text-orange-900 mt-1">{profile.chronicConditions}</p>
                                        </div>
                                    )}
                                    {profile?.emergencyNotes && (
                                        <div>
                                            <p className="text-xs font-semibold text-red-800 uppercase">Emergency Notes</p>
                                            <p className="text-sm text-red-900 mt-1 font-medium">{profile.emergencyNotes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8">
                <AccessibleRecords patientAddress={patientAddress} />
            </div>
        </div>
    );
};
