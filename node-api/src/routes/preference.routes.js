import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
const router = express.Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  save,
} from "../controllers/preference.controller.js";

router.route("/save").post(verifyJWT, asyncHandler(save));

export default router;