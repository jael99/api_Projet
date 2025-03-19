import express from "express";
import { authenticateJWT } from "../middlewares/authMiddleware";
import { enforceAdminAccess } from "../middlewares/roleMiddleware";
import { ActorService } from "../services/ActorService";

const router = express.Router();
const actorService = new ActorService();

/**
 * @swagger
 * /v1/actors:
 *   get:
 *     summary: Get all actors
 *     tags: [actors]
 */
router.get("/", async (_req, res) => {
  res.json(await actorService.getAll());
});

/**
 * @swagger
 * /v1/actors/{actor_id}:
 *   get:
 *     summary: Get an actor by ID
 *     tags: [actors]
 */
router.get("/:actor_id", async (req, res) => {
  const actor = await actorService.getById(parseInt(req.params.actor_id));
  actor ? res.json(actor) : res.status(404).json({ error: "Actor Not Found" });
});

router.post("/", authenticateJWT, enforceAdminAccess , async (req, res) => {
  const newActor = await actorService.create(req.body);
  res.status(201).json(newActor);
});

router.put("/:actor_id", authenticateJWT, enforceAdminAccess , async (req, res) => {
  const updatedActor = await actorService.update(parseInt(req.params.actor_id), req.body);
  updatedActor ? res.json(updatedActor) : res.status(404).json({ error: "Actor Not Found" });
});

router.delete("/:actor_id", authenticateJWT, enforceAdminAccess , async (req, res) => {
  res.status((await actorService.delete(parseInt(req.params.actor_id))) ? 204 : 404).send();
});

export default router;
