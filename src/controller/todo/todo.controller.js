import TodoModel from "../../models/todo/todo.model.js";
import { logger } from "../../shared/helper/logger.js";
import { TodoValidation } from "../../shared/helper/validation.js";
import { ZodError } from "zod";
import { apiResponseFormat } from "../../shared/helper/response.js";

const listing = async (req, res) => {
  try {
    const params = TodoValidation.queryParams.parse(req.params);
    //  for fetching the detail
    if (params.id) {
      const data = await TodoModel.findOne({ _id: params.id });
      return apiResponseFormat.sendSuccess({
        res,
        data,
        message: data ? "Detail found" : "No Detail found",
      });
    }

    // for fetching all the listing of the todo listing and with filters if applied
    const query = TodoValidation.queryParams.parse(req.query);
    const filter = {};
    if (query.search) {
      filter.title = { $regex: query.search, $options: "i" };
    }
    if (query.page && query.limit) {
      query.skip = (+query.page - 1) * +query.limit;
    }
    const query_builder = TodoModel.find(filter);
    const totalCount = await TodoModel.countDocuments(filter);
    if (query.sortBy) {
      query_builder.sort({
        [query.sortBy]: query.sortOrder === "asc" ? -1 : 1,
      });
    }
    query_builder.skip(+query.skip || 0).limit(+query.limit);
    const data = await query_builder;

    return apiResponseFormat.sendPaginated({
      res,
      data,
      total: totalCount,
      limit: +query.limit || totalCount,
      skip: +query.skip || 0,
      message: data.length > 0 ? "Todo found" : "No Todo found",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiResponseFormat.sendBadRequest({
        res,
        error,
        message: "Validation failed",
      });
    }
    return apiResponseFormat.sendServerError({
      res,
      error,
      message: "Something went wrong in listing process",
    });
  }
};

const addTodo = async (req, res) => {
  try {
    const input = TodoValidation.add.parse(req.body);
    // insert into database
    const todo = new TodoModel(input);
    // saving record
    await todo.save();

    return apiResponseFormat.sendSuccess({
      res,
      data: todo,
      message: "Record added successfully",
    });
  } catch (error) {
    logger.error(error);
    if (error instanceof ZodError) {
      return apiResponseFormat.sendBadRequest({
        res,
        error,
        message: "Validation failed",
      });
    }
    return apiResponseFormat.sendServerError({
      res,
      error,
      message: "Something went wrong in adding process",
    });
  }
};

const updateTodo = async (req, res) => {
  try {
    const params = TodoValidation.queryParams.parse(req.params);
    if (!params.id) {
      return apiResponseFormat.sendBadRequest({
        res,
        message: "key is required to update the data",
      });
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

    return apiResponseFormat.sendSuccess({
      res,
      updated,
      message: "Record updated successfully",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiResponseFormat.sendBadRequest({
        res,
        error,
        message: "Validation failed",
      });
    }
    return apiResponseFormat.sendServerError({
      res,
      error,
      message: "Something went wrong in updating process",
    });
  }
};

const deleteTodo = async (req, res) => {
  try {
    if (!req.params || !req.params.id) {
      return apiResponseFormat.sendBadRequest({
        res,
        message: "key is required to delete the data",
      });
    }
    const isExisting = await TodoModel.findOne({ _id: req.params.id });
    if (!isExisting) {
      return apiResponseFormat.sendNotFound({
        res,
        message: "Record not found",
      });
    }
    await isExisting.softDelete();
    return apiResponseFormat.sendSuccess({
      res,
      data: isExisting,
      message: "Record deleted successfully",
    });
  } catch (error) {
    return apiResponseFormat.sendServerError({
      res,
      error,
      message: "Something went wrong in deleting process",
    });
  }
};

const Todo = {
  listing,
  addTodo,
  updateTodo,
  deleteTodo,
};

export default Todo;
