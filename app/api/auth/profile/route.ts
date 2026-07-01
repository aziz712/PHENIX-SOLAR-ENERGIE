import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper to get user ID from token
const getUserIdFromToken = (req: Request) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        return decoded.id;
    } catch (error) {
        return null;
    }
};

export async function PUT(req: Request) {
    try {
        await connectDB();
        const userId = getUserIdFromToken(req);

        if (!userId) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        const { name, email, password } = await req.json();

        // Find user
        const user = await User.findById(userId).select('+password');
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Update Name
        if (name) user.name = name;

        // Update Email (Check uniqueness)
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return NextResponse.json(
                    { message: 'Cet email est déjà utilisé par un autre compte.' },
                    { status: 409 }
                );
            }
            user.email = email;
        }

        // Update Password
        if (password) {
            if (password.length < 6) {
                return NextResponse.json(
                    { message: 'Le mot de passe doit contenir au moins 6 caractères.' },
                    { status: 400 }
                );
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        // Return updated user (without password)
        return NextResponse.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

    } catch (error) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}
