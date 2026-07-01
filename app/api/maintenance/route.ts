import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MaintenanceRequest from '@/models/MaintenanceRequest';
import User from '@/models/User'; // Ensure User model is loaded

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // Basic validation could go here

        const newRequest = await MaintenanceRequest.create(body);

        return NextResponse.json({ success: true, request: newRequest }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating maintenance request:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        // Populate client details
        const requests = await MaintenanceRequest.find()
            .populate('client', 'name email phone')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, count: requests.length, requests });
    } catch (error: any) {
        console.error('Error fetching maintenance requests:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
