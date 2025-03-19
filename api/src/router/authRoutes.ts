import { Request, Response, NextFunction, Router } from "express";
import { AuthService } from "../services/AuthService";

const router = Router();
const authService = new AuthService();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user and receive a JWT token
 *     tags: [Auth]
 */
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;
    const user = await authService.register(email, password, role);

    if (!user) {
      res.status(400).json({ error: "Echec enregistrement user" });
      return;
    }

    res.status(201).json(user);
  } catch (error) {
    console.error("Registration Failure:", error);
    res.status(500).json({ error: "Erreur Server" });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Sign in a user
 *     tags: [Auth]
 */
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);

    if (!user) {
      res.status(401).json({ error: "Informations d'identification invalides" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: "Refresh token is required" });
      return;
    }

    const newAccessToken = await authService.refresh(refreshToken);

    if (!newAccessToken) {
      res.status(401).json({ error: "Invalid or expired refresh token" });
      return; 
    }

    res.json({ accessToken: newAccessToken });
    return; 
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user (client-side token removal)
 *     tags: [Auth]
 */
router.post("/logout", async (req: Request, res: Response): Promise<void> => {
  res.json({ message: "Successfully logged out (client-side token removal handled)" });
});

export default router;
