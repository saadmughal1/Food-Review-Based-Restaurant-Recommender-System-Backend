import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors || [],
      data: err.data || null,
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
    errors: [err.message || "An unexpected error occurred"],
  });
};

export default errorHandler;
