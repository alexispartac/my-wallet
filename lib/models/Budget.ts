import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  userId: string;
  catId: string;
  limit: number;
}

const BudgetSchema = new Schema<IBudget>(
  {
    userId: { type: String, required: true, index: true },
    catId:  { type: String, required: true },
    limit:  { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Budget ?? mongoose.model<IBudget>('Budget', BudgetSchema);
