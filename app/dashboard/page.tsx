"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, Calendar, MapPin, Zap, AlertCircle } from "lucide-react";
import clsx from "clsx";

export default function DashboardPage() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<any[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
    const [maintenanceForm, setMaintenanceForm] = useState({
        systemType: 'Raccordé au réseau',
        category: 'Résidentiel',
        governorate: 'Tunis',
        city: '',
        address: '',
        type: 'Curative',
        urgency: 'Moyenne',
        description: ''
    });

    const submitMaintenance = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            const res = await fetch('/api/maintenance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...maintenanceForm, client: user._id })
            });
            if (res.ok) {
                setShowMaintenanceModal(false);
                alert("Demande de maintenance envoyée !");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [isLoading, user, router]);

    const fetchRequests = async (isBackground = false) => {
        if (!user || !token) return;

        try {
            if (!isBackground) setFetchLoading(true);
            const res = await fetch("/api/requests", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.requests) {
                // Determine if we should update state to avoid unnecessary re-renders if data hasn't changed
                // For simplicity, we'll just set it for now, React handles shallow comparison efficiently enough for this size
                setRequests(data.requests);
            }
        } catch (err) {
            console.error(err);
        } finally {
            if (!isBackground) setFetchLoading(false);
        }
    };

    useEffect(() => {
        if (user && token) {
            // Initial fetch
            fetchRequests();

            // Setup polling every 5 seconds
            const intervalId = setInterval(() => {
                fetchRequests(true); // true = background update (no loading spinner)
            }, 5000);

            // Cleanup on unmount
            return () => clearInterval(intervalId);
        }
    }, [user, token]);

    if (isLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-solar-orange" /></div>;
    }

    return (
        <div className="bg-background-light min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-deep-blue">Mon Tableau de Bord</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowMaintenanceModal(true)}
                            className="bg-white border-2 border-solar-orange text-solar-orange font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-2"
                        >
                            <AlertCircle className="w-5 h-5" />
                            Demander Maintenance
                        </button>
                        <button
                            onClick={() => router.push("/request")}
                            className="bg-solar-yellow text-deep-blue font-bold px-6 py-3 rounded-xl hover:bg-solar-orange hover:text-white transition-colors"
                        >
                            + Nouvelle Installation
                        </button>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <div className="text-gray-500 text-sm font-medium mb-1">Projets en cours</div>
                        <div className="text-3xl font-bold text-deep-blue">{requests.length}</div>
                    </div>
                    {/* Add more stats if needed */}
                </div>

                <h2 className="text-xl font-bold text-deep-blue mb-6">Mes Demandes d'Installation</h2>

                {fetchLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune demande trouvée</h3>
                        <p className="text-gray-600 mb-6">Vous n'avez pas encore soumis de projet.</p>
                        <button
                            onClick={() => router.push("/request")}
                            className="bg-solar-yellow text-deep-blue font-bold px-6 py-3 rounded-xl hover:bg-solar-orange hover:text-white transition-colors"
                        >
                            Créer une nouvelle demande
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {requests.map((request) => {
                            const STATUS_STEPS = [
                                'Pending', 'Vérifié', 'Visite technique',
                                'Étude du projet', 'Travaux', 'Mise en service', 'Completed'
                            ];
                            const currentStepIndex = STATUS_STEPS.indexOf(request.status);

                            return (
                                <div key={request._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-50 pb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-deep-blue">Installation {request.category}</h3>
                                            <p className="text-sm text-gray-500">{request.systemType}</p>
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Progress Stepper */}
                                    <div className="mb-8 overflow-x-auto pb-4">
                                        <div className="flex items-center justify-between min-w-[600px] relative">
                                            {/* Connecting Line */}
                                            <div className="absolute left-0 top-4 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
                                            <div
                                                className="absolute left-0 top-4 h-1 bg-solar-green transition-all duration-500 rounded-full"
                                                style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                                            ></div>
                                            <div
                                                className="absolute left-0 top-4 h-1 bg-solar-orange transition-all duration-500 rounded-full"
                                                style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                                            ></div>

                                            {STATUS_STEPS.map((step, index) => {
                                                const isCompleted = index <= currentStepIndex;
                                                const isCurrent = index === currentStepIndex;

                                                return (
                                                    <div key={step} className="flex flex-col items-center gap-2 w-24">
                                                        <div className={clsx(
                                                            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors z-0 bg-white",
                                                            isCompleted ? "border-solar-orange bg-orange-50" : "border-gray-200",
                                                            isCurrent && "ring-4 ring-orange-100"
                                                        )}>
                                                            {index < currentStepIndex ? (
                                                                <div className="w-2.5 h-2.5 rounded-full bg-solar-orange" />
                                                            ) : isCurrent ? (
                                                                <div className="w-2.5 h-2.5 rounded-full bg-solar-orange animate-pulse" />
                                                            ) : (
                                                                <div className="w-2 h-2 rounded-full bg-gray-200" />
                                                            )}
                                                        </div>
                                                        <span className={clsx(
                                                            "text-[10px] uppercase font-bold text-center leading-tight max-w-[80px]",
                                                            isCompleted ? "text-solar-orange" : "text-gray-400"
                                                        )}>
                                                            {step === 'Pending' ? 'Reçu' : step}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <div className="font-medium text-gray-900">{request.city}, {request.governorate}</div>
                                                <div className="text-sm text-gray-500">{request.address}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Zap className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <div className="font-medium text-gray-900">Spécifications</div>
                                                <div className="text-sm text-gray-500">{request.systemType} - {request.category}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Maintenance Modal */}
            {showMaintenanceModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-deep-blue mb-6">Demande de Maintenance</h2>
                        <form onSubmit={submitMaintenance} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Type Système</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3"
                                        value={maintenanceForm.systemType}
                                        onChange={e => setMaintenanceForm({ ...maintenanceForm, systemType: e.target.value })}
                                    >
                                        <option>Raccordé au réseau</option>
                                        <option>Site isolé</option>
                                        <option>Pompage</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Catégorie</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3"
                                        value={maintenanceForm.category}
                                        onChange={e => setMaintenanceForm({ ...maintenanceForm, category: e.target.value })}
                                    >
                                        <option>Résidentiel</option>
                                        <option>Commercial</option>
                                        <option>Industriel</option>
                                        <option>Agricole</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Localisation</label>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3"
                                        value={maintenanceForm.governorate}
                                        onChange={e => setMaintenanceForm({ ...maintenanceForm, governorate: e.target.value })}
                                    >
                                        {[
                                            'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa',
                                            'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Le Kef',
                                            'Mahdia', 'La Manouba', 'Médenine', 'Monastir', 'Nabeul',
                                            'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine',
                                            'Tozeur', 'Tunis', 'Zaghouan'
                                        ].map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                    <input
                                        placeholder="Ville / Cité"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3"
                                        value={maintenanceForm.city}
                                        onChange={e => setMaintenanceForm({ ...maintenanceForm, city: e.target.value })}
                                        required
                                    />
                                </div>
                                <input
                                    placeholder="Adresse complète"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3"
                                    value={maintenanceForm.address}
                                    onChange={e => setMaintenanceForm({ ...maintenanceForm, address: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Urgence & Type</label>
                                <div className="flex gap-4">
                                    <select
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3"
                                        value={maintenanceForm.urgency}
                                        onChange={e => setMaintenanceForm({ ...maintenanceForm, urgency: e.target.value })}
                                    >
                                        <option>Faible</option>
                                        <option>Moyenne</option>
                                        <option>Haute</option>
                                        <option>Critique</option>
                                    </select>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="type" value="Curative" checked={maintenanceForm.type === 'Curative'} onChange={e => setMaintenanceForm({ ...maintenanceForm, type: e.target.value })} />
                                            Curative
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="type" value="Preventive" checked={maintenanceForm.type === 'Preventive'} onChange={e => setMaintenanceForm({ ...maintenanceForm, type: e.target.value })} />
                                            Préventive
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description du problème</label>
                                <textarea
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 h-24"
                                    placeholder="Décrivez le problème..."
                                    value={maintenanceForm.description}
                                    onChange={e => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowMaintenanceModal(false)} className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Annuler</button>
                                <button type="submit" className="flex-1 py-3 bg-solar-orange text-white font-bold rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-200">Envoyer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
