import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
const router = express.Router();

import { verifyAdminJWT } from "../middlewares/auth.middleware.js";

import {
  signup,
  login,
  logout,
} from "../controllers/admin.controller.js";

import {
  getAllUsers
} from "../controllers/user.controller.js";

// admin authentication routes
router.route("/login").post(asyncHandler(login));
router.route("/signup").post(asyncHandler(signup));
router.route("/logout").post(verifyAdminJWT, asyncHandler(logout));

// admin user operations
router.route("/all-users").get(verifyAdminJWT, asyncHandler(getAllUsers));


export default router;
