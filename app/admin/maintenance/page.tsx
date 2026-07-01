"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, Calendar, MapPin, AlertCircle, Phone, Mail, User } from "lucide-react";
import clsx from "clsx";

export default function AdminMaintenancePage() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            router.push("/dashboard");
        }
    }, [isLoading, user, router]);

    const fetchMaintenance = async () => {
        if (user && user.role === 'admin' && token) {
            try {
                const res = await fetch("/api/maintenance", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success && data.requests) setRequests(data.requests);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchMaintenance();
        const interval = setInterval(fetchMaintenance, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [user, token]);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/maintenance/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setRequests(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
                if (selectedRequest && selectedRequest._id === id) {
                    setSelectedRequest({ ...selectedRequest, status: newStatus });
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (isLoading || loading) {
        return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-solar-orange" /></div>;
    }

    const filteredRequests = requests.filter(req => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            (req.client?.name?.toLowerCase().includes(term) || "") ||
            (req.client?.email?.toLowerCase().includes(term) || "") ||
            (req.client?.phone?.toLowerCase().includes(term) || "") ||
            (req.systemType?.toLowerCase().includes(term) || "");

        if (!matchesSearch) return false;

        const reqDate = new Date(req.createdAt);
        if (startDate && reqDate < new Date(startDate)) return false;
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (reqDate > end) return false;
        }

        return true;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-deep-blue mb-2">Demandes de Maintenance</h1>
                <p className="text-gray-500">Gérez les interventions techniques et le suivi client</p>
            </header>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Recherche</label>
                    <input
                        type="text"
                        placeholder="Nom, Email, Téléphone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-solar-orange outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date Début</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-solar-orange outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date Fin</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-solar-orange outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Système</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Localisation</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Urgence</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        Aucune demande trouvée.
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((request) => (
                                    <tr
                                        key={request._id}
                                        className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                        onClick={() => setSelectedRequest(request)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-solar-orange/10 flex items-center justify-center text-solar-orange ring-2 ring-transparent group-hover:ring-solar-orange/20 transition-all">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{request.client?.name || 'Inconnu'}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1 font-medium"><Phone className="w-3 h-3" /> {request.client?.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-deep-blue">{request.systemType}</div>
                                            <div className="text-xs text-gray-500 font-medium">{request.category}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-1">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                                <div className="text-sm text-gray-600">
                                                    <div className="font-semibold">{request.governorate}</div>
                                                    <div className="text-xs text-gray-400">{request.city}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full",
                                                request.urgency === 'Critique' ? "bg-red-100 text-red-700" :
                                                    request.urgency === 'Haute' ? "bg-orange-100 text-orange-700" :
                                                        "bg-blue-50 text-blue-700"
                                            )}>
                                                {request.urgency}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={clsx(
                                                "px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full",
                                                request.status === 'Resolved' ? "bg-green-100 text-green-700" :
                                                    request.status === 'In Progress' ? "bg-blue-100 text-blue-700" :
                                                        "bg-yellow-100 text-yellow-700"
                                            )}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-solar-orange font-bold text-sm hover:underline">
                                                Voir détails
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Maintenance Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-4xl max-w-2xl w-full p-8 shadow-2xl relative">
                        <button
                            onClick={() => setSelectedRequest(null)}
                            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <AlertCircle className="w-6 h-6 text-gray-400" />
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-solar-orange/10 flex items-center justify-center text-solar-orange">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-deep-blue">Détails de Maintenance</h2>
                                <p className="text-gray-500 font-medium text-sm">Référence: {selectedRequest._id.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Informations Client</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm">
                                            <User className="w-4 h-4 text-solar-orange" />
                                            <span className="text-sm font-bold text-gray-900">{selectedRequest.client?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm">
                                            <Mail className="w-4 h-4 text-solar-orange" />
                                            <span className="text-sm font-bold text-gray-900">{selectedRequest.client?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm">
                                            <Phone className="w-4 h-4 text-solar-orange" />
                                            <span className="text-sm font-bold text-gray-900">{selectedRequest.client?.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Service Demandé</h3>
                                    <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                                        <div className="text-lg font-bold text-deep-blue mb-1">{selectedRequest.systemType}</div>
                                        <div className="text-sm font-bold text-solar-orange uppercase tracking-wide">{selectedRequest.category} • {selectedRequest.type}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Localisation</h3>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-solar-orange" />
                                            <span className="text-sm font-bold text-gray-900">{selectedRequest.governorate}</span>
                                        </div>
                                        <div className="text-sm font-medium text-gray-600 ml-6">{selectedRequest.city}</div>
                                        <div className="text-xs text-gray-500 ml-6 leading-relaxed italic">"{selectedRequest.address}"</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Description du Problème</h3>
                                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedRequest.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <span className="text-sm font-bold text-gray-500 whitespace-nowrap">Statut actuel:</span>
                                <select
                                    className="flex-1 sm:w-48 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-deep-blue focus:ring-2 focus:ring-solar-orange/20 outline-none transition-all shadow-sm"
                                    value={selectedRequest.status}
                                    onChange={(e) => updateStatus(selectedRequest._id, e.target.value)}
                                >
                                    <option value="Pending">En attente (Pending)</option>
                                    <option value="In Progress">Intervention en cours</option>
                                    <option value="Resolved">Résolu (Completed)</option>
                                    <option value="Rejected">Rejeté</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="w-full sm:w-auto px-8 py-3 bg-deep-blue text-white font-bold rounded-xl hover:bg-solar-orange transition-all shadow-lg"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
