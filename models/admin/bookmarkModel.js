import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ['mcq', 'chapter', 'topic', 'sub-subject', 'video', 'q-test'],
      required: true,
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    category: {
      type: String,
      enum: ['important', 'veryimportant', 'mostimportant'],
      required: true,
    },
    // chapterId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Chapter',
    //   default: null,
    // },
  },
  { timestamps: true }
);

// 🔥 CLEAN UNIQUE INDEX
bookmarkSchema.index({ userId: 1, type: 1, itemId: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);
