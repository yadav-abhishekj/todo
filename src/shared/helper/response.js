import { logger } from "./logger.js";
import { ZodError } from "zod";

function formatZodErrorMessage(err) {
  if (!(err instanceof ZodError)) return err;
  // Map Zod errors into a compact structure
  return JSON.parse(err.message).map((e) => ({
    path: e.path,
    message: e.message,
    code: e.code,
    ...(e.validation ? { validation: e.validation } : {}),
  }));
}

function sendSuccess({ res, data = {}, message = "Success", status = 200 }) {
  return res.status(status).json({ status, message, data });
}

function sendPaginated({
  res,
  data = [],
  total = 0,
  limit = 0,
  skip = 0,
  message = "Success",
  status = 200,
}) {
  const pagination = { total, limit, skip };
  return res.status(status).json({ status, message, ...pagination, data });
}

function sendCreated({ res, data = null, message = "Created", status = 201 }) {
  return res.status(status).json({ status, message, data });
}

function sendBadRequest({ res, error, message = "Bad Request", status = 400 }) {
  const formatted =
    error instanceof ZodError ? formatZodErrorMessage(error) : error;
  // Log a warning with the structured errors for observability
  try {
    logger.error(message, { errors: formatted });
  } catch (e) {
    // swallow logging errors to avoid breaking response flow
  }
  return res.status(status).json({ status, message, errors: formatted });
}

function sendNotFound({ res, message = "Not Found", status = 404 }) {
  logger.info(message);
  return res.status(status).json({ status, message });
}

function sendServerError({
  res,
  error,
  message = "Internal Server Error",
  status = 500,
}) {
  // Accept either Error or plain value
  const payload =
    error instanceof Error
      ? { message: error.message, stack: error.stack }
      : error;
  try {
    logger.error(message, { error: payload });
  } catch (e) {
    // swallow logging errors
  }
  return res.status(status).json({
    status,
    message,
    error:
      payload instanceof Object && payload.message ? payload.message : payload,
  });
}

function sendServiceUnavailable({
  res,
  message = "Service Unavailable",
  status = 503,
}) {
  logger.info(message);
  return res.status(status).json({ status, message });
}

export const apiResponseFormat = {
  formatZodErrorMessage,
  sendSuccess,
  sendPaginated,
  sendCreated,
  sendBadRequest,
  sendNotFound,
  sendServerError,
  sendServiceUnavailable,
};
