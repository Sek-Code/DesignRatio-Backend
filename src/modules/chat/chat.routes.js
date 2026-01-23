import { Router } from "express";
import { chatWithBot } from "./chat.controller.js";

export const router = Router();

router.post("/", chatWithBot);
