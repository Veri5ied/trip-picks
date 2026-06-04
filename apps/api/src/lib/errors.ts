import { ZodError } from "zod";

type AppErrorInput = {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;
};

export class AppError extends Error {
  code: string;
  statusCode: number;
  details?: unknown;

  constructor(input: AppErrorInput) {
    super(input.message);
    this.name = "AppError";
    this.code = input.code;
    this.statusCode = input.statusCode;
    this.details = input.details;
  }
}

export function notFound(message: string) {
  return new AppError({
    code: "NOT_FOUND",
    message,
    statusCode: 404,
  });
}

export function badRequest(message: string, details?: unknown) {
  return new AppError({
    code: "BAD_REQUEST",
    message,
    statusCode: 400,
    details,
  });
}

export function formatErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request",
        details: error.issues,
      },
    };
  }

  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
  }

  return {
    statusCode: 500,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
  };
}
