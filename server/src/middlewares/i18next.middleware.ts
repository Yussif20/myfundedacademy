import { NextFunction, Request, Response } from "express";

// Batch 0 placeholder. Full i18next initialization (with i18next-fs-backend
// + locales/en.json + locales/ar.json) lands in Batch 1 once auth emails need it.
const i18nextMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  (req as any).t = (key: string) => key;
  next();
};

export default i18nextMiddleware;
