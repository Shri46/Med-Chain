import React, { useEffect, useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useContract } from '../hooks/useContract';
import { PatientDashboard } from './PatientDashboard';
import { DoctorDashboard } from './DoctorDashboard';
import { LandingPage } from './LandingPage';
import { Spinner } from '../components/ui/Spinner';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { saveUserName } from '../utils/nameStorage';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const DashboardRouter = () => {
    const { account, isConnecting, isInitializing } = useWallet();
    const { getRole, registerRole } = useContract();
    const [role, setRole] = useState(null); // 'patient', 'doctor', or ''
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState('');
    const [nameError, setNameError] = useState('');
    
    // Doctor specific state
    const [hospitals, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState('');
    const [newHospitalName, setNewHospitalName] = useState('');
    const [isCreatingHospital, setIsCreatingHospital] = useState(false);
    const [showDoctorForm, setShowDoctorForm] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const checkRole = async () => {
            if (account) {
                setLoading(true);
                const userRole = await getRole(account);
                console.log("Checked Role for", account, ":", userRole);
                setRole(userRole);
                setLoading(false);
            } else {
                setRole(null);
            }
        };
        checkRole();
    }, [account, getRole]);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/hospitals`);
                setHospitals(res.data);
            } catch (error) {
                console.error('Error fetching hospitals:', error);
            }
        };
        fetchHospitals();
    }, []);

    const handleRoleRegister = async (selectedRole) => {
        if (!fullName.trim()) {
            setNameError('Please enter your full name');
            return;
        }

        if (selectedRole === 'doctor') {
            if (!showDoctorForm) {
                setShowDoctorForm(true);
                setNameError('');
                return;
            }

            if (isCreatingHospital && !newHospitalName.trim()) {
                setNameError('Please enter hospital name');
                return;
            }
            if (!isCreatingHospital && !selectedHospital) {
                setNameError('Please select a hospital');
                return;
            }
        }

        setNameError('');
        setLoading(true);
        
        try {
            if (selectedRole === 'doctor') {
                let finalHospitalId = selectedHospital;
                if (isCreatingHospital) {
                    const hRes = await axios.post(`${BACKEND_URL}/hospitals`, { name: newHospitalName.trim() });
                    finalHospitalId = hRes.data._id;
                }
                await axios.post(`${BACKEND_URL}/doctors`, {
                    name: fullName.trim(),
                    walletAddress: account,
                    hospitalId: finalHospitalId
                });
            }

            const success = await registerRole(selectedRole);
            if (success) {
                saveUserName(account, fullName.trim());
                setRole(selectedRole);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setNameError('Error during registration. Please check backend is running.');
        } finally {
            setLoading(false);
        }
    };

    if (isConnecting || loading || isInitializing) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!account) {
        return <LandingPage />;
    }

    if (role === 'patient') {
        return <PatientDashboard />;
    }

    if (role === 'doctor') {
        return <DoctorDashboard />;
    }

    // Role Selection Screen
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Welcome to MedChain
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        Please select your role to continue
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Common Name Input (Always shown before role selection) */}
                    <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                            Enter Your Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value);
                                if (e.target.value.trim()) setNameError('');
                            }}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${nameError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary-200 focus:border-primary-500'}`}
                            placeholder="e.g. John Doe"
                        />
                        {nameError && !showDoctorForm && <p className="mt-2 text-sm text-red-600">{nameError}</p>}
                    </div>

                    {!showDoctorForm ? (
                        <>
                            {/* Patient Card */}
                            <Card className="hover:ring-4 hover:ring-primary-100 transition-all cursor-pointer group" onClick={() => handleRoleRegister('patient')}>
                                <CardContent className="p-8 text-center flex flex-col items-center h-full justify-between">
                                    <div className="bg-primary-50 p-6 rounded-full group-hover:bg-primary-100 transition-colors">
                                        <User className="h-12 w-12 text-primary-600" />
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="text-xl font-bold text-gray-900">I am a Patient</h3>
                                        <p className="mt-2 text-gray-500">
                                            Store your medical records securely, manage access controls, and own your data.
                                        </p>
                                    </div>
                                    <Button className="mt-8 w-full">Continue as Patient</Button>
                                </CardContent>
                            </Card>

                            {/* Doctor Card (Initial) */}
                            <Card className="hover:ring-4 hover:ring-primary-100 transition-all cursor-pointer group" onClick={() => handleRoleRegister('doctor')}>
                                <CardContent className="p-8 text-center flex flex-col items-center h-full justify-between">
                                    <div className="bg-green-50 p-6 rounded-full group-hover:bg-green-100 transition-colors">
                                        <Stethoscope className="h-12 w-12 text-green-600" />
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="text-xl font-bold text-gray-900">I am a Doctor</h3>
                                        <p className="mt-2 text-gray-500">
                                            Access patient records with permission, review history, and provide better care.
                                        </p>
                                    </div>
                                    <Button variant="secondary" className="mt-8 w-full border-primary-600 text-primary-600 hover:bg-primary-50">Continue as Doctor</Button>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <div className="md:col-span-2">
                            {/* Doctor Registration Form (Expanded) */}
                            <Card className="border border-green-200">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="bg-green-50 p-3 rounded-full">
                                            <Stethoscope className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900">Doctor Registration</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Hospital</label>
                                            <select
                                                value={isCreatingHospital ? 'new' : selectedHospital}
                                                onChange={(e) => {
                                                    setNameError('');
                                                    if (e.target.value === 'new') {
                                                        setIsCreatingHospital(true);
                                                        setSelectedHospital('');
                                                    } else {
                                                        setIsCreatingHospital(false);
                                                        setSelectedHospital(e.target.value);
                                                    }
                                                }}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                                            >
                                                <option value="">-- Select a Hospital --</option>
                                                {hospitals.map(h => (
                                                    <option key={h._id} value={h._id}>{h.name}</option>
                                                ))}
                                                <option value="new">+ Create New Hospital</option>
                                            </select>
                                        </div>

                                        {isCreatingHospital && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">New Hospital Name</label>
                                                <input
                                                    type="text"
                                                    value={newHospitalName}
                                                    onChange={(e) => setNewHospitalName(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-200 focus:border-primary-500"
                                                    placeholder="Enter hospital name"
                                                />
                                            </div>
                                        )}

                                        {nameError && showDoctorForm && <p className="text-sm text-red-600">{nameError}</p>}

                                        <div className="flex gap-4 pt-4">
                                            <Button variant="secondary" onClick={() => setShowDoctorForm(false)} className="w-full">Back</Button>
                                            <Button onClick={() => handleRoleRegister('doctor')} className="w-full bg-green-600 hover:bg-green-700">Complete Registration</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
