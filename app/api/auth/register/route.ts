import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
        const { name, email, phone, password } = await req.json();

        if (!name || !email || !phone || !password) {
            return NextResponse.json(
                { message: 'Please provide all fields' },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json(
                { message: 'Cet email existe déjà. Essayez-en un autre ou réinitialisez votre mot de passe.' },
                { status: 409 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        if (user) {
            // Generate Token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: '30d' }
            );

            // Create a response with the token (could also set cookie here)
            const response = NextResponse.json(
                {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token,
                },
                { status: 201 }
            );

            return response;
        } else {
            return NextResponse.json(
                { message: 'Invalid user data' },
                { status: 400 }
            );
        }
    } catch (error: any) {
        console.error('Register Error:', error);
        return NextResponse.json(
            { message: 'Server Error' },
            { status: 500 }
        );
    }
}
