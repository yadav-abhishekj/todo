import { Schema, model } from "mongoose";

const todoSchema = new Schema(
  {
    title: { index: true, type: String, required: true },
    description: { type: String, required: true },
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
