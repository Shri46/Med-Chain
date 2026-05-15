import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { PatientSearch } from '../components/doctor/PatientSearch';
import { PatientProfileCard } from '../components/doctor/PatientProfileCard';
import { AuditLog } from '../components/audit/AuditLog';
import { ProfileSettings } from '../components/audit/ProfileSettings';
import { Search, Activity, UserCircle } from 'lucide-react';
import { getUserName } from '../utils/nameStorage';
import { formatAddress } from '../utils/formatters';
import { useWallet } from '../hooks/useWallet';
import axios from 'axios';
import { Spinner } from '../components/ui/Spinner';
import { DoctorProfileForm } from '../components/doctor/DoctorProfileForm';

export const DoctorDashboard = () => {
    const { account } = useWallet();
    const [activeTab, setActiveTab] = useState('search');
    const [searchedPatient, setSearchedPatient] = useState(null);
    const [profileExists, setProfileExists] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkProfile = React.useCallback(async () => {
        if (account) {
            try {
                const res = await axios.get(`http://localhost:5000/api/doctors/${account}`);
                setProfileExists(!!res.data.walletAddress);
            } catch (err) {
                setProfileExists(false);
            } finally {
                setLoading(false);
            }
        }
    }, [account]);

    React.useEffect(() => {
        checkProfile();
    }, [checkProfile]);

    const tabs = [
        { id: 'search', label: 'Patient Search', icon: Search },
        { id: 'audit', label: 'My Activity', icon: Activity },
        { id: 'profile', label: 'Profile', icon: UserCircle },
    ];

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-50"><Spinner size="lg" /></div>;
    }

    if (!profileExists) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-3xl">
                        <DoctorProfileForm onComplete={checkProfile} />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="md:grid md:grid-cols-12 md:gap-6">
                    {/* Sidebar Navigation */}
                    <aside className="md:col-span-3 mb-6 md:mb-0">
                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                            ${activeTab === tab.id
                                                ? 'bg-blue-50 text-primary-700 border-l-4 border-primary-600'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                        `}
                                    >
                                        <Icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'}`} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <div className="md:col-span-9">
                        {activeTab === 'search' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Patient Records</h2>
                                <PatientSearch onSearch={setSearchedPatient} />

                                {searchedPatient && (
                                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-center justify-between mb-4">
                                            <button
                                                onClick={() => setSearchedPatient(null)}
                                                className="text-sm font-medium text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1 rounded-md"
                                            >
                                                &larr; Back to Search
                                            </button>
                                        </div>
                                        <PatientProfileCard patientAddress={searchedPatient} />
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'audit' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">System Activity Log</h2>
                                <AuditLog role="doctor" account={account} />
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                                <ProfileSettings />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
