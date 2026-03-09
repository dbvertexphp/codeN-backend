import express from 'express';
import {
  createFaq,
  updateFaq,
  deleteFaq,
  getAllFaqs,
} from '../../../controllers/admin/FAQ/faq.controller.js';

import { protect } from '../../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * ADMIN ROUTES
 */

router.post('/faq', createFaq);

router.put('/faq/:id', updateFaq);

router.delete('/faq/:id', deleteFaq);

/**
 * USER ROUTE
 */

router.get('/faq', getAllFaqs);

export default router;
