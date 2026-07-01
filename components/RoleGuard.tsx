"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                // Not logged in, redirect to login
                // Encode return url? For now just simple login.
                // Avoid infinite loop if already on login (though RoleGuard shouldn't be on login)
                router.push("/login");
            } else if (!allowedRoles.includes(user.role)) {
                // Logged in but wrong role
                if (user.role === 'admin') {
                    router.push('/admin/overview');
                } else {
                    router.push('/dashboard');
                }
            } else {
                // Authorized
                setIsAuthorized(true);
            }
        }
    }, [user, authLoading, router, allowedRoles, pathname]);

    // Show loading while checking auth or if auth context is loading
    if (authLoading || !isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-solar-orange" />
                    <p className="text-gray-500 font-medium">Vérification des accès...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
