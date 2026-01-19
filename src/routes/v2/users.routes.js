import { Router } from "express";
import { createUser, getUser, getUsers } from "../../modules/users/users.controller.js";

export const router = Router()

router.post("/",createUser)

router.get("/:id", getUser)

router.get("/", getUsers);