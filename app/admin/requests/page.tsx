"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, CheckCircle, XCircle, Clock } from "lucide-react";
import clsx from "clsx";

export default function AdminDashboardPage() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [updating, setUpdating] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            router.push("/dashboard");
        }
    }, [isLoading, user, router]);

    const fetchRequests = async () => {
        if (user && user.role === 'admin' && token) {
            try {
                const res = await fetch("/api/requests", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.requests) setRequests(data.requests);
            } catch (error) {
                console.error("Failed to fetch requests", error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [user, token]);

    const STATUS_OPTIONS = [
        'Pending', 'Vérifié', 'Visite technique',
        'Étude du projet', 'Travaux', 'Mise en service', 'Completed'
    ];

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdating(true);
        try {
            const res = await fetch(`/api/requests/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setRequests(requests.map(r => r._id === id ? { ...r, status: newStatus } : r));
                if (selectedRequest) setSelectedRequest({ ...selectedRequest, status: newStatus });
            }
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setUpdating(false);
        }
    };

    if (isLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-solar-orange" /></div>;
    }

    const filteredRequests = requests.filter(req => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            (req.client?.name?.toLowerCase().includes(term) || "") ||
            (req.name?.toLowerCase().includes(term) || "") ||
            (req.client?.email?.toLowerCase().includes(term) || "") ||
            (req.email?.toLowerCase().includes(term) || "") ||
            (req.client?.phone?.toLowerCase().includes(term) || "") ||
            (req.phone?.toLowerCase().includes(term) || "") ||
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
        <div className="bg-background-light min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-deep-blue mb-8">Tableau de Bord Administrateur</h1>

                {/* Filters */}
                <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
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

                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800">Demandes d'Installation ({filteredRequests.length})</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lieu</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredRequests.map((request) => (
                                    <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{request.client?.name || request.name || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{request.client?.email || request.email}</div>
                                            <div className="text-xs text-gray-500">{request.client?.phone || request.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{request.governorate}</div>
                                            <div className="text-xs text-gray-500">{request.city}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{request.systemType}</div>
                                            <div className="text-xs text-gray-500">{request.category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={clsx(
                                                "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
                                                request.status === 'Pending' ? "bg-yellow-100 text-yellow-800" :
                                                    request.status === 'Completed' ? "bg-green-100 text-green-800" :
                                                        "bg-blue-100 text-blue-800"
                                            )}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => setSelectedRequest(request)}
                                                className="text-solar-orange hover:text-solar-yellow font-medium"
                                            >
                                                Voir Détails
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* DETAILS MODAL */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-deep-blue">Détails de la Demande</h2>
                            <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <XCircle className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Status Section */}
                            <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Mettre à jour le statut</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={selectedRequest.status}
                                            onChange={(e) => updateStatus(selectedRequest._id, e.target.value)}
                                            disabled={updating}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-orange outline-none bg-white font-medium"
                                        >
                                            {STATUS_OPTIONS.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Puissance Installée (kW)</label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={selectedRequest.powerKW || ''}
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                setSelectedRequest({ ...selectedRequest, powerKW: isNaN(val) ? undefined : val });
                                            }}
                                            placeholder="Ex: 5.5"
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-orange outline-none bg-white font-medium"
                                        />
                                        <button
                                            onClick={async () => {
                                                setUpdating(true);
                                                try {
                                                    const res = await fetch(`/api/requests/${selectedRequest._id}`, {
                                                        method: 'PATCH',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ powerKW: selectedRequest.powerKW })
                                                    });
                                                    if (res.ok) {
                                                        // Update local state
                                                        setRequests(requests.map(r => r._id === selectedRequest._id ? { ...r, powerKW: selectedRequest.powerKW } : r));
                                                    }
                                                } catch (err) {
                                                    console.error("Failed to update power", err);
                                                } finally {
                                                    setUpdating(false);
                                                }
                                            }}
                                            disabled={updating}
                                            className="bg-solar-orange text-white px-4 py-3 rounded-xl font-bold hover:bg-solar-yellow transition-colors disabled:opacity-50"
                                        >
                                            {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sauvegarder"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Client</h3>
                                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                        <div className="font-bold text-gray-900 text-lg mb-1">{selectedRequest.client?.name || selectedRequest.name}</div>
                                        <div className="text-gray-600 flex items-center gap-2 text-sm mb-1">
                                            <span className="opacity-75">📧</span> {selectedRequest.client?.email || selectedRequest.email}
                                        </div>
                                        <div className="text-gray-600 flex items-center gap-2 text-sm">
                                            <span className="opacity-75">📱</span> {selectedRequest.client?.phone || selectedRequest.phone}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Installation</h3>
                                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Type:</span>
                                            <span className="font-medium text-deep-blue">{selectedRequest.systemType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Catégorie:</span>
                                            <span className="font-medium text-deep-blue">{selectedRequest.category}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Localisation</h3>
                                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-solar-orange shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-medium text-gray-900">{selectedRequest.address}</div>
                                        <div className="text-gray-500">{selectedRequest.city}, {selectedRequest.governorate}</div>
                                        {selectedRequest.coordinates && (
                                            <a
                                                href={`https://www.google.com/maps?q=${selectedRequest.coordinates.lat},${selectedRequest.coordinates.lng}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-600 hover:underline mt-1 block"
                                            >
                                                Voir sur Google Maps
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {selectedRequest.clientComment && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Commentaire Client</h3>
                                    <div className="bg-gray-50 rounded-xl p-4 text-gray-700 italic border-l-4 border-solar-yellow">
                                        "{selectedRequest.clientComment}"
                                    </div>
                                </div>
                            )}

                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex justify-end">
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
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
