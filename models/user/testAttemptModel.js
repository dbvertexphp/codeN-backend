

import mongoose from 'mongoose';

const testAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      default: null,
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      default: null, // 👈 NEW
    },
    mode: {
      type: String,
      enum: ['exam', 'regular'],
      default: 'exam', // 👈 NEW
    },
    // For sequential flows (legacy compatibility)
    currentIndex: {
      type: Number,
      default: 0,
    },

    answers: [
      {
        mcqId: mongoose.Schema.Types.ObjectId,
        selectedOption: Number, // index 0..3
        isCorrect: Boolean,
      },
    ],

    startedAt: Date,
    endsAt: Date,

    // When user/manual or auto-submitted
    submittedAt: Date,
    submittedBy: {
      type: String,
      enum: ['MANUAL', 'AUTO'],
      default: null,
    },

    score: Number,
  },
  { timestamps: true }
);

export default mongoose.model('TestAttempt', testAttemptSchema);
