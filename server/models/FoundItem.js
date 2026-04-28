import mongoose from 'mongoose';

const foundItemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    location: { type: String, required: true },
    foundAt: { type: Date, required: true },
    description: { type: String, required: true },
    founderId: { type: String }, // Could be a name or ID if a student gave it to admin
    submittedAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['stored', 'claimed', 'returned'],
        default: 'stored'
    },
    returnedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const FoundItem = mongoose.model('FoundItem', foundItemSchema);
export default FoundItem;
