import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateRequest =
  (schema: ZodObject<any>) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.body && req.body.data) {
        try {
          req.body = JSON.parse(req.body.data);
        } catch {
          return next(new Error("Invalid JSON format in `data` property"));
        }
      }

      const schemaShape = (schema as any).shape;
      const validationTarget: { [key: string]: any } = {};

      if ("body" in schemaShape) validationTarget.body = req.body;
      if ("query" in schemaShape) validationTarget.query = req.query;
      if ("params" in schemaShape) validationTarget.params = req.params;

      await schema.parseAsync(validationTarget);
      return next();
    } catch (err) {
      next(err);
    }
  };

export default validateRequest;
