import express, { Request, Response } from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { enforceAdminAccess } from "../middlewares/roleMiddleware";
import { FilmService } from "../services/FilmService";

const router = express.Router();
const filmService = new FilmService();

/**
 * @swagger
 * /v1/films:
 *   get:
 *     summary: Retrieve all films (paginated)
 *     tags: [Films]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of films per page (default 10)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const movies = await filmService.getAllPaginated(page, limit);
    res.json(movies);
  } catch (error) {
    console.error("Error fetching films:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /v1/films/{id}:
 *   get:
 *     summary: Get a film by ID
 *     tags: [Films]
 */
router.get("/:film_id", async (req, res) => {
  try {
    const movie = await filmService.getById(parseInt(req.params.film_id));
    movie ? res.json(movie) : res.status(404).json({ error: "Film not found" });
  } catch (error) {
    console.error("Error fetching film:", error);
    res.status(500).json({ error: " Server Error" });
  }
});

/**
 * @swagger
 * /v1/films:
 *   post:
 *     summary: Create a new film (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Films]
 */
router.post("/", authenticateJWT, enforceAdminAccess, async (req, res) => {
  try {
    const newFilm = await filmService.create(req.body);
    res.status(201).json(newFilm);
  } catch (error) {
    console.error("Error creating:", error);
    res.status(400).json({ error: "Failed to create " });
  }
});

/**
 * @swagger
 * /v1/films/{id}:
 *   put:
 *     summary: Update a film (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Films]
 */
router.put("/:id", authenticateJWT, enforceAdminAccess, async (req, res) => {
  try {
    const updatedFilm = await filmService.update(parseInt(req.params.id), req.body);
    updatedFilm ? res.json(updatedFilm) : res.status(404).json({ error: "Film not found" });
  } catch (error) {
    console.error("Error updating:", error);
    res.status(400).json({ error: "Failed to update" });
  }
});

/**
 * @swagger
 * /v1/films/{id}:
 *   delete:
 *     summary: Delete a film (Admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Films]
 */
router.delete("/:id", authenticateJWT, enforceAdminAccess, async (req, res) => {
  try {
    const deleted = await filmService.delete(parseInt(req.params.id));
    res.status(deleted ? 204 : 404).send();
  } catch (error) {
    console.error("Error while deleting the movie::", error);
    res.status(500).json({ error: "Failed to delete film" });
  }
});

export default router;
