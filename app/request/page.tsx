"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { MapPin, Sun, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import MapWrapper from "@/components/map/MapWrapper";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const governorates = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa',
    'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Le Kef',
    'Mahdia', 'La Manouba', 'Médenine', 'Monastir', 'Nabeul',
    'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine',
    'Tozeur', 'Tunis', 'Zaghouan'
];

export default function RequestPage() {
    const { user, token } = useAuth();
    const router = useRouter();
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [viewCenter, setViewCenter] = useState<[number, number] | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const [newCredentials, setNewCredentials] = useState<{ email: string; password: string } | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onLocationSelect = (lat: number, lng: number) => {
        setCoordinates({ lat, lng });
    };

    const handleGeolocation = () => {
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur");
            return;
        }

        setIsLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setViewCenter([latitude, longitude]);
                setCoordinates({ lat: latitude, lng: longitude });
                setIsLoadingLocation(false);
            },
            (error) => {
                console.error("Erreur de géolocalisation:", error);
                alert("Impossible de récupérer votre position. Veuillez vérifier vos autorisations.");
                setIsLoadingLocation(false);
            }
        );
    };

    const onSubmit = async (data: any) => {
        if (!coordinates) {
            setSubmitError("Veuillez sélectionner votre emplacement sur la carte.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const payload = {
                ...data,
                coordinates,
                // If user is logged in, these might be ignored by backend if it uses token, 
                // but useful if we want to allow updating contact info? 
                // For now, let's just send what's in the form.
                ...(user ? { name: user.name, email: user.email, phone: user.role } : {}) // Actually form fields override or complement
            };

            const res = await fetch("/api/requests", {
                method: "POST",
                headers,
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Une erreur est survenue");
            }

            if (result.createdUser) {
                setNewCredentials(result.createdUser);
            }

            setSubmitSuccess(true);
            window.scrollTo(0, 0);
        } catch (err: any) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-10 text-center max-w-lg shadow-2xl"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-deep-blue mb-4">Demande Reçue !</h2>
                    <p className="text-gray-600 mb-8">
                        Merci de nous avoir fait confiance. Votre demande d'installation a été enregistrée avec succès.
                        Un de nos experts techniques vous contactera sous 24h.
                    </p>

                    {newCredentials && (
                        <div className="my-6 p-6 bg-blue-50 rounded-xl border border-blue-100 text-left">
                            <h4 className="text-lg font-bold text-deep-blue mb-3 flex items-center gap-2">
                                <span className="text-xl">🔐</span> Vos identifiants
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Un compte a été créé automatiquement pour vous permettre de suivre votre demande.
                            </p>
                            <div className="space-y-2 bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                    <span className="text-sm font-medium text-gray-500">Email :</span>
                                    <span className="text-sm font-bold text-gray-900 font-mono">{newCredentials.email}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-sm font-medium text-gray-500">Mot de passe :</span>
                                    <span className="text-sm font-bold text-solar-orange font-mono bg-orange-50 px-2 py-1 rounded">{newCredentials.password}</span>
                                </div>
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-3">
                                Veuillez conserver ces informations précieusement.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => router.push(token ? "/dashboard" : "/login")}
                        className="w-full py-3 bg-solar-yellow text-deep-blue font-bold rounded-xl hover:bg-solar-orange hover:text-white transition-colors"
                    >
                        {token ? "Suivre ma demande" : "Se connecter"}
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-background-light min-h-screen py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-deep-blue mb-4">
                        Étude & Installation Solaire
                    </h1>
                    <p className="text-lg text-gray-600">
                        Remplissez ce formulaire pour recevoir une étude personnalisée.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* MAP SECTION */}
                    <div className="lg:col-span-1 h-[400px] lg:h-auto rounded-3xl overflow-hidden shadow-lg border-4 border-white order-2 lg:order-1 relative">
                        <MapWrapper
                            interactive={true}
                            onLocationSelect={onLocationSelect}
                            initialCenter={[34.0, 9.5]} // Center of Tunisia
                            flyToLocation={viewCenter}
                            selectedPosition={coordinates ? [coordinates.lat, coordinates.lng] : null}
                            popupText="Localisé"
                        />

                        {/* Geolocation Button */}
                        <button
                            onClick={handleGeolocation}
                            disabled={isLoadingLocation}
                            className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-md hover:bg-white transition-all z-1000 text-deep-blue font-bold text-sm flex items-center gap-2 border border-gray-100"
                            title="Localiser"
                        >
                            {isLoadingLocation ? (
                                <Loader2 className="w-5 h-5 animate-spin text-solar-orange" />
                            ) : (
                                <MapPin className="w-5 h-5 text-solar-orange" />
                            )}
                            <span>Localiser</span>
                        </button>

                        {!coordinates && (
                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-xl text-center text-sm font-medium text-solar-orange shadow-lg z-1000">
                                📍 Cliquez sur la carte pour définir l'emplacement
                            </div>
                        )}
                        {coordinates && (
                            <div className="absolute bottom-4 left-4 right-4 bg-green-50/90 backdrop-blur p-3 rounded-xl text-center text-sm font-medium text-green-700 shadow-lg z-1000 flex items-center justify-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Emplacement validé
                            </div>
                        )}
                    </div>

                    {/* FORM SECTION */}
                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-lg order-1 lg:order-2">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {!user && (
                                <div className="space-y-4 border-b border-gray-100 pb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        1. Vos Coordonnées
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                            <input
                                                {...register("name", { required: "Nom requis" })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow outline-none"
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                {...register("email", { required: "Email requis" })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow outline-none"
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                            <input
                                                type="tel"
                                                {...register("phone", { required: "Téléphone requis" })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow outline-none"
                                            />
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    {user ? "1." : "2."} Détails du Projet
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gouvernorat</label>
                                        <select
                                            {...register("governorate", { required: "Gouvernorat requis" })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow outline-none bg-white"
                                        >
                                            <option value="">Sélectionner...</option>
                                            {governorates.map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                        {errors.governorate && <p className="text-red-500 text-xs mt-1">{errors.governorate.message as string}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Ville / Délégation</label>
                                        <input
                                            {...register("city", { required: "Ville requise" })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow outline-none"
                                        />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message as string}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse exacte</label>
                                        <input
                                            {...register("address", { required: "Adresse requise" })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow outline-none"
                                            placeholder="Rue, Numéro, Code Postal..."
                                        />
                                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message as string}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                        <select
                                            {...register("category", { required: true })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow outline-none bg-white"
                                        >
                                            <option value="Résidentiel">Résidentiel</option>
                                            <option value="Industriel">Industriel</option>
                                            <option value="Commercial">Commercial</option>
                                            <option value="Agricole">Agricole</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type de Système</label>
                                        <select
                                            {...register("systemType", { required: true })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow outline-none bg-white"
                                        >
                                            <option value="Raccordé au réseau">Raccordé au réseau</option>
                                            <option value="Site isolé">Site isolé (Batteries)</option>
                                            <option value="Pompage">Pompage Solaire</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Commentaires / Besoins spécifiques</label>
                                    <textarea
                                        {...register("clientComment")}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-solar-yellow outline-none"
                                        placeholder="Ex: Facture électricité moyenne 500DT/mois..."
                                    ></textarea>
                                </div>
                            </div>

                            {submitError && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>{submitError}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-deep-blue text-white font-bold rounded-xl hover:bg-solar-orange transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Envoyer ma demande"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
