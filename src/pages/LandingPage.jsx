import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { Button } from '../components/ui/Button';
import { Wallet, Shield, Lock, Database, UserCheck, Activity, Upload } from 'lucide-react';

export const LandingPage = () => {
    const { connectWallet, isConnecting } = useWallet();

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 to-primary-700 text-white">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm animate-pulse">
                                <Activity className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                            Your Health Records. <span className="text-primary-200">Your Control.</span>
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-xl text-primary-100">
                            A decentralized, secure, and patient-centric system for managing medical history. No central servers, just you and your blockchain-secured data.
                        </p>
                        <div className="mt-10 flex justify-center gap-4">
                            <Button
                                onClick={connectWallet}
                                isLoading={isConnecting}
                                size="lg"
                                className="bg-white text-primary-900 hover:bg-primary-50 px-8 py-3 text-lg"
                            >
                                <Wallet className="mr-2 h-5 w-5" />
                                Connect Wallet
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
                            >
                                Learn How It Works
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-primary-800 border-t border-primary-700">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
                        <div>
                            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">Security</dt>
                            <dd className="order-1 text-4xl font-extrabold text-white">100% Encrypted</dd>
                        </div>
                        <div>
                            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">Central Servers</dt>
                            <dd className="order-1 text-4xl font-extrabold text-white">0</dd>
                        </div>
                        <div>
                            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">Ownership</dt>
                            <dd className="order-1 text-4xl font-extrabold text-white">Patient-Owned</dd>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Workflow</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            How it works
                        </p>
                    </div>
                    <div className="mt-20">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                            {/* Step 1 */}
                            <div className="text-center">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mx-auto mb-4">
                                    <Upload className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">1. Upload</h3>
                                <p className="mt-2 text-gray-500">Patient uploads medical records (PDF, Images).</p>
                            </div>
                            {/* Step 2 */}
                            <div className="text-center">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mx-auto mb-4">
                                    <Lock className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">2. Encrypt</h3>
                                <p className="mt-2 text-gray-500">Files are encrypted locally using AES-256-GCM.</p>
                            </div>
                            {/* Step 3 */}
                            <div className="text-center">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mx-auto mb-4">
                                    <Database className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">3. Store</h3>
                                <p className="mt-2 text-gray-500">Encrypted files go to IPFS. Hashes go to Blockchain.</p>
                            </div>
                            {/* Step 4 */}
                            <div className="text-center">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mx-auto mb-4">
                                    <UserCheck className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">4. Control</h3>
                                <p className="mt-2 text-gray-500">Patient grants specific doctors access to view records.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                            <Shield className="h-10 w-10 text-primary-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Blockchain Security</h3>
                            <p className="text-gray-500">Immutable record of all interactions and access grants on Ethereum.</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                            <Lock className="h-10 w-10 text-primary-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">End-to-End Encryption</h3>
                            <p className="text-gray-500">Client-side encryption ensures only authorized parties can decrypt records.</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                            <UserCheck className="h-10 w-10 text-primary-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Role-Based Access</h3>
                            <p className="text-gray-500">Separation of concerns between patients and doctors with strict controls.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gray-900">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <h2 className="text-3xl font-extrabold text-white text-center">
                        Ready to take control of your health data?
                    </h2>
                    <div className="mt-8 flex justify-center">
                        <Button onClick={connectWallet} isLoading={isConnecting} className="px-8 py-3 text-lg">
                            Launch App
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
