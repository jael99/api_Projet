import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { Request, Response, NextFunction, RequestHandler } from "express";

// Ajout d'une propriété "user" au type Request d'Express
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: number; role: string };
  }
}

// Middleware d'authentification JWT
export const authenticateJWT: RequestHandler = (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Accès refusé : Token manquant" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!JWT_SECRET) {
    res.status(500).json({ error: "Secret JWT non défini" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decodedToken: any) => {
    if (err || decodedToken.aud !== "type-access") {
      res.status(403).json({ error: "Forbidden: Not access token" });
      return;
    }
    req.user = decodedToken as { id: number; role: string };
    next();
  });
};


//Middleware de contrôle d'accès par rôle (RBAC)
export function authorizeRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Accès refusé " });
    }
    next();
  };
}
