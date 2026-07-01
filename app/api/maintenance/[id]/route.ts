import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MaintenanceRequest from '@/models/MaintenanceRequest';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const { status } = body;

        const request = await MaintenanceRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!request) {
            return NextResponse.json({ success: false, message: 'Demande non trouvée' }, { status: 404 });
        }

        return NextResponse.json({ success: true, request });
    } catch (error: any) {
        console.error('Error updating maintenance request:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
