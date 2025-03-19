import { PrismaClient, film } from "@prisma/client";
import { BaseService } from "./BaseService";

const prisma = new PrismaClient();

export class MovieService extends BaseService<film> {
  constructor() {
    super(prisma.film, "film_id");
  }

  async getActorsByMovie(movieId: number) {
    const movie = await prisma.film.findUnique({
      where: { film_id: movieId },
      include: { film_actor: { include: { actor: true } } },
    });

    return movie?.film_actor.map(fa => fa.actor) || [];
  }
}
