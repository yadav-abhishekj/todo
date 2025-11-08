import * as z from "zod";

const add = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(1, "Title is required"),
  description: z.string().optional(),
});

const update = add
  .partial() // make all fields optional for updates
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided for update",
  });

const queryParams = z.object({
  id: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Invalid MongoDB ObjectId")
    .optional(),
  search: z.string().optional(),
  page: z.string().min(1).optional(),
  limit: z.string().min(1).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum([1, -1]).optional(),
});

export const TodoValidation = {
  add,
  update,
  queryParams,
};
