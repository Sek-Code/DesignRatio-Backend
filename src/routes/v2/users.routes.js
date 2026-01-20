import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../../modules/users/users.controller.js";

export const router = Router()

router.post("/",createUser)

router.get("/", getUsers);

router.get("/:id", getUser)

router.delete("/:id", deleteUser);

router.patch("/:id", updateUser)