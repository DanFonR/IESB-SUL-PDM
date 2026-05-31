import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { updateUserSchema } from "../schemas/userSchema.js";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true,
                createdAt: true, categories: true, transactions: true },
        });

        res.json(user);
    }
    catch (err) {
        next(err);
    }
});

router.patch("/", async (req, res, next) => {
    try {
        const data = updateUserSchema.parse(req.body);
        const user = await prisma.user.update({
            where: { id: req.userId },
            data,
            select: { id: true, name: true, email: true,
                createdAt: true, categories: true, transactions: true },
        });

        res.json(user);
    }
    catch (err) {
        next(err);
    }
});

export default router;
