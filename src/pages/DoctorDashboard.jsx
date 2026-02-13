import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { PatientSearch } from '../components/doctor/PatientSearch';
import { AccessibleRecords } from '../components/doctor/AccessibleRecords';
import { AuditLog } from '../components/audit/AuditLog';
import { Search, Activity } from 'lucide-react';

export const DoctorDashboard = () => {
    const [activeTab, setActiveTab] = useState('search');
    const [searchedPatient, setSearchedPatient] = useState(null);

    const tabs = [
        { id: 'search', label: 'Patient Search', icon: Search },
        { id: 'audit', label: 'My Activity', icon: Activity },
    ];

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
                                            <h3 className="text-lg font-medium text-gray-700">
                                                Records for: <span className="font-mono text-primary-600">{searchedPatient}</span>
                                            </h3>
                                            <button
                                                onClick={() => setSearchedPatient(null)}
                                                className="text-sm text-gray-500 hover:text-gray-700"
                                            >
                                                Clear Search
                                            </button>
                                        </div>
                                        <AccessibleRecords patientAddress={searchedPatient} />
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'audit' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900">System Activity Log</h2>
                                <AuditLog />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
