import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import InstallationRequest from '@/models/InstallationRequest';
import MaintenanceRequest from '@/models/MaintenanceRequest';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const range = searchParams.get('range') || 'total';
        const start = searchParams.get('start');
        const end = searchParams.get('end');

        let dateFilter: any = {};
        const now = new Date();

        if (range === 'day') {
            const yesterday = new Date(now);
            yesterday.setHours(now.getHours() - 24);
            dateFilter = { createdAt: { $gte: yesterday } };
        } else if (range === 'month') {
            const lastMonth = new Date(now);
            lastMonth.setMonth(now.getMonth() - 1);
            dateFilter = { createdAt: { $gte: lastMonth } };
        } else if (range === 'year') {
            const lastYear = new Date(now);
            lastYear.setFullYear(now.getFullYear() - 1);
            dateFilter = { createdAt: { $gte: lastYear } };
        } else if (range === 'custom' && start && end) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(start),
                    $lte: new Date(end)
                }
            };
        }

        // 1. Basic Counts (KPIs)
        const [
            totalInstallations,
            pendingInstallations,
            inProgressInstallations,
            completedInstallations,
            totalMaintenance,
            pendingMaintenance,
            totalClients
        ] = await Promise.all([
            InstallationRequest.countDocuments(dateFilter),
            InstallationRequest.countDocuments({ ...dateFilter, status: 'Pending' }),
            InstallationRequest.countDocuments({ ...dateFilter, status: { $in: ['Vérifié', 'Visite technique', 'Étude du projet', 'Travaux'] } }),
            InstallationRequest.countDocuments({ ...dateFilter, status: 'Completed' }),
            MaintenanceRequest.countDocuments(dateFilter),
            MaintenanceRequest.countDocuments({ ...dateFilter, status: 'Pending' }),
            User.countDocuments({ role: 'client', ...dateFilter })
        ]);

        // 2. Monthly Growth (Always show context but respect range for the main metrics)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const monthlyGrowth = await InstallationRequest.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 3. Status Distribution
        const statusDist = await InstallationRequest.aggregate([
            { $match: dateFilter },
            { $group: { _id: "$status", value: { $sum: 1 } } }
        ]);

        // 4. Governorate Demand
        const governorateDist = await InstallationRequest.aggregate([
            { $match: dateFilter },
            { $group: { _id: "$governorate", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // 5. Power Capacity by Category
        const powerStats = await InstallationRequest.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: "$category",
                    totalKW: { $sum: { $ifNull: ["$powerKW", 0] } },
                    avgKW: { $avg: { $ifNull: ["$powerKW", 0] } },
                    count: { $sum: 1 }
                }
            }
        ]);

        // 6. Average Completion Time
        const completionTime = await InstallationRequest.aggregate([
            { $match: { ...dateFilter, status: 'Completed', completedAt: { $exists: true } } },
            {
                $project: {
                    daysToComplete: {
                        $divide: [
                            { $subtract: ["$completedAt", "$createdAt"] },
                            1000 * 60 * 60 * 24
                        ]
                    }
                }
            },
            { $group: { _id: null, avgDays: { $avg: "$daysToComplete" } } }
        ]);

        return NextResponse.json({
            success: true,
            stats: {
                installations: {
                    total: totalInstallations,
                    pending: pendingInstallations,
                    inProgress: inProgressInstallations,
                    completed: completedInstallations
                },
                maintenance: {
                    total: totalMaintenance,
                    pending: pendingMaintenance
                },
                clients: totalClients,
                charts: {
                    monthlyGrowth,
                    statusDist,
                    governorateDist,
                    powerStats,
                    avgCompletionDays: completionTime[0]?.avgDays || 0
                }
            }
        });
    } catch (error: any) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
