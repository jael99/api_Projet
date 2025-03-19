import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class BaseService<T> {
  private readonly model: any;
  private readonly primaryKey: string;

  constructor(model: any, primaryKey: string) {
    this.model = model;
    this.primaryKey = primaryKey;
  }

  async getAll(): Promise<T[]> {
    return await this.model.findMany();
  }

  async getAllPaginated(page: number = 1, limit: number = 10): Promise<{ data: T[]; total: number }> {
    const offset = (page - 1) * limit;
    const [data, total] = await prisma.$transaction([
      this.model.findMany({ skip: offset, take: limit }),
      this.model.count(),
    ]);

    return { data, total };
  }

  async getById(id: number): Promise<T | null> {
    return await this.model.findUnique({ where: { [this.primaryKey]: id } });
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create({ data });
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    return await this.model.update({ where: { [this.primaryKey]: id }, data });
  }

  async delete(id: number): Promise<boolean> {
  try {
    // Ensure that all relations are deleted first

    // Delete from film_actor table
    await prisma.film_actor.deleteMany({
      where: { film_id: id },
    });

    // Delete from inventory table if it exists
    await prisma.inventory.deleteMany({
      where: { film_id: id },
    });

    // Now delete the film itself
    await prisma.film.delete({
      where: { film_id: id },
    });

    return true;
  } catch (error) {
    console.error("Error deleting film:", error);
    return false;
  }
}
}
