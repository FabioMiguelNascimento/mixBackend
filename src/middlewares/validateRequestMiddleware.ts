import { NextFunction, Request, Response } from "express";
import z, { ZodTypeAny } from "zod";

export const validateRequest = (
  schema: ZodTypeAny,
  source: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let dataToValidate;

      switch (source) {
        case "params":
          if (req.params.key && Array.isArray(req.params.key)) {
            req.params.key = req.params.key.join('/');
          }
          dataToValidate = req.params;
          break;
        case "query":
          dataToValidate = req.query;
          break;
        case "body":
        default:
          dataToValidate = req.body;
          break;
      }

      const validatedDataForSource = schema.parse(dataToValidate);

      if (!req.validatedData) {
        req.validatedData = {};
      }
      
      Object.assign(req.validatedData, validatedDataForSource);

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          code: 400,
          message: "Dados de entrada inválidos",
          errors: errorMessages,
        });
        return;
      }

      console.error("Erro inesperado no middleware de validação:", error);
      res.status(500).json({
        code: 500,
        message: "Erro interno do servidor",
      });
      return;
    }
  };
};

// Middleware específico para validar params
export const validateParams = (schema: ZodTypeAny) =>
  validateRequest(schema, "params");

// Middleware específico para validar query
export const validateQuery = (schema: ZodTypeAny) =>
  validateRequest(schema, "query");

// Middleware específico para validar body
export const validateBody = (schema: ZodTypeAny) =>
  validateRequest(schema, "body");