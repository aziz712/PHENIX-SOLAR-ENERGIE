import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import InstallationRequest from '@/models/InstallationRequest';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        // Await params for Next.js 15+ (if applicable, ensuring compatibility)
        const { id } = await params;

        const request = await InstallationRequest.findById(id).populate('client', 'name email phone');

        if (!request) {
            return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, request });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const { status, powerKW } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (powerKW !== undefined) updateData.powerKW = powerKW;

        if (status === 'Completed') {
            updateData.completedAt = new Date();
        }

        const request = await InstallationRequest.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!request) {
            return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, request });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
