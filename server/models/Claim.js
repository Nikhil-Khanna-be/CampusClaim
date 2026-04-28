import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoundItem', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const Claim = mongoose.model('Claim', claimSchema);
export default Claim;
