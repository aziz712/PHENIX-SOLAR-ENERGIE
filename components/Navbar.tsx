"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, Sun, User as UserIcon } from "lucide-react";
import clsx from "clsx";
import ProfileModal from "./ProfileModal";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const navigation = [
        { name: "Accueil", href: "/" },
        { name: "Services", href: "/services" },
        { name: "Réalisations", href: "/projects" },
        { name: "À propos", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex">
                        <Link href="/" className="shrink-0 flex items-center">
                            <img
                                src="/logo.png"
                                alt="PHOENIX SOLAR ENERGY Logo"
                                className="h-17  w-auto"
                            />
                        </Link>
                    </div>

                    <div className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-gray-700 hover:text-solar-orange px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden lg:ml-6 lg:flex lg:items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4 relative">
                                <Link
                                    href={user.role === "admin" ? "/admin/overview" : "/dashboard"}
                                    className="p-2 text-gray-500 hover:text-solar-orange transition-colors"
                                    title="Tableau de bord"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                                </Link>

                                <div className="relative group">
                                    <button className="flex items-center gap-2 text-deep-blue font-medium hover:text-solar-orange transition-colors">
                                        <div className="bg-orange-50 p-2 rounded-full text-solar-orange">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                        <span className="max-w-[100px] truncate">{user.name}</span>
                                    </button>

                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        <button
                                            onClick={() => setShowProfileModal(true)}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-solar-orange transition-colors"
                                        >
                                            Modifier le profil
                                        </button>

                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="text-deep-blue font-medium hover:text-solar-orange"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href="/request"
                                    className="bg-linear-to-r from-solar-yellow to-solar-orange text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                >
                                    Demander une installation
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="-mr-2 flex items-center lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-solar-yellow"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={clsx("lg:hidden", isOpen ? "block" : "hidden")}>
                <div className="pt-2 pb-3 space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-solar-yellow hover:text-solar-orange"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    {!user && (
                        <Link
                            href="/request"
                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-solar-orange hover:bg-gray-50 hover:border-solar-yellow"
                            onClick={() => setIsOpen(false)}
                        >
                            Demander une installation
                        </Link>
                    )}
                    {user && (
                        <Link
                            href={user.role === "admin" ? "/admin/overview" : "/dashboard"}
                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-solar-orange hover:bg-gray-50 hover:border-solar-yellow bg-orange-50/50"
                            onClick={() => setIsOpen(false)}
                        >
                            Tableau de Bord
                        </Link>
                    )}
                </div>
                <div className="pt-4 pb-4 border-t border-gray-200">
                    {user ? (
                        <div className="px-4 flex items-center gap-4">
                            <div className="shrink-0">
                                <UserIcon className="h-10 w-10 text-gray-400 bg-gray-100 p-2 rounded-full" />
                            </div>
                            <div>
                                <div className="text-base font-medium text-gray-800">
                                    {user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {user.email}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="ml-auto bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm"
                            >
                                Log out
                            </button>
                        </div>
                    ) : (
                        <div className="px-4">
                            <Link
                                href="/login"
                                className="block text-center w-full bg-gray-50 text-deep-blue px-4 py-2 rounded-md font-medium mb-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Connexion
                            </Link>
                        </div>
                    )}
                </div>
            </div>


            <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
        </nav >
    );
};

export default Navbar;
