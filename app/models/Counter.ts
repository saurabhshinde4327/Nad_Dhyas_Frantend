// Mongoose removed - using backend API instead
// import mongoose, { Schema, Document } from 'mongoose';

export interface ICounter {
    _id: string; // Branch Name
    seq: number;
}

// Mongoose schema removed - using backend API instead
// const CounterSchema: Schema = new Schema({
//     _id: { type: String, required: true },
//     seq: { type: Number, default: 0 }
// });

// export default mongoose.models.Counter || mongoose.model<ICounter>('Counter', CounterSchema);

// Placeholder export - using backend API instead
export default null;
