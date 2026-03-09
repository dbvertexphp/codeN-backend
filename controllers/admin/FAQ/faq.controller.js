import Faq from '../../../models/admin/FAQ/faq.model.js';
import mongoose from 'mongoose';

/**
 * ADMIN - CREATE FAQ
 */
export const createFaq = async (req, res) => {
  try {
    const { question, answer, status } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'question and answer are required',
      });
    }

    const faq = await Faq.create({
      question,
      answer,
      status: status || 'active',
      createdBy: req.admin ? req.admin._id : null,
    });

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ADMIN - UPDATE FAQ
 */
export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid FAQ id',
      });
    }

    const faq = await Faq.findByIdAndUpdate(id, req.body, { new: true });

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ADMIN - DELETE FAQ
 */
export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid FAQ id',
      });
    }

    const faq = await Faq.findByIdAndDelete(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * USER - GET ALL FAQ
 */
export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({
      status: 'active',
    }).sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
