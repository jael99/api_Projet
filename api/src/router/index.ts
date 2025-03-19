import express from "express";
import moviesRoutes from "./moviesRoutes";
import filmsRoutes from "./filmsRoutes";
import actorsRoutes from "./actorsRoutes";
import systemRoutes from "./systemRoutes";
import authRoutes from "./authRoutes";

const router = express.Router();

router.use("/v1/movies", moviesRoutes);
router.use("/v1/films", filmsRoutes);
router.use("/v1/actors", actorsRoutes);
router.use("/auth", authRoutes); // Auth routes
router.use("/", systemRoutes); 

export default router;
