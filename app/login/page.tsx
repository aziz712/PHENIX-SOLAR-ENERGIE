"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sun, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isResetting, setIsResetting] = useState(false);
    const [resetMessage, setResetMessage] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResetMessage("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Erreur lors de la réinitialisation");
            }

            setResetMessage("Un nouveau mot de passe a été envoyé à votre adresse email.");
            setTimeout(() => {
                setIsResetting(false);
                setResetMessage("");
            }, 5000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Erreur de connexion");
            }

            login(data, data.token); // data includes _id, name, email, role
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 w-full max-w-md">
                <div className="text-center mb-6">
                    <Link href="/" className="inline-flex items-center">
                        <img
                            src="/logo.png"
                            alt="PHÉNIX SOLAR ÉNERGIE Logo"
                            className="h-35 w-auto"
                        />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{isResetting ? "Réinitialisation" : "Bienvenue"}</h1>
                    <p className="text-gray-500">{isResetting ? "Entrez votre email pour recevoir un nouveau mot de passe" : "Connectez-vous à votre espace client"}</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 mb-6 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {resetMessage && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-xl flex items-center gap-2 mb-6 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{resetMessage}</span>
                    </div>
                )}

                {isResetting ? (
                    <form onSubmit={handleReset} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow outline-none transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-deep-blue text-white font-bold rounded-xl hover:bg-solar-orange transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsResetting(false)}
                            className="w-full text-sm text-gray-600 font-medium hover:text-deep-blue"
                        >
                            Retour à la connexion
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow outline-none transition-all"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                                <button
                                    type="button"
                                    onClick={() => setIsResetting(true)}
                                    className="text-xs font-bold text-solar-orange hover:underline"
                                >
                                    Mot de passe oublié ?
                                </button>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow outline-none transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-deep-blue text-white font-bold rounded-xl hover:bg-solar-orange transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Se connecter"}
                        </button>
                    </form>
                )}

                {!isResetting && (
                    <div className="mt-8 text-center text-sm text-gray-600">
                        Pas encore de compte ?{" "}
                        <Link href="/register" className="text-solar-orange font-bold hover:underline">
                            S'inscrire
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
