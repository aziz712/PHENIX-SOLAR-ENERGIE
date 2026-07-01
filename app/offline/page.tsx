"use client";

import { WifiOff } from "lucide-react";

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-deep-blue flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="mb-8">
                    <WifiOff className="w-24 h-24 mx-auto text-solar-yellow opacity-80" />
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">Vous êtes hors ligne</h1>

                <p className="text-gray-300 mb-8 text-lg">
                    Il semble que vous n'ayez pas de connexion internet. Veuillez vérifier votre connexion et réessayer.
                </p>

                <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-solar-yellow text-deep-blue font-semibold rounded-lg hover:bg-solar-orange transition-colors"
                >
                    Réessayer
                </button>

                <p className="text-gray-400 text-sm mt-8">
                    Si le problème persiste, veuillez contacter notre support.
                </p>
            </div>
        </div>
    );
}
