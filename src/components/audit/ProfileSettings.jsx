import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { getUserName, saveUserName } from '../../utils/nameStorage';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { User } from 'lucide-react';

export const ProfileSettings = () => {
    const { account } = useWallet();
    const [fullName, setFullName] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (account) {
            const currentName = getUserName(account);
            if (currentName) {
                setFullName(currentName);
            }
        }
    }, [account]);

    const handleSave = (e) => {
        e.preventDefault();
        if (account && fullName.trim()) {
            saveUserName(account, fullName.trim());
            setIsSaved(true);

            // Reload window to instantly reflect real name across all components
            // Alternatively, could use a context, but reload is easiest for this scope
            setTimeout(() => {
                window.location.reload();
            }, 800);
        }
    };

    return (
        <Card className="max-w-2xl">
            <CardHeader className="flex flex-row items-center space-x-2">
                <div className="bg-primary-50 p-2 rounded-lg">
                    <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                    <CardTitle>Profile Settings</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Manage your displayed name and account details.</p>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <div className="mt-1">
                            <input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => {
                                    setFullName(e.target.value);
                                    setIsSaved(false);
                                }}
                                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                placeholder="e.g. John Doe or Dr. Sarah Smith"
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            This name will be visible to others when you interact with their records or grant access.
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button type="submit" disabled={!fullName.trim()}>
                            {isSaved ? "Saved!" : "Save Changes"}
                        </Button>
                        {isSaved && (
                            <span className="text-sm text-green-600 font-medium">
                                Refreshing to apply changes...
                            </span>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
