import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import jwt from 'jsonwebtoken';

// GET: Fetch all messages (Admin only)
export async function GET(req: Request) {
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

        await connectDB();
        const messages = await Message.find().sort({ createdAt: -1 });

        return NextResponse.json({ messages }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

// POST: Create new message (Public)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ message: 'Tous les champs sont requis' }, { status: 400 });
        }

        await connectDB();
        const newMessage = await Message.create(body);

        return NextResponse.json({ message: newMessage }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Server Error', error: error.message }, { status: 500 });
    }
}

// PUT: Mark as read
export async function PUT(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET!);

        const body = await req.json();
        const { id, read } = body;

        await connectDB();
        const updatedMessage = await Message.findByIdAndUpdate(id, { read }, { new: true });

        return NextResponse.json({ message: updatedMessage }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

// DELETE: Delete message
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
            return NextResponse.json({ message: 'ID required' }, { status: 400 });
        }

        await connectDB();
        await Message.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Message deleted' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
