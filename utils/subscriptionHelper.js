import UserModel from '../models/user/userModel.js';
import Subscription from '../models/Subscription.js';

export const enforceSubscription = async (userId, res) => {
  const now = new Date();

  const activeSub = await Subscription.findOne({
    user: userId,
    status: 'active',
    endDate: { $gte: now },
  });

  if (activeSub) {
    return true;
  }

  res.status(403).json({
    success: false,
    message: 'Your 10-day free trial has expired. Please subscribe.',
  });

  return false;
};
