import { users } from "../../mock-db/userMockData.js";
import { TeaUser } from "./users.model.js";

export const getMockUser = (req, res) => {
  res.status(200).json(users);
};

export const deleteMockUser = (req, res) => {
  const userId = req.params.id;

  const userIndex = users.findIndex((user) => user.id === userId);
  //หาตำแหน่ง index ของuser ในarray users ที่มีid เหมือนกับuserId

  if (userIndex !== -1) {
    users.splice(userIndex, 1);

    res.status(200).send(`User with ID ${userId} deleted ✅`);
  } else {
    res.status(404).send("User not found.");
  }
  //ถ้าเจอ user
  //array.splice(startIndex, deleteCount); ลบuserออก 1 คน ตามตำแหน่ง index
  //     const users = [
  //   { id: "1", name: "Boat" },
  //   { id: "2", name: "Ann" },
  //   { id: "3", name: "Mike" }
  // ];
  // users.splice(userIndex, 1);
  // userIndex = 1;
  // [
  //   { id: "1", name: "Boat" },
  //   { id: "3", name: "Mike" }
  // ]
};

export const createMockUser = (req, res) => {
  const { img, userName, userLast, email, phoneNumber, address } = req.body;

  const newUser = {
    id: String(users.length + 1),
    img: img,
    userName: userName,
    userLast: userLast,
    email: email,
    phoneNumber: phoneNumber,
    address: address,
  };

  users.push(newUser);

  res.status(200).json(newUser);
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await TeaUser.find().select("-password");
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (req, res, next) => {
  const {
    userName,
    userLast,
    email,
    password,
    phoneNumber,
    address,
    role,
    avatarUrl,
  } = req.body;

  if (!userName || !userLast || !email || !password || !address || !phoneNumber) {
    const error = new Error(
      "name,surmane, email, password, phone number and address are required",
    );
    error.name = "ValidationError";
    error.status = 400;
    return next(error);
  }

  try {
    const doc = await TeaUser.create({
      userName,
      userLast,
      avatarUrl,
      role,
      email,
      password,
      phoneNumber,
      address,
    });

    const safe = doc.toObject();
    delete safe.password;

    return res.status(201).json({
      success: true,
      data: safe,
    });
  } catch (error) {
    // Duplicate email
    if (error.code === 11000) {
      error.status = 409;
      error.name = "DuplicateKeyError";
      error.message = "Email already in use";
      return next(error);
    }

    // Mongoose validation
    if (error.name === "ValidationError") {
      error.status = 400;
      error.message = error.message || "Invalid user data";
      return next(error);
    }

    error.status = error.status || 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to create a user";
    return next(error);
  }
};

export const getUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const doc = await TeaUser.findById(id).select("-password");
    if (!doc) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    if (error.name === "CastError") {
      error.status = 400;
      error.message = "Invalid user id";
      return next(error);
    }

    error.status = 500;
    error.name = error.name || "DatabaseError";
    error.message = error.message || "Failed to get a user";
    return next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;

  const body = req.body;

  try {
    const updated = await TeaUser.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      const error = new Error("User not found...");
      error.status = 404;
      return next(error);
    }

    const safe = updated.toObject();
    delete safe.password;

    return res.status(200).json({
      success: true,
      data: safe,
    });
  } catch (error) {
    if (error.code === 11000) {
      error.status = 409;
      error.name = "DuplicateKeyError";
      error.message = "Email already in use";
      return next(error);
    }

    if (error.name === "CastError") {
      error.status = 400;
      error.message = "Invalid user id";
      return next(error);
    }

    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deleted = await TeaUser.findByIdAndDelete(id);

    if (!deleted) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: null,
    });
  } catch (error) {
    if (error.name === "CastError") {
      error.status = 400;
      error.message = "Invalid user id";
      return next(error);
    }

    return next(error);
  }
};
