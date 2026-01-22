import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../../modules/users/users.controller.js";
import { TeaUser } from "../../modules/users/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authUser } from "../../middlewares/auth.js";

export const router = Router()

router.post("/", createUser)

router.get("/", getUsers);

router.get("/:id", getUser)

router.patch("/:id", updateUser)

router.delete("/:id", deleteUser);

//log in
router.post("/auth/cookie/login", async (req, res, next) => {
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
      "+password"
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
      },
    });
  } catch (error) {
    next(error);
  }
});

//log out
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

//check log in
router.get("/auth/cookie/me", authUser, async (req, res, next) => {
  try {
    const userId = req.user.user._id;

    const user = await TeaUser.findById(userId);

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Unauthenticated",
      });
    }

    res.status(200).json({
      error: false,
      user: {
        _id: user._id,
        username: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});
