import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const options = { httpOnly: true, secure: true };

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const signup = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (
    [firstName, lastName, username, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingEmailUser = await User.findOne({ email });
  const existingUsernameUser = await User.findOne({ username });

  if (existingEmailUser) {
    throw new ApiError(409, "Email already taken");
  }

  if (existingUsernameUser) {
    throw new ApiError(409, "Username already taken");
  }

  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
  });

  const userResponse = {
    _id: user._id,
    firstName,
    lastName,
    username: user.username,
    email: user.email,
  };

  res
    .status(201)
    .json(new ApiResponse(201, userResponse, "User registered successfully"));
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if ([username, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ username });

  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(401, "Invalid username or password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const userWithoutSensitiveInfo = user.toObject();
  delete userWithoutSensitiveInfo.password;
  delete userWithoutSensitiveInfo.refreshToken;

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken, user: userWithoutSensitiveInfo },
        "User logged in successfully"
      )
    );
};

const logout = async (req, res) => {
  const userId = req.user;

  await User.findByIdAndUpdate(
    userId,
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
    .json(new ApiResponse(200, {}, "User Logged Out"));
};

const refreshAccessToken = async (req, res) => {
  // const incomingRefreshToken =
  //   req.cookies.refreshToken || req.body.refreshToken;

  const incomingRefreshToken = req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  if (!decodedToken) {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token is expired");
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", newRefreshToken)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access Token Refreshed"
      )
    );
};

const update = async (req, res) => {
  const { firstName, lastName, email } = req.body;

  if (
    [firstName, lastName, email].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  console.log(req.user)

  if (existingUser && existingUser._id.toString() !== req.user) {
    throw new ApiError(409, "Email is already in use by another user");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user,
    {
      firstName,
      lastName,
      email,
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
};

// admin functions
const getAllUsers = async (req, res) => {
  const users = await User.find();
  res
    .status(200)
    .json(new ApiResponse(200, users, "User fetched successfully"));
}

const deleteUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await User.findByIdAndDelete(userId);

  const deletedUser = {
    id: user._id,
    email: user.email,
    username: user.username
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedUser, "User deleted successfully"));
};

const updateUserByAdmin = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  if (
    [firstName, lastName, email].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser._id.toString() !== id) {
    throw new ApiError(409, "Email is already in use by another user");
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
      email,
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
};


export { signup, login, logout, refreshAccessToken, update, getAllUsers, deleteUser, updateUserByAdmin };