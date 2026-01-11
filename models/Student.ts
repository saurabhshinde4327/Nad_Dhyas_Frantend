import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    gender: { type: String, required: true },
    bloodGroup: { type: String },

    branch: { type: String, required: true },
    formNo: { type: String, required: true, unique: true },
    musicType: { type: String },
    instruments: [{ type: String }],
    vocalStyle: { type: String },
    danceStyles: [{ type: String }],

    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    parentOccupation: { type: String },

    paymentMode: { type: String, enum: ['full', 'installment'], required: true },
    amountPaid: { type: Number, required: true },
    totalFee: { type: Number, required: true },
    transactionId: { type: String, required: true },
    paymentDate: { type: Date, default: Date.now },
    feesStatus: { type: String, enum: ['paid', 'pending', 'partial'], default: 'pending' },

    registrationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
