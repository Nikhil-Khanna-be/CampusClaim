import Claim from '../models/Claim.js';
import FoundItem from '../models/FoundItem.js';

// @desc    Create a new claim
// @route   POST /api/claims
// @access  Private
export const createClaim = async (req, res) => {
    try {
        const { itemId, answers } = req.body;
        
        // Check if user already claimed this item
        const existingClaim = await Claim.findOne({ itemId, userId: req.user._id });
        if(existingClaim) {
            return res.status(400).json({ message: 'You have already submitted a claim for this item' });
        }

        const claim = await Claim.create({
            itemId,
            userId: req.user._id,
            answers
        });

        res.status(201).json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user claims
// @route   GET /api/claims/my
// @access  Private
export const getMyClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ userId: req.user._id }).populate('itemId', 'itemName location foundAt status').sort('-createdAt');
        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Admin Controls ---

// @desc    Get all claims
// @route   GET /api/claims
// @access  Private/Admin
export const getAllClaims = async (req, res) => {
    try {
        const claims = await Claim.find({})
            .populate('itemId', 'itemName location foundAt status')
            .populate('userId', 'username rollNo')
            .sort('-createdAt');
        res.json(claims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Update claim status
// @route   PUT /api/claims/:id
// @access  Private/Admin
export const updateClaimStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const claim = await Claim.findById(req.params.id);
        
        if(!claim) return res.status(404).json({ message: 'Claim not found' });
        
        claim.status = status;
        await claim.save();

        if (status === 'approved') {
            const item = await FoundItem.findById(claim.itemId);
            if(item) {
                item.status = 'claimed';
                item.returnedTo = claim.userId;
                await item.save();
            }
            
            // Reject other pending claims for this item
            await Claim.updateMany(
                { itemId: claim.itemId, _id: { $ne: claim._id }, status: 'pending' },
                { status: 'rejected' }
            );
        }

        res.json(claim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
