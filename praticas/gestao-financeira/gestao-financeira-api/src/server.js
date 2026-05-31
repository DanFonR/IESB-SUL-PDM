// src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import categoriesRouter from "./routes/categories.js";
import transactionsRouter from "./routes/transactions.js";
import usersRouter from "./routes/users.js";
import { authMiddleware } from "./middlewares/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { prisma } from "./lib/prisma.js";
import { StatusCodes } from "http-status-codes";

const app = express();

app.use(cors());
app.use(express.json());

// Rota pública
app.get("/", (req, res) => res.json({ ok: true, name: "gestao-financeira-api" }));
app.get("/ready", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        
        res.json({ ok: true });
    }
    catch {
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ ok: false });
    }
});

app.use("/auth", authRouter);

// Rotas protegidas por JWT
app.use("/categories", authMiddleware, categoriesRouter);
app.use("/transactions", authMiddleware, transactionsRouter);
app.use("/users", authMiddleware, usersRouter);

app.use(errorHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`API rodando em http://localhost:${port}`));
