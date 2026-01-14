import { Router } from "express";
import { getMockUser, createMockUser, deleteMockUser } from "../modules/users/users.controller.js";


export const router = Router()

router.get("/", getMockUser)
router.post("/", createMockUser)
router.delete("/:id",deleteMockUser)