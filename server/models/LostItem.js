import mongoose from 'mongoose';

const lostItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    dateLost: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    mobileNo: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'claimed', 'closed'],
        default: 'pending'
    }
}, { timestamps: true });

const LostItem = mongoose.model('LostItem', lostItemSchema);
export default LostItem;
