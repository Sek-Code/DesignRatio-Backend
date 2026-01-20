import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../../modules/users/users.controller.js";

export const router = Router()

router.post("/",createUser)

router.get("/:id", getUser)

router.get("/", getUsers);

router.delete("/", deleteUser);

router.patch("/:id", updateUser)