import express from 'express';
import { 
    reportLostItem, 
    getMyLostItems, 
    updateLostItem, 
    getFoundItems,
    registerFoundItem,
    updateFoundItemStatus,
    getAllLostItems
} from '../controllers/itemController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public/Student routes
router.route('/lost')
    .post(protect, reportLostItem);
router.route('/lost/my')
    .get(protect, getMyLostItems);
router.route('/lost/:id')
    .put(protect, updateLostItem);
router.route('/found')
    .get(protect, getFoundItems);

// Admin routes
router.route('/admin/found')
    .post(protect, admin, registerFoundItem);
router.route('/admin/found/:id/status')
    .put(protect, admin, updateFoundItemStatus);
router.route('/admin/lost/all')
    .get(protect, admin, getAllLostItems);

export default router;
