import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useWallet } from '../../hooks/useWallet';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';

export const PatientProfileForm = ({ onComplete }) => {
    const { account } = useWallet();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hospitals, setHospitals] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        hospitalId: '',
        newHospitalName: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        phoneNumber: '',
        email: '',
        guardianName: '',
        guardianPhone: '',
        guardianEmail: '',
        allergies: '',
        chronicConditions: '',
        emergencyNotes: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hospRes, patRes] = await Promise.all([
                    axios.get('http://localhost:5000/hospitals').catch(() => ({ data: [] })),
                    axios.get(`http://localhost:5000/patients/${account}`).catch(() => ({ data: null }))
                ]);
                
                setHospitals(hospRes.data || []);
                
                if (patRes.data && !patRes.data.message) {
                    const pd = patRes.data;
                    setFormData(prev => ({
                        ...prev,
                        name: pd.name || '',
                        hospitalId: pd.hospitalId?._id || pd.hospitalId || '',
                        dob: pd.dob || '',
                        gender: pd.gender || '',
                        bloodGroup: pd.bloodGroup || '',
                        phoneNumber: pd.phoneNumber || '',
                        email: pd.email || '',
                        guardianName: pd.guardianName || '',
                        guardianPhone: pd.guardianPhone || '',
                        guardianEmail: pd.guardianEmail || '',
                        allergies: pd.allergies || '',
                        chronicConditions: pd.chronicConditions || '',
                        emergencyNotes: pd.emergencyNotes || ''
                    }));
                }
            } catch (err) {
                console.error("Error fetching data:", err);
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
        setSaving(true);
        try {
            let finalHospitalId = formData.hospitalId;

            // Create new hospital if 'new' is selected
            if (formData.hospitalId === 'new' && formData.newHospitalName.trim()) {
                const hRes = await axios.post('http://localhost:5000/hospitals', { name: formData.newHospitalName });
                finalHospitalId = hRes.data._id;
            }

            const payload = {
                walletAddress: account,
                ...formData,
                hospitalId: finalHospitalId === 'new' ? undefined : finalHospitalId
            };
            
            // Exclude newHospitalName from payload
            delete payload.newHospitalName;

            await axios.post('http://localhost:5000/patients/register', payload);
            if (onComplete) onComplete();
        } catch (err) {
            console.error("Error saving profile:", err);
            alert("Failed to save profile. Is the backend running?");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-6">Patient Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Public Key (Auto)</label>
                    <input type="text" disabled value={account} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm text-gray-500 text-xs" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Hospital Selection *</label>
                    <select required name="hospitalId" value={formData.hospitalId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                        <option value="">Select a Hospital</option>
                        {hospitals.map(h => (
                            <option key={h._id} value={h._id}>{h.name}</option>
                        ))}
                        <option value="new">+ Create New Hospital</option>
                    </select>
                </div>
                
                {formData.hospitalId === 'new' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Hospital Name *</label>
                        <input required type="text" name="newHospitalName" value={formData.newHospitalName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                    <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>
                
                <div className="md:col-span-2 pt-4 border-t">
                    <h3 className="text-lg font-medium">Guardian Information</h3>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
                    <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Guardian Phone</label>
                    <input type="tel" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Guardian Email</label>
                    <input type="email" name="guardianEmail" value={formData.guardianEmail} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>

                <div className="md:col-span-2 pt-4 border-t">
                    <h3 className="text-lg font-medium">Medical Information (Optional)</h3>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Allergies</label>
                    <textarea name="allergies" value={formData.allergies} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Chronic Conditions</label>
                    <textarea name="chronicConditions" value={formData.chronicConditions} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Emergency Notes</label>
                    <textarea name="emergencyNotes" value={formData.emergencyNotes} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Profile'}
                </Button>
            </div>
        </form>
    );
};
