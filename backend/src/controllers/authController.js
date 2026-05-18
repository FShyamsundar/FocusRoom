import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

const buildAuthPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  streakCount: user.streakCount,
  totalFocusHours: user.totalFocusHours,
  lastSessionDate: user.lastSessionDate,
  token: generateToken(user._id),
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password });
  res.status(201).json(buildAuthPayload(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.json(buildAuthPayload(user));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    streakCount: req.user.streakCount,
    totalFocusHours: req.user.totalFocusHours,
    lastSessionDate: req.user.lastSessionDate,
  });
});

