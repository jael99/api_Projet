import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient, users } from "@prisma/client";
import { JWT_SECRET } from "../config";

const prisma = new PrismaClient();

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Pick<users, "id" | "email" | "role">;
}

export class AuthService {
  async register(
    email: string,
    password: string,
    role: "admin" | "user" | "guest" = "user"
  ): Promise<AuthResponse | null> {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          role,
        },
        select: { id: true, email: true, role: true },
      });

    const accessToken = this.generateAccessToken(newUser.id, newUser.role, "type-access");
    const refreshToken = this.generateRefreshToken(newUser.id, "type-refresh");

      // Store the refresh token in the DB
      await prisma.users.update({
        where: { id: newUser.id },
        data: { refresh_token: refreshToken },
      });

      return { accessToken, refreshToken, user: newUser };
    } catch (error) {
      console.error("Registration error:", error);
      return null;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse | null> {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const accessToken = this.generateAccessToken(user.id, user.role, "type-access");
    const refreshToken = this.generateRefreshToken(user.id, "type-refresh");

    // Store the refresh token in the DB
    await prisma.users.update({
      where: { id: user.id },
      data: { refresh_token: refreshToken },
    });

    return { accessToken, refreshToken, user };
  }

  async refresh(refreshToken: string): Promise<string | null> {
    try {
      if (!refreshToken) {
        console.warn("No refresh token provided");
        return null;
      }

      // Verify refresh token
      const decoded: any = jwt.verify(refreshToken, JWT_SECRET!);

      // Find user in DB
      const user = await prisma.users.findUnique({ where: { id: decoded.id } });

      if (!user) {
        console.warn("User not found for refresh token");
        return null;
      }

      // Ensure stored refresh token matches
      if (user.refresh_token !== refreshToken) {
        console.warn("Refresh token mismatch");
        return null;
      }

      // Generate new access token
      return this.generateAccessToken(user.id, user.role, "type-access");
    } catch (error) {
      console.error("Refresh Token Error:", error);
      return null;
    }
  }

  async logout(userId: number): Promise<boolean> {
    try {
      await prisma.users.update({
        where: { id: userId },
        data: { refresh_token: null },
      });
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }

private generateAccessToken(userId: number, role: string, audience: string): string {
    return jwt.sign({ id: userId, role, aud: audience }, JWT_SECRET!, { expiresIn: "1h" });
}

private generateRefreshToken(userId: number, audience: string): string {
    return jwt.sign({ id: userId, aud: audience }, JWT_SECRET!, { expiresIn: "7d" });
}
}
