import TodoModel from "../../models/todo/todo.model.js";
import { logger } from "../../shared/helper/logger.js";
import { TodoValidation } from "../../shared/helper/validation.js";
import { ZodError } from "zod";
import {
  sendSuccess,
  sendBadRequest,
  sendServerError,
  sendNotFound,
} from "../../shared/helper/response.js";

const listing = async (req, res) => {
  try {
    const params = TodoValidation.queryParams.parse(req.params);
    if (params.id) {
      const data = await TodoModel.findOne({ _id: params.id });
      return sendSuccess(res, data, data ? "Detail found" : "No Detail found");
    }
    const query = TodoValidation.queryParams.parse(req.query);
    const filter = {};
    if (query.search) {
      filter.title = { $regex: query.search, $options: "i" };
    }
    if (query.page && query.limit) {
      query.skip = (query.page - 1) * query.limit;
    }
    const data = await TodoModel.find(filter)
      .skip(query.skip || 0)
      .limit(query.limit);

    return sendSuccess(
      res,
      data,
      data.length > 0 ? "Todo found" : "No Todo found"
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return sendBadRequest(res, error, "Validation failed");
    }
    return sendServerError(
      res,
      error,
      "Something went wrong in listing process"
    );
  }
};

const addTodo = async (req, res) => {
  try {
    const input = TodoValidation.add.parse(req.body);
    // insert into database
    const todo = new TodoModel(input);
    // saving record
    await todo.save();

    return sendSuccess(res, todo, "Record added successfully");
  } catch (error) {
    logger.error(error);
    if (error instanceof ZodError) {
      return sendBadRequest(res, error, "Validation failed");
    }
    return sendServerError(
      res,
      error,
      "Something went wrong in adding process"
    );
  }
};

const updateTodo = async (req, res) => {
  try {
    const params = TodoValidation.queryParams.parse(req.params);
    if (!params.id) {
      return sendBadRequest(res, "key is required to update the data");
    }
    const input = TodoValidation.update.parse(req.body);
    // update into database
    const updated = await TodoModel.findOneAndUpdate(
      { _id: params.id },
      { $set: { ...input } },
      {
        new: true,
      }
    );

    return sendSuccess(res, updated, "Record updated successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return sendBadRequest(res, error, "Validation failed");
    }
    return sendServerError(
      res,
      error,
      "Something went wrong in updating process"
    );
  }
};

const deleteTodo = async (req, res) => {
  try {
    if (!req.params || !req.params.id) {
      return sendBadRequest(res, "key is required to delete the data");
    }
    const isExisting = await TodoModel.findOne({ _id: req.params.id });
    if (!isExisting) {
      return sendNotFound(res, "Record not found");
    }
    await isExisting.softDelete();
    return sendSuccess(res, isExisting, "Record deleted successfully");
  } catch (error) {
    return sendServerError(
      res,
      error,
      "Something went wrong in deleting process"
    );
  }
};
const Todo = {
  listing,
  addTodo,
  updateTodo,
  deleteTodo,
};

export default Todo;
