import express from 'express';
const router = express.Router();

import { protect } from '../../../middleware/authMiddleware.js';
import { authorize } from '../../../middleware/Authorization.middleware.js';

import {
  createPromoCode,
  getAllPromos,
  getPromoById,
  updatePromo,
  deletePromo,
} from '../../../controllers/promocode/promocode.controller.js';

/**
 * PROMO ROUTES
 */

// GET ALL PROMOS
router.get('/list', protect, authorize('admin'), getAllPromos);

// CREATE PROMO
router.post('/add', protect, authorize('admin'), createPromoCode);

// GET SINGLE PROMO
router.get('/:id', protect, authorize('admin'), getPromoById);

// UPDATE PROMO
router.patch('/update/:id', protect, authorize('admin'), updatePromo);

// DELETE PROMO
router.delete('/delete/:id', protect, authorize('admin'), deletePromo);

export default router;
