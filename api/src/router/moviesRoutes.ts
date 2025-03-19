import express, { Request, Response } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { enforceAdminAccess } from "../middlewares/roleMiddleware";
import { MovieService } from "../services/MovieService";

const router = express.Router();
const movieService = new MovieService();

/**
 * @swagger
 * /v1/movies:
 *   get:
 *     summary: Get all movies with pagination
 *     tags: [Movies]
 */
router.get("/", async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    res.status(400).json({ error: "Invalid pagination parameters" });
    return;
  }

  const result = await movieService.getAllPaginated(page, limit);
  res.json({
    page,
    limit,
    totalMovies: result.total,
    totalPages: Math.ceil(result.total / limit),
    data: result.data,
  });
});

/**
 * @swagger
 * /v1/movies/{film_id}:
 *   get:
 *     summary: Get a movie by film_id
 *     tags: [Movies]
 */
router.get("/:film_id", async (req, res) => {
  const movie = await movieService.getById(parseInt(req.params.film_id));
  movie ? res.json(movie) : res.status(404).json({ error: "Not Found" });
});

/**
 * @swagger
 * /v1/movies:
 *   post:
 *     summary: Create a new movie (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Movies]
 */
router.post("/", authenticateJWT, enforceAdminAccess, async (req: Request, res: Response) => {
  if (!req.body.title || !req.body.language_id) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const newMovie = await movieService.create(req.body);
  res.status(201).json(newMovie);
});

/**
 * @swagger
 * /v1/movies/{film_id}:
 *   put:
 *     summary: Update a movie (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Movies]
 */
router.put("/:film_id", authenticateJWT, enforceAdminAccess, async (req, res) => {
  const updatedMovie = await movieService.update(parseInt(req.params.film_id), req.body);
  updatedMovie ? res.json(updatedMovie) : res.status(404).json({ error: "Not Found" });
});

/**
 * @swagger
 * /v1/movies/{film_id}:
 *   delete:
 *     summary: Delete a movie (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Movies]
 */
router.delete("/:film_id", authenticateJWT, enforceAdminAccess, async (req, res) => {
  res.status((await movieService.delete(parseInt(req.params.film_id))) ? 204 : 404).send();
});

/**
 * @swagger
 * /v1/movies/{film_id}/actors:
 *   get:
 *     summary: Get all actors in a specific movie
 *     tags: [Movies]
 */
router.get("/:film_id/actors", async (req, res) => {
  const actors = await movieService.getActorsByMovie(parseInt(req.params.film_id));
  actors ? res.json(actors) : res.status(404).json({ error: "Movie Not Found" });
});

export default router;
