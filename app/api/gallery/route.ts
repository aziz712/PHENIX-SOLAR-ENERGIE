import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Gallery from '@/models/Gallery';
import jwt from 'jsonwebtoken';

// GET: Fetch all projects
export async function GET(req: Request) {
    try {
        await connectDB();
        const projects = await Gallery.find().sort({ createdAt: -1 });
        return NextResponse.json({ projects }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

// POST: Create new project (Admin only)
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();

        // Basic validation/limit check could go here if needed

        await connectDB();

        const newProject = await Gallery.create(body);

        return NextResponse.json({ project: newProject }, { status: 201 });
    } catch (error: any) {
        console.error("Gallery POST Error:", error);
        return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
}

// PUT: Update project
export async function PUT(req: Request) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Accès refusé' }, { status: 403 });
        }

        const body = await req.json();
        const { _id, ...updateData } = body;

        await connectDB();
        const updatedProject = await Gallery.findByIdAndUpdate(_id, updateData, { new: true });

        return NextResponse.json({ project: updatedProject }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
}

// DELETE: Remove project (Admin only)
export async function DELETE(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        if (decoded.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Project ID required' }, { status: 400 });
        }

        await connectDB();
        await Gallery.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
}
