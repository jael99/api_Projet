import { BaseService } from "./BaseService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface Film {
  id: number;
  title: string;
  genre: string;
}

export class FilmService extends BaseService<Film> {
  constructor() {
    super(prisma.film, "actor_id");
  }
}
