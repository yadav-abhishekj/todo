import { logger } from "./logger.js";
import { ZodError } from "zod";

function formatZodError(err) {
  if (!(err instanceof ZodError)) return err;
  // Map Zod errors into a compact structure
  return JSON.parse(err.message).map((e) => ({
    path: e.path,
    message: e.message,
    code: e.code,
    ...(e.validation ? { validation: e.validation } : {}),
  }));
}

export function sendSuccess(
  res,
  data = null,
  message = "Success",
  status = 200
) {
  return res.status(status).json({ status, message, data });
}

export function sendCreated(
  res,
  data = null,
  message = "Created",
  status = 201
) {
  return res.status(status).json({ status, message, data });
}

export function sendBadRequest(
  res,
  errors,
  message = "Bad Request",
  status = 400
) {
  const formatted =
    errors instanceof ZodError ? formatZodError(errors) : errors;
  // Log a warning with the structured errors for observability
  try {
    logger.error(message, { errors: formatted });
  } catch (e) {
    // swallow logging errors to avoid breaking response flow
  }
  return res.status(status).json({ status, message, errors: formatted });
}

export function sendNotFound(res, message = "Not Found", status = 404) {
  logger.info(message);
  return res.status(status).json({ status, message });
}

export function sendServerError(
  res,
  error,
  message = "Internal Server Error",
  status = 500
) {
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

export function sendServiceUnavailable(
  res,
  message = "Service Unavailable",
  status = 503
) {
  logger.info(message);
  return res.status(status).json({ status, message });
}

export { formatZodError };
