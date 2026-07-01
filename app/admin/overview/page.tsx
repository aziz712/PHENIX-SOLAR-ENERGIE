"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
    Loader2, FileText, Wrench, Users, CheckCircle, Clock,
    TrendingUp, BarChart3, PieChart as PieChartIcon, Map as MapIcon,
    Zap, Calendar
} from "lucide-react";
import KpiCard from "./components/KpiCard";
import { MonthlyGrowthChart, StatusDonutChart, PowerCapacityChart } from "./components/DashboardCharts";
import dynamic from "next/dynamic";
import DateRangePicker from "./components/DateRangePicker";

// Dynamic import for Map to avoid SSR issues with Leaflet
const GovernorateHeatmap = dynamic(() => import("./components/GovernorateHeatmap"), {
    ssr: false,
    loading: () => <div className="h-100 w-full bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">Chargement de la carte...</div>
});

export default function AdminOverviewPage() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState("total"); // "day", "month", "year", "total", "custom"
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [customRange, setCustomRange] = useState({ start: "", end: "" });

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            router.push("/dashboard");
        }
    }, [isLoading, user, router]);

    useEffect(() => {
        if (user && user.role === 'admin' && token) {
            setLoading(true);
            let url = `/api/stats?range=${range}`;
            if (range === 'custom' && customRange.start && customRange.end) {
                url += `&start=${customRange.start}&end=${customRange.end}`;
            }

            fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) setStats(data.stats);
                })
                .finally(() => setLoading(false));
        }
    }, [user, token, range, customRange]);

    const handleCustomRangeSelect = (start: string, end: string) => {
        setCustomRange({ start, end });
        setRange("custom");
    };

    const formatDateRangeDisplay = () => {
        if (range === 'custom' && customRange.start && customRange.end) {
            return `${new Date(customRange.start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${new Date(customRange.end).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        }
        return new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    };

    if (isLoading || loading) {
        return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-solar-orange" /></div>;
    }

    return (
        <div className="max-w-7xl mx-auto pb-12 relative">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-deep-blue mb-2">Tableau de Bord Analytique</h1>
                    <p className="text-gray-500">Aperçu stratégique de PHÉNIX SOLAR ÉNERGIE</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Time Range Filter */}
                    <div className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-1">
                        {[
                            { id: "day", label: "Aujourd'hui" },
                            { id: "month", label: "Mois" },
                            { id: "year", label: "Année" },
                            { id: "total", label: "Total" }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setRange(item.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${range === item.id
                                    ? "bg-solar-orange text-white shadow-md shadow-orange-200"
                                    : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsDatePickerOpen(true)}
                        className="bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 text-sm text-gray-600 hover:border-solar-orange transition-colors"
                    >
                        <Calendar className="w-4 h-4 text-solar-orange" />
                        <span>{formatDateRangeDisplay()}</span>
                    </button>

                    <DateRangePicker
                        isOpen={isDatePickerOpen}
                        onClose={() => setIsDatePickerOpen(false)}
                        onSelect={handleCustomRangeSelect}
                        initialStart={customRange.start}
                        initialEnd={customRange.end}
                    />
                </div>
            </header>

            {(loading && !stats) ? (
                <div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-solar-orange" /></div>
            ) : stats && (
                <div className={`space-y-8 transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}>
                    {loading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/10 backdrop-blur-[1px] pointer-events-none">
                            <Loader2 className="w-8 h-8 animate-spin text-solar-orange" />
                        </div>
                    )}
                    {/* KPI Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KpiCard
                            title="Installations"
                            value={stats.installations.total}
                            icon={FileText}
                            color="blue"
                            subtitle="Total des demandes"
                        />
                        <KpiCard
                            title="Maintenance"
                            value={stats.maintenance.total}
                            icon={Wrench}
                            color="orange"
                            subtitle={`${stats.maintenance.pending} en attente`}
                        />
                        <KpiCard
                            title="Clients"
                            value={stats.clients}
                            icon={Users}
                            color="purple"
                            subtitle="Inscrits sur la plateforme"
                        />
                        <KpiCard
                            title="Puissance Totale"
                            value={`${stats.charts.powerStats.reduce((acc: number, p: any) => acc + p.totalKW, 0).toFixed(1)} kW`}
                            icon={Zap}
                            color="green"
                            subtitle="Capacité installée"
                        />
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Monthly Growth */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingUp className="w-5 h-5 text-solar-orange" />
                                <h2 className="text-xl font-bold text-deep-blue">Croissance des Demandes</h2>
                            </div>
                            <MonthlyGrowthChart data={stats.charts.monthlyGrowth} />
                        </div>

                        {/* Status Donut */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <PieChartIcon className="w-5 h-5 text-solar-orange" />
                                <h2 className="text-xl font-bold text-deep-blue">Distribution des Statuts</h2>
                            </div>
                            <StatusDonutChart data={stats.charts.statusDist} />
                        </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Map Demand */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <MapIcon className="w-5 h-5 text-solar-orange" />
                                <h2 className="text-xl font-bold text-deep-blue">Demande par Gouvernorat</h2>
                            </div>
                            <GovernorateHeatmap data={stats.charts.governorateDist} />
                        </div>

                        {/* Power Bar */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <BarChart3 className="w-5 h-5 text-solar-orange" />
                                <h2 className="text-xl font-bold text-deep-blue">Puissance par Catégorie (kW)</h2>
                            </div>
                            <PowerCapacityChart data={stats.charts.powerStats} />
                        </div>
                    </div>

                    {/* Performance Benchmarking */}
                    <div className="bg-deep-blue text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Performance Opérationnelle</h2>
                            <p className="text-gray-300">Délai moyen d'achèvement d'une installation solaire.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 px-8 py-4 rounded-2xl backdrop-blur-md border border-white/20">
                            <Clock className="w-8 h-8 text-solar-orange" />
                            <div>
                                <div className="text-3xl font-bold">{stats.charts.avgCompletionDays.toFixed(1)} Jours</div>
                                <div className="text-sm text-gray-300">Moyenne Installation</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

