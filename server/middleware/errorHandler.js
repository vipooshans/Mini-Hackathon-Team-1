/**
 * Generic Express error-handling middleware.
 * Must be mounted LAST in server.js (after all routes).
 *
 * Logs the error server-side (stack in development) and returns a
 * JSON response with { message } to the client.
 */
export const errorHandler = (err, _req, res, _next) => {
  // Log the error for server-side debugging
  console.error("Error:", err.message);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
  });
};

