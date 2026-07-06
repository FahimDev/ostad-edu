const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [120, "Title cannot exceed 120 characters"]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: ""
    },
    status: {
      type: String,
      enum: ["todo", "doing", "done"],
      default: "todo"
    },
    priority: {
      type: Number,
      min: [1, "Priority minimum is 1"],
      max: [5, "Priority maximum is 5"],
      default: 3
    },
    dueDate: {
      type: Date
    },
    tags: {
      type: [String],
      default: []
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

taskSchema.virtual("isOverdue").get(function isOverdue() {
  if (!this.dueDate || this.status === "done") return false;
  return this.dueDate < new Date();
});

taskSchema.set("toJSON", { virtuals: true });
taskSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Task", taskSchema);
