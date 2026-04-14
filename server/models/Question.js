import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
});

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    companies: {
      type: [String],
      default: [],
    },

    constraints: String,

    examples: {
      type: [
        {
          input: String,
          output: String,
          explanation: String,
        },
      ],
      default: [],
    },

    testCases: {
      type: [testCaseSchema],
      required: true,
      validate: [(arr) => arr.length > 0, "At least one test case required"],
    },

    timeLimit: {
      type: Number,
      default: 1000,
    },

    memoryLimit: {
      type: Number,
      default: 256,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);