import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Résidentiel', 'Industriel', 'Pompage'],
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    additionalImages: {
        type: [String],
    },
    powerKW: {
        type: Number,
        required: true,
    },
    location: {
        type: String, // e.g., "Sousse, Tunisie"
        required: true,
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
