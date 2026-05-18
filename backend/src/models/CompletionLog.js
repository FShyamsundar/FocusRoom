import mongoose from "mongoose";

const completionLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    taskName: {
      type: String,
      required: true,
      trim: true,
    },
    completedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    focusDuration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CompletionLog = mongoose.model("CompletionLog", completionLogSchema);

