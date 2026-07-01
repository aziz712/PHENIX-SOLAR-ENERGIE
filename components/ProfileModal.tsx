"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, User as UserIcon, Mail, Lock, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { user, token, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setLoading(true);

        // Validation
        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: "Les mots de passe ne correspondent pas." });
            setLoading(false);
            return;
        }

        try {
            const body: any = {
                name: formData.name,
                email: formData.email
            };
            if (formData.password) {
                body.password = formData.password;
            }

            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Erreur lors de la mise à jour");
            }

            updateUser({ ...data, token: token || "" }); // Ensure token is compatible with User type if it expects it, or fix type
            // Actually userData usually doesn't have token in User interface.
            // Let's check AuthContext User interface:
            // interface User { _id, name, email, role }
            // So we just pass the data which includes _id, name, email, role.

            updateUser(data);

            setMessage({ type: 'success', text: "Profil mis à jour avec succès !" });
            setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));

            // Close after delay if success
            setTimeout(() => {
                onClose();
                setMessage(null);
            }, 1500);

        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-orange-50 p-3 rounded-full">
                        <UserIcon className="w-6 h-6 text-solar-orange" />
                    </div>
                    <h2 className="text-xl font-bold text-deep-blue">Modifier le profil</h2>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl flex items-center gap-2 mb-6 text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span>{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-solar-orange focus:border-solar-orange outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-solar-orange focus:border-solar-orange outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-4">
                        <p className="text-sm text-gray-500 mb-4">Changer le mot de passe (Laisser vide pour conserver)</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-solar-orange focus:border-solar-orange outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {formData.password && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer mot de passe</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-solar-orange focus:border-solar-orange outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-solar-orange text-white font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enregistrer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
