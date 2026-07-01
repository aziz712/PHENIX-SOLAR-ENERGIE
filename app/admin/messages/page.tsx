"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Mail, CheckCircle, Clock, X, Eye } from "lucide-react";

interface Message {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function AdminMessagesPage() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            router.push("/dashboard");
        }
    }, [isLoading, user, router]);

    useEffect(() => {
        if (token) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 10000); // Poll every 10s
            return () => clearInterval(interval);
        }
    }, [token]);

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/contact", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.messages) setMessages(data.messages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string, currentStatus: boolean, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (currentStatus) return; // Already read

        try {
            const res = await fetch("/api/contact", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id, read: true })
            });

            if (res.ok) {
                setMessages(messages.map(msg => msg._id === id ? { ...msg, read: true } : msg));
                if (selectedMessage?._id === id) {
                    setSelectedMessage((prev: Message | null) => prev ? { ...prev, read: true } : null);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!confirm("Voulez-vous vraiment supprimer ce message ?")) return;

        try {
            const res = await fetch(`/api/contact?id=${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.ok) {
                setMessages(messages.filter(msg => msg._id !== id));
                if (selectedMessage?._id === id) setSelectedMessage(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const openMessage = (msg: Message) => {
        setSelectedMessage(msg);
        if (!msg.read) {
            handleMarkAsRead(msg._id, false);
        }
    };

    if (isLoading || loading) {
        return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-solar-orange" /></div>;
    }

    const filteredMessages = messages.filter(msg => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            (msg.name?.toLowerCase().includes(term) || "") ||
            (msg.email?.toLowerCase().includes(term) || "") ||
            (msg.message?.toLowerCase().includes(term) || "") ||
            (msg.subject?.toLowerCase().includes(term) || "") ||
            (msg.phone?.includes(term) || "");

        if (!matchesSearch) return false;

        const msgDate = new Date(msg.createdAt);
        if (startDate && msgDate < new Date(startDate)) return false;
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (msgDate > end) return false;
        }

        return true;
    });

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-deep-blue mb-2">Messages reçus</h1>
            <p className="text-gray-500 mb-8">Gérez les demandes de contact.</p>

            {/* Filters */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Recherche</label>
                    <input
                        type="text"
                        placeholder="Nom, Email, Sujet..."
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
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4">De</th>
                                <th className="px-6 py-4">Sujet</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredMessages.map((msg) => (
                                <tr
                                    key={msg._id}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                    onClick={() => openMessage(msg)}
                                >
                                    <td className="px-6 py-4">
                                        {msg.read ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <CheckCircle className="w-3 h-3" /> Lu
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-solar-yellow/20 text-yellow-700 animate-pulse">
                                                <Clock className="w-3 h-3" /> Nouveau
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{msg.name}</div>
                                        <div className="text-sm text-gray-500">{msg.email}</div>
                                        {msg.phone && <div className="text-sm text-solar-orange font-medium">{msg.phone}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900 font-medium">{msg.subject}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{msg.message}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openMessage(msg); }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Voir"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(msg._id, e)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {messages.length === 0 && (
                    <div className="text-center py-20 bg-gray-50">
                        <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">Aucun message</h3>
                        <p className="text-gray-500">Votre boîte de réception est vide pour le moment.</p>
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-deep-blue mb-1">{selectedMessage.subject}</h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    {new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Nom</label>
                                    <div className="font-medium text-gray-900">{selectedMessage.name}</div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                    <div className="font-medium text-gray-900">{selectedMessage.email}</div>
                                </div>
                                {selectedMessage.phone && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Téléphone</label>
                                        <div className="font-medium text-deep-blue">{selectedMessage.phone}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Message</label>
                            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                {selectedMessage.message}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => handleDelete(selectedMessage._id)}
                                className="px-4 py-2 text-red-600 font-bold hover:bg-red-50 rounded-xl flex items-center gap-2 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" /> Supprimer
                            </button>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="px-6 py-2 bg-deep-blue text-white font-bold rounded-xl hover:bg-solar-orange transition-colors"
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
