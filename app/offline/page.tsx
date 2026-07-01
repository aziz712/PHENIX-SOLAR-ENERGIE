export const metadata = {
  title: "Hors ligne - PHÉNIX SOLAR ÉNERGIE",
  description: "Page hors ligne - Vérifiez votre connexion internet",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-deep-blue flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-solar-yellow opacity-80"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8.111 16.251a.375.375 0 01-.469-.369V5.75m0 10.502c.3.193.845.401 1.521.401 1.06 0 2.023-.26 2.685-.779.503-.425.934-.971 1.18-1.612m0 0A5.987 5.987 0 0112.75 3c1.657 0 3.157.671 4.243 1.757.504.504.981 1.035 1.424 1.59m0 0H21M4.9 12.854c0 1.308.291 2.55.811 3.662m15.738-9.778h2.25A.75.75 0 0021 4.5v2.25m0 0v2.25m0-2.25h-2.25m0 0a3 3 0 00-3-3h-2.25m0 0V3m0 0h-2.25a3 3 0 00-3 3m0 0v10.5a3 3 0 003 3h2.25m0 0v3m0-3h2.25m0 0h2.25"
            />
          </svg>
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
