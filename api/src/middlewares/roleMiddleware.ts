import { Request, Response, NextFunction } from "express";

//restreindre l'accès aux administrateurs uniquement
export const enforceAdminAccess  = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Accès interdit : privilèges administrateur requis" });
    return;
  }
  next();
};

