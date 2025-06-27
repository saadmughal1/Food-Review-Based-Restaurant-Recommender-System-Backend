import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Admin from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const options = { httpOnly: true, secure: true };

const generateAccessAndRefreshTokens = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);

    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const signup = async (req, res) => {
  const { username, password } = req.body;

  if (
    [username, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUsernameAdmin = await Admin.findOne({ username });

  if (existingUsernameAdmin) {
    throw new ApiError(409, "Username already taken");
  }

  const admin = await Admin.create({
    username,
    password,
  });

  const adminResponse = {
    _id: admin._id,
    username: admin.username,
  };

  res
    .status(201)
    .json(new ApiResponse(201, adminResponse, "Admin registered successfully"));
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if ([username, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const admin = await Admin.findOne({ username });

  if (!admin || !(await admin.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid username or password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    admin._id
  );

  const adminWithoutSensitiveInfo = admin.toObject();
  delete adminWithoutSensitiveInfo.password;
  delete adminWithoutSensitiveInfo.refreshToken;

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken, admin: adminWithoutSensitiveInfo },
        "Admin logged in successfully"
      )
    );
};

const logout = async (req, res) => {
  const adminId = req.user;

  await Admin.findByIdAndUpdate(
    adminId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Admin Logged Out"));
};

const update = async (req, res) => {
  const { token, username, currentPassword, newPassword } = req.body;

  if (
    [token, username, currentPassword, newPassword].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }


  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const admin = await Admin.findById(decoded._id);

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const isPasswordValid = await admin.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid current password");
  }

  const existingUsernameAdmin = await Admin.findOne({
    username,
    _id: { $ne: admin._id }
  });

  if (existingUsernameAdmin) {
    throw new ApiError(409, "Username already in use by another admin");
  }


  admin.password = newPassword;
  admin.username = username
  await admin.save();

  // Generate new tokens
  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();

  // Update refresh token in DB
  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });

  // Send response with new tokens
  res.status(200).json(
    new ApiResponse(200, {
      _id: admin._id,
      username,
      accessToken,
      refreshToken
    }, "Admin settings updated successfully")
  );
};


export { signup, login, logout, update };
