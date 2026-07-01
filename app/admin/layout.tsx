"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Wrench, Menu, X, Image, MessageSquare } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

import RoleGuard from "@/components/RoleGuard";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const NAV_ITEMS = [
        { name: "Vue d'ensemble", href: "/admin/overview", icon: LayoutDashboard },
        { name: "Installations", href: "/admin/requests", icon: FileText },
        { name: "Réalisations", href: "/admin/realizations", icon: Image },
        { name: "Messages", href: "/admin/messages", icon: MessageSquare },
        { name: "Maintenance", href: "/admin/maintenance", icon: Wrench },
    ];

    return (
        <RoleGuard allowedRoles={['admin']}>
            <div className="flex min-h-[calc(100vh-64px)]"> {/* Adjust height based on navbar height */}
                {/* Mobile Sidebar Toggle */}
                <button
                    className="md:hidden fixed bottom-6 right-6 z-50 bg-solar-orange text-white p-3 rounded-full shadow-lg"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? <X /> : <Menu />}
                </button>

                {/* Sidebar */}
                <aside
                    className={clsx(
                        "fixed md:sticky top-16 left-0 h-[calc(100vh-64px)] w-64 bg-white border-r border-gray-100 p-6 transition-transform duration-300 z-40 md:translate-x-0",
                        isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
                    )}
                >
                    <div className="mb-8 hidden md:block">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Menu Admin</h2>
                    </div>

                    <nav className="space-y-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                                        isActive
                                            ? "bg-orange-50 text-solar-orange"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <item.icon className={clsx("w-5 h-5", isActive ? "text-solar-orange" : "text-gray-400")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
                    {children}
                </main>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-30 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </div>
        </RoleGuard>
    );
}
