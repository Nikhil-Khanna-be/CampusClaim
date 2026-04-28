import LostItem from '../models/LostItem.js';
import FoundItem from '../models/FoundItem.js';

// @desc    Report a lost item
// @route   POST /api/items/lost
// @access  Private
export const reportLostItem = async (req, res) => {
    try {
        const { title, location, dateLost, description, category, images, mobileNo } = req.body;
        const lostItem = await LostItem.create({
            title, location, dateLost, description, category, images, mobileNo,
            userId: req.user._id,
        });
        res.status(201).json(lostItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user's lost items
// @route   GET /api/items/lost/my
// @access  Private
export const getMyLostItems = async (req, res) => {
    try {
        const items = await LostItem.find({ userId: req.user._id }).sort('-createdAt');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Edit a reported lost item
// @route   PUT /api/items/lost/:id
// @access  Private
export const updateLostItem = async (req, res) => {
    try {
        const item = await LostItem.findById(req.params.id);
        if(!item) return res.status(404).json({ message: 'Item not found' });
        
        if (item.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this item' });
        }
        if (item.status !== 'pending') {
             return res.status(400).json({ message: 'Cannot edit item after claim is initiated or closed' });
        }

        const updatedItem = await LostItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all active found items
// @route   GET /api/items/found
// @access  Private
export const getFoundItems = async (req, res) => {
    try {
        const items = await FoundItem.find({ status: 'stored' }).sort('-createdAt');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Admin Controls --- 

// @desc    Register a found item
// @route   POST /api/items/found
// @access  Private/Admin
export const registerFoundItem = async (req, res) => {
    try {
        const { itemName, location, foundAt, description, founderId } = req.body;
        const foundItem = await FoundItem.create({
            itemName, location, foundAt, description, founderId
        });
        res.status(201).json(foundItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update found item status
// @route   PUT /api/items/found/:id/status
// @access  Private/Admin
export const updateFoundItemStatus = async (req, res) => {
    try {
        const { status, returnedTo } = req.body;
        const item = await FoundItem.findById(req.params.id);
        if(!item) return res.status(404).json({ message: 'Item not found' });

        item.status = status || item.status;
        if(returnedTo) item.returnedTo = returnedTo;

        await item.save();
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get all lost items (for admin viewing)
// @route   GET /api/items/lost/all
// @access  Private/Admin
export const getAllLostItems = async (req, res) => {
    try {
        const items = await LostItem.find({}).populate('userId', 'username rollNo').sort('-createdAt');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
