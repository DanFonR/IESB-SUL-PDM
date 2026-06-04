import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { createUserSchema } from "../schemas/userSchema.js";
import { StatusCodes } from "http-status-codes";

const router = Router();

// POST /auth/register - Rota para criar uma conta
router.post("/register", async (req, res, next) => {
    try {
        const data = createUserSchema.parse(req.body);
        const existing = await prisma.user.findUnique({ where: { email: data.email } });

        if (existing)
            return res.status(StatusCodes.CONFLICT).json({ error: "E-mail já cadastrado" });

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: { ...data, password: hashedPassword },
            select: { id: true, name: true, email: true, createdAt: true },
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(StatusCodes.CREATED).json({ user, token });
    }
    catch (err) {
        next(err);
    }
});

// POST /auth/login - Rota para checar se a conta existe, e autenticar o usuário
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "E-mail e senha são obrigatórios" });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Credenciais inválidas" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Credenciais inválidas" });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({
            user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
            token,
        });
    }
    catch (err) {
        next(err);
    }
});

export default router;
