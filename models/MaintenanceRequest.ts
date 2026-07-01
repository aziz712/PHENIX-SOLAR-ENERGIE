import mongoose from 'mongoose';

const MaintenanceRequestSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // System Connection (Optional: could link to specific InstallationRequest, but keeping flat for now as requested)
    systemType: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },

    // Location
    governorate: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },

    // Request Details
    type: {
        type: String,
        enum: ['Curative', 'Preventive'],
        default: 'Curative',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    urgency: {
        type: String,
        enum: ['Faible', 'Moyenne', 'Haute', 'Critique'],
        default: 'Moyenne',
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.MaintenanceRequest || mongoose.model('MaintenanceRequest', MaintenanceRequestSchema);
