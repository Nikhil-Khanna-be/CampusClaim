import express from 'express';
import { createClaim, getMyClaims, getAllClaims, updateClaimStatus } from '../controllers/claimController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createClaim)
    .get(protect, admin, getAllClaims);

router.route('/my')
    .get(protect, getMyClaims);

router.route('/:id')
    .put(protect, admin, updateClaimStatus);

export default router;
