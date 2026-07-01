import mongoose from 'mongoose';

const InstallationRequestSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Location Details
    governorate: {
        type: String,
        required: [true, 'Governorate is required'],
        enum: [
            'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa',
            'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Le Kef',
            'Mahdia', 'La Manouba', 'Médenine', 'Monastir', 'Nabeul',
            'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine',
            'Tozeur', 'Tunis', 'Zaghouan'
        ],
    },
    city: {
        type: String,
        required: [true, 'City/Delegation is required'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
    coordinates: {
        lat: Number,
        lng: Number,
    },

    // System Details
    systemType: {
        type: String,
        enum: ['Raccordé au réseau', 'Site isolé', 'Pompage'],
        required: true,
    },
    category: {
        type: String,
        enum: ['Résidentiel', 'Industriel', 'Commercial', 'Agricole'],
        required: true,
    },
    powerKW: {
        type: Number,
    },

    // Status & Media
    status: {
        type: String,
        enum: ['Pending', 'Vérifié', 'Visite technique', 'Étude du projet', 'Travaux', 'Completed', 'Mise en service'],
        default: 'Pending',
    },
    images: {
        type: [String], // URLs to uploaded images
    },
    notes: {
        type: String, // Technician notes
    },
    clientComment: {
        type: String, // "comment place to write anything"
    },

    completedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.InstallationRequest || mongoose.model('InstallationRequest', InstallationRequestSchema);
