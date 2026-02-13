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

export const DashboardRouter = () => {
    const { account, isConnecting, isInitializing } = useWallet();
    const { getRole, registerRole } = useContract();
    const [role, setRole] = useState(null); // 'patient', 'doctor', or ''
    const [loading, setLoading] = useState(false);
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

    const handleRoleRegister = async (selectedRole) => {
        const success = await registerRole(selectedRole);
        if (success) {
            setRole(selectedRole);
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

                    {/* Doctor Card */}
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
                </div>
            </div>
        </div>
    );
};
