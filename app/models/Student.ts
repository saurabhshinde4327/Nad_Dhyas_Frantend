import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
    fullName: string;
    address: string;
    dob: Date;
    bloodGroup?: string;
    education?: string;
    occupation?: string;
    email?: string;
    phone: string;
    whatsapp?: string;
    parentName?: string;
    parentPhone?: string;
    parentOccupation?: string;
    musicType: string;
    instruments?: string[];
    danceStyles?: string[];
    branch: string;
    formNo: string;
    admissionDate: Date;
    paymentMode: 'full' | 'installment';
    amountPaid: number;
    transactionId: string;
    invoiceNumber: string;
    createdAt: Date;
}

const StudentSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    bloodGroup: { type: String },
    education: { type: String },
    occupation: { type: String },
    email: { type: String },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    parentName: { type: String },
    parentPhone: { type: String },
    parentOccupation: { type: String },
    musicType: { type: String, required: true },
    instruments: [{ type: String }],
    danceStyles: [{ type: String }],
    branch: { type: String, required: true },
    formNo: { type: String, required: true, unique: true },
    admissionDate: { type: Date, required: true },
    paymentMode: { type: String, enum: ['full', 'installment'], required: true },
    amountPaid: { type: Number, required: true },
    transactionId: { type: String, required: true },
    invoiceNumber: { type: String, required: true, unique: true },
}, {
    timestamps: true
});

// Helper to generate Invoice Number (Simple timestamp based for now)
StudentSchema.pre('save', function (next) {
    if (!this.invoiceNumber) {
        this.invoiceNumber = 'INV-' + Date.now();
    }
    next();
});

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
