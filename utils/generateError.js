export default (message, statusCode, statusMessage) => {
  const error = new Error();
  error.message = message;
  error.statusCode = statusCode || 500;
  error.statusMessage = statusMessage || "error";
  return error;
};
