import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../../modules/users/users.controller.js";
import { TeaUser } from "../../modules/users/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authUser } from "../../middlewares/auth.js";
import { loginLimiter } from "../../middlewares/rateLimiter.js";

export const router = Router();

router.post("/", createUser);

router.get("/", getUsers);

router.get("/:id", getUser);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

// log in (rate limited)
router.post("/auth/cookie/login", loginLimiter, async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Email and Password are required...",
    });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await TeaUser.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "User not found...",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(401).json({
        error: true,
        message: "Invalid password...",
      });
    }

    // Generate JSON Web Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      error: false,
      message: "Login successful",
      token: token,
      user: {
        _id: user._id,
        username: user.userName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || user.img || "",
        img: user.img || "",
      },
    });
  } catch (error) {
    next(error);
  }
});

// log out
router.post("/auth/cookie/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({
    error: false,
    message: "Logged out successfully",
  });
});

// check log in
router.get("/auth/cookie/me", async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    // Not logged in is an expected state
    if (!token) {
      return res.status(200).json({
        error: false,
        authenticated: false,
        user: null,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(200).json({
        error: false,
        authenticated: false,
        user: null,
      });
    }

    const user = await TeaUser.findById(decoded.userId);

    if (!user) {
      return res.status(200).json({
        error: false,
        authenticated: false,
        user: null,
      });
    }

    return res.status(200).json({
      error: false,
      authenticated: true,
      user: {
        _id: user._id,
        username: user.userName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || user.img || "",
        img: user.img || "",
      },
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes (JWT cookie)
router.get("/auth/test", authUser, (req, res) => {
  res.status(200).json({
    error: false,
    message: "Auth middleware works",
    user: req.user,
  });
});
