import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  type: 'income' | 'expense';
  catId: string;
  merchant: string;
  amount: number;
  date: Date;
  note: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId:   { type: String, required: true, index: true },
    type:     { type: String, enum: ['income', 'expense'], required: true },
    catId:    { type: String, required: true },
    merchant: { type: String, required: true },
    amount:   { type: Number, required: true },
    date:     { type: Date,   required: true, default: Date.now },
    note:     { type: String, default: '' },
  },
  { timestamps: true }
);

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ??
  mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
