"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: "blue" | "orange" | "purple" | "green" | "yellow";
    subtitle?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-solar-orange border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    green: "bg-green-50 text-green-600 border-green-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
};

export default function KpiCard({ title, value, icon: Icon, color, subtitle, trend }: KpiCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-2xl ${colorMap[color].split(' ')[0]} ${colorMap[color].split(' ')[1]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</span>
            </div>
            <div className="flex items-end justify-between">
                <div>
                    <div className="text-4xl font-bold text-deep-blue mb-1">{value}</div>
                    {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-bold ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {trend.isPositive ? '↑' : '↓'} {trend.value}%
                    </div>
                )}
            </div>
        </motion.div>
    );
}
