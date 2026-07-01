"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import MapWrapper from "@/components/map/MapWrapper";

export default function ContactPage() {
    return (
        <div className="bg-background-light min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-deep-blue mb-6"
                    >
                        Contactez-Nous
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Notre équipe est à votre écoute pour répondre à toutes vos questions et vous accompagner.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info & Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="bg-white rounded-3xl p-8 shadow-lg">
                            <h2 className="text-2xl font-bold text-deep-blue mb-6">Informations</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-solar-yellow/20 p-3 rounded-full shrink-0">
                                        <MapPin className="w-6 h-6 text-solar-orange" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Adresse</h3>
                                        <p className="text-gray-600">Rue de l'Energie, Zone Industrielle, Tunis, Tunisie</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-solar-yellow/20 p-3 rounded-full shrink-0">
                                        <Phone className="w-6 h-6 text-solar-orange" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Téléphone</h3>
                                        <p className="text-gray-600">+216 XX XXX XXX</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-solar-yellow/20 p-3 rounded-full shrink-0">
                                        <Mail className="w-6 h-6 text-solar-orange" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Email</h3>
                                        <p className="text-gray-600">contact@phenixsolarenergie.tn</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ContactForm />
                    </motion.div>

                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="h-150 rounded-3xl overflow-hidden shadow-xl border-4 border-white"
                    >
                        <MapWrapper
                            interactive={false}
                            initialCenter={[36.8065, 10.1815]}
                            markers={[{ lat: 36.8065, lng: 10.1815, title: "PHÉNIX SOLAR ÉNERGIE Tunis" }]}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function ContactForm() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                setStatus("success");
                setForm({ name: "", email: "", phone: "", subject: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-deep-blue mb-6">Envoyez-nous un message</h2>

            {status === "success" && (
                <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Message envoyé avec succès !
                </div>
            )}

            {status === "error" && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    Erreur lors de l'envoi via email.
                </div>
            )}

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow focus:border-transparent outline-none transition-all"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow focus:border-transparent outline-none transition-all"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                    <input
                        required
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow focus:border-transparent outline-none transition-all"
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        required
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow focus:border-transparent outline-none transition-all"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow focus:border-transparent outline-none transition-all"
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-deep-blue text-white font-bold rounded-xl hover:bg-solar-orange transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Envoyer <Send className="w-4 h-4" /></>}
                </button>
            </div>
        </form>
    );
}
