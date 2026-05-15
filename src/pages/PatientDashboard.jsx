import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { UploadRecord } from '../components/patient/UploadRecord';
import { RecordList } from '../components/patient/RecordList';
import { AuditLog } from '../components/audit/AuditLog';
import { ProfileSettings } from '../components/audit/ProfileSettings';
import { PatientProfileForm } from '../components/patient/PatientProfileForm';
import { GrantAccessForm } from '../components/patient/GrantAccessForm';
import { RevokeAccessForm } from '../components/patient/RevokeAccessForm';
import { AuthorizedDoctors } from '../components/patient/AuthorizedDoctors';
import { FolderPlus, Users, Activity, FileText, UserCircle, Shield } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { Spinner } from '../components/ui/Spinner';
import axios from 'axios';

export const PatientDashboard = () => {
    const { account } = useWallet();
    const [activeTab, setActiveTab] = useState('records');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [profileExists, setProfileExists] = useState(false);
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkProfile = React.useCallback(async () => {
        if (account) {
            try {
                const res = await axios.get(`http://localhost:5000/patients/${account}`);
                if (res.data && res.data.walletAddress) {
                    setPatient(res.data);
                    setProfileExists(true);
                } else {
                    setPatient(null);
                    setProfileExists(false);
                }
            } catch (err) {
                setPatient(null);
                setProfileExists(false);
            } finally {
                setLoading(false);
            }
        }
    }, [account]);

    React.useEffect(() => {
        checkProfile();
    }, [checkProfile]);

    const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

    const tabs = [
        { id: 'records', label: 'My Records', icon: FileText },
        { id: 'upload', label: 'Upload Record', icon: FolderPlus },
        { id: 'access', label: 'Access Control', icon: Shield },
        { id: 'audit', label: 'Activity Log', icon: Activity },
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
                        <PatientProfileForm onComplete={checkProfile} />
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
                        {activeTab === 'records' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">My Medical Records</h2>
                                <RecordList refreshTrigger={refreshTrigger} />
                            </div>
                        )}

                        {activeTab === 'upload' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Upload New Record</h2>
                                <UploadRecord onUploadSuccess={() => {
                                    handleRefresh();
                                    setActiveTab('records');
                                }} />
                            </div>
                        )}

                        {activeTab === 'access' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Access Control</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <GrantAccessForm 
                                            onSuccess={handleRefresh} 
                                            hospitalId={patient?.hospitalId?._id || patient?.hospitalId} 
                                        />
                                        <RevokeAccessForm onSuccess={handleRefresh} />
                                    </div>
                                    <div>
                                        <AuthorizedDoctors refreshTrigger={refreshTrigger} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'audit' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
                                <AuditLog role="patient" account={account} />
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                                <PatientProfileForm onComplete={() => {}} />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
