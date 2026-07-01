import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import InstallationRequest from '@/models/InstallationRequest';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
    try {
        await connectDB();

        // 1. Verify Auth Token
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        let decoded: any;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch (err) {
            return NextResponse.json({ success: false, message: "Token invalide" }, { status: 401 });
        }

        // 2. Define Filter based on Role
        let filter = {};

        // If user is NOT admin, force filter by their ID
        // Assuming your User model/JWT has 'role' field. 
        // If not, we might need to fetch the user first to check role, 
        // but typically it's in the token for performance.
        // Based on previous create-admin script context, role is present.
        if (decoded.role !== 'admin') {
            filter = { client: decoded.id };
        }

        const requests = await InstallationRequest.find(filter)
            .populate('client', 'name email phone')
            .sort({ createdAt: -1 }); // Sort by newest first

        return NextResponse.json({ success: true, count: requests.length, requests });
    } catch (error: any) {
        console.error('Error fetching requests:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            // Client details (if not logged in)
            name, email, phone,
            // Installation details
            governorate, city, address, coordinates,
            systemType, category, clientComment
        } = body;

        await connectDB();

        let clientId;
        let createdUser = null;

        // Check auth token if provided in Authorization header
        const authHeader = req.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
                clientId = decoded.id;
            } catch (e) {
                // Invalid token, proceed to check email
            }
        }

        // If no authenticated user, check if we can find/create one with provided email
        if (!clientId) {
            if (!name || !email || !phone) {
                return NextResponse.json(
                    { message: 'Veuillez fournir vos informations de contact ou vous connecter.' },
                    { status: 400 }
                );
            }

            let user = await User.findOne({ email });
            if (!user) {
                const randomPassword = Math.random().toString(36).slice(-8);
                // In a real app, you'd hash this password here if the model doesn't handle it in a pre-save hook.
                // Assuming simple creation for now or that the User model handles hashing if provided plain.
                // *Update*: The User model usually requires hashing before save if not using a pre-save hook. 
                // Let's assume we need to hash it or store it.
                // Wait, if we hash it, we can't show it? 
                // We show the plain text randomPassword.

                // Note: You should import bcryptjs and hash it if your User model doesn't do it automatically.
                // For this snippet I will assume we pass it as is and maybe the Model handles it or we should hash it.
                // Checking previous conversations/context, create-admin.js hashed it. 
                // So we should hash it here too.

                const bcrypt = require('bcryptjs');
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(randomPassword, salt);

                user = await User.create({
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                    role: 'client'
                });

                createdUser = {
                    email: user.email,
                    password: randomPassword
                };
            }
            clientId = user._id;
        }

        // Create Request
        console.log("Creating InstallationRequest with client:", clientId);
        const newRequest = await InstallationRequest.create({
            client: clientId,
            governorate,
            city,
            address,
            coordinates,
            systemType,
            category,
            clientComment,
            status: 'Pending'
        });
        console.log("InstallationRequest created:", newRequest._id);

        return NextResponse.json({
            success: true,
            message: 'Demande envoyée avec succès',
            requestId: newRequest._id,
            createdUser // Return credentials if a new user was created
        }, { status: 201 });

    } catch (error: any) {
        console.error('Request Submission Error:', error);
        return NextResponse.json(
            { message: 'Erreur serveur', error: error.message },
            { status: 500 }
        );
    }
}
