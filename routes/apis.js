import express from "express";
import {
  getAllAPIs,
  getAPIById,
  getManyAPIs,
  syncAPIsInMongoDB,
} from "../controllers/apisController.js";
const apisRouter = express.Router();

// Routes

apisRouter.get("/sync", syncAPIsInMongoDB);

apisRouter.get("/:id", getAPIById);

apisRouter.get("/", getAllAPIs);

apisRouter.post("/many", getManyAPIs);

export default apisRouter;
