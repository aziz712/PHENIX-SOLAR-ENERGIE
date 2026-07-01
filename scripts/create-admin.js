const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

//config
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = 'admin@phenixsolarenergie.tn';
const ADMIN_PASS = 'admin123';

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: { type: String, select: false },
    role: { type: String, enum: ['client', 'admin'], default: 'client' },
    isVerified: Boolean,
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASS, salt);

        await User.create({
            name: 'Super Admin',
            email: ADMIN_EMAIL,
            phone: '00000000',
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });

        console.log(`Admin created successfully! Email: ${ADMIN_EMAIL}, Password: ${ADMIN_PASS}`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdmin();
