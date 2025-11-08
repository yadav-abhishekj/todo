import { Schema, model } from "mongoose";
import { TODO_STATUS } from "../../shared/common/enum.js";

const todoSchema = new Schema(
  {
    title: { index: true, type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    status: {
      type: String,
      enum: TODO_STATUS,
      default: TODO_STATUS.PENDING,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, autoIndex: true }
);

// Add a method to soft delete
todoSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

const TodoModel = model("todo", todoSchema);
export default TodoModel;
