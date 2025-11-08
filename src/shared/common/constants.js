export const RESPONSE_MESSAGES = {
  SUCCESS: {
    RECORD_FOUND: (message) => `${message} found.`,
    RECORD_CREATED: (message) => `${message} created.`,
    RECORD_UPDATED: (message) => `${message} updated.`,
    RECORD_DELETED: (message) => `${message} deleted.`,
    RECORD_NOT_FOUND: (message) => `${message} not found.`,
    SENT: (message) => `${message} sent successfully.`,
    SUCCESSFULLY: (action) => `${action} successfully.`,
  },
  ERROR: {
    INTERNAL_ERROR: (message) => `Error found: ${message}.`,
    SOMETHING_WENT_WRONG: (message) => `Something went wrong: ${message}.`,
  },
  VALIDATION: {
    REQUIRED: (message) => `${message} is required.`,
    MISSING: (message) => `${message} is missing.`,
  },
};
export default RESPONSE_MESSAGES;
