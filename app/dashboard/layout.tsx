"use client";

import RoleGuard from "@/components/RoleGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={['client']}>
            {children}
        </RoleGuard>
    );
}
