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
  getAllUsers,
  signup as userSignUp,
  deleteUser,
  updateUserByAdmin
} from "../controllers/user.controller.js";

// admin authentication routes
router.route("/login").post(asyncHandler(login));
router.route("/signup").post(asyncHandler(signup));
router.route("/logout").post(verifyAdminJWT, asyncHandler(logout));

// admin user operations

router.route("/all-users").get(asyncHandler(getAllUsers));
router.route("/add-user").post(asyncHandler(userSignUp));

router.route("/update-user/:id").patch(asyncHandler(updateUserByAdmin));
router.route("/delete-user").delete(asyncHandler(deleteUser));


export default router;
