import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useWallet } from '../../hooks/useWallet';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { UserCircle } from 'lucide-react';
import { getUserName } from '../../utils/nameStorage';

export const DoctorProfileForm = ({ onComplete }) => {
    const { account } = useWallet();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hospitals, setHospitals] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        hospitalId: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hospRes = await axios.get('http://localhost:5000/hospitals').catch(() => ({ data: [] }));
                setHospitals(hospRes.data || []);
                
                // Get name from localStorage as initial value
                const storedName = getUserName(account);
                setFormData(prev => ({ ...prev, name: storedName || '' }));
            } catch (err) {
                console.error("Error fetching hospitals:", err);
            } finally {
                setLoading(false);
            }
        };
        if (account) {
            fetchData();
        }
    }, [account]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.hospitalId) {
            alert("Please select a hospital");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                walletAddress: account,
                name: formData.name,
                hospitalId: formData.hospitalId
            };
            
            await axios.post('http://localhost:5000/api/doctors', payload);
            if (onComplete) onComplete();
        } catch (err) {
            console.error("Error saving doctor profile:", err);
            alert("Failed to save profile. Is the backend running?");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Spinner /></div>;

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <UserCircle className="h-10 w-10 text-primary-600" />
                </div>
                <CardTitle className="text-2xl">Complete Your Doctor Profile</CardTitle>
                <p className="text-gray-500 mt-2">
                    Please associate yourself with a hospital so patients can find you.
                </p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                        <input 
                            required 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2" 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Your Wallet Address</label>
                        <input 
                            type="text" 
                            disabled 
                            value={account} 
                            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm text-gray-500 text-sm border p-2" 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hospital Affiliation *</label>
                        <select 
                            required 
                            name="hospitalId" 
                            value={formData.hospitalId} 
                            onChange={handleChange} 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 border p-2"
                        >
                            <option value="">Select your hospital</option>
                            {hospitals.map(h => (
                                <option key={h._id} value={h._id}>{h.name}</option>
                            ))}
                        </select>
                        <p className="mt-2 text-xs text-gray-500">
                            Patients at this hospital will be able to see you in their access control list.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" disabled={saving || !formData.hospitalId} className="w-full">
                            {saving ? 'Saving...' : 'Complete Registration'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
