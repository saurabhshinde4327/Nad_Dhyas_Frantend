import mongoose, { Schema, Document } from 'mongoose';

export interface IDonor extends Document {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    panCard: string;
    adhaarCard: string;
    amount: number;
    transactionId: string;
    invoiceNumber: string;
    donatedAt: Date;
    branch: string;
    paymentMode: string;
}

const DonorSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    panCard: { type: String, required: true }, // Tax ID
    adhaarCard: { type: String, required: true }, // National ID
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    branch: { type: String, default: 'General' },
    paymentMode: { type: String, default: 'One Time' },
    donatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Helper to generate Invoice Number
DonorSchema.pre('save', function (next) {
    if (!this.invoiceNumber) {
        this.invoiceNumber = 'DON-' + Date.now();
    }
    next();
});

export default mongoose.models.Donor || mongoose.model<IDonor>('Donor', DonorSchema);
