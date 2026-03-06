import PromoCode from '../../../models/admin/promo/promo.model.js';

// CREATE PROMO
export const createPromoCode = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      maxDiscount,
      minPurchase,
      expiryDate,
      usageLimit,
      applicableMonths,
    } = req.body;

    if (!code || !discountType || !discountValue || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing',
      });
    }

    const existing = await PromoCode.findOne({ code: code.toUpperCase() });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Promo code already exists',
      });
    }

    const promo = await PromoCode.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      maxDiscount: maxDiscount || 0,
      minPurchase: minPurchase || 0,
      expiryDate,
      usageLimit: usageLimit || 100,
      applicableMonths: applicableMonths || [],
    });

    res.status(201).json({
      success: true,
      message: 'Promo created successfully',
      data: promo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PROMOS
export const getAllPromos = async (req, res) => {
  try {
    const promos = await PromoCode.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: promos,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET PROMO BY ID
export const getPromoById = async (req, res) => {
  try {
    const promo = await PromoCode.findById(req.params.id);

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: "Promo code not found",
      });
    }

    res.status(200).json({
      success: true,
      data: promo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE PROMO
export const updatePromo = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      maxDiscount,
      minPurchase,
      expiryDate,
      usageLimit,
      applicableMonths,
      isActive,
    } = req.body;

    const promo = await PromoCode.findById(req.params.id);

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: "Promo code not found",
      });
    }

    promo.code = code ? code.toUpperCase() : promo.code;
    promo.discountType = discountType || promo.discountType;
    promo.discountValue = discountValue || promo.discountValue;
    promo.maxDiscount = maxDiscount ?? promo.maxDiscount;
    promo.minPurchase = minPurchase ?? promo.minPurchase;
    promo.expiryDate = expiryDate || promo.expiryDate;
    promo.usageLimit = usageLimit ?? promo.usageLimit;
    promo.applicableMonths = applicableMonths || promo.applicableMonths;
    promo.isActive = isActive ?? promo.isActive;

    const updatedPromo = await promo.save();

    res.status(200).json({
      success: true,
      message: "Promo updated successfully",
      data: updatedPromo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE PROMO
export const deletePromo = async (req, res) => {
  try {
    await PromoCode.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Promo deleted',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
