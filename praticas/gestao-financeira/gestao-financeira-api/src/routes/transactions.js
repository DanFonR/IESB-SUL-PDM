// src/routes/transactions.js
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { createTransactionSchema, updateTransactionSchema } from "../schemas/transactionSchema.js";
import { StatusCodes } from "http-status-codes";

const router = Router();

function buildDateFilter(query) {
    const month = parseInt(query.month, 10);
    const year = parseInt(query.year, 10);

    if (!month || !year || month < 1 || month > 12 || isNaN(year)) return {};

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    return { date: { gte: start, lte: end } };
}

// GET /transactions?month=5&year=2025
router.get("/", async (req, res, next) => {
    try {
        const dateFilter = buildDateFilter(req.query);
        const transactions = await prisma.transaction.findMany({
            where: { userId: req.userId, ...dateFilter },
            include: { category: true },
            orderBy: { date: "desc" },
        });

        res.json(transactions);
    }
    catch (err) {
        next(err);
    }
});

// POST /transactions
router.post("/", async (req, res, next) => {
    try {
        const data = createTransactionSchema.parse(req.body);
        const categoryCheck = await prisma.transaction.findUnique({
            where: { categoryId: data.categoryId }
        });

        if (!categoryCheck)
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Categoria não encontrada" });

        const transaction = await prisma.transaction.create({
            data: { ...data, userId: req.userId },
            include: { category: true },
        });

        res.status(StatusCodes.CREATED).json(transaction);
    }
    catch (err) {
        next(err);
    }
});

// PUT /transactions/:id
router.patch("/:id", async (req, res, next) => {
    try {
        const existing = await prisma.transaction.findFirst({
            where: { id: req.params.id },
        });

        if (!existing)
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Transação não encontrada" });
        if (existing.userId !== req.userId)
            return res.status(StatusCodes.FORBIDDEN).json({ error: "Sem permissão" });

        const data = updateTransactionSchema.parse(req.body);
        const transaction = await prisma.transaction.update({
            where: { id: req.params.id },
            data,
            include: { category: true },
        });

        res.json(transaction);
    }
    catch (err) {
        next(err);
    }
});

// DELETE /transactions/:id
router.delete("/:id", async (req, res, next) => {
    try {
        const existing = await prisma.transaction.findFirst({
            where: { id: req.params.id },
        });

        if (!existing)
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Transação não encontrada" });
        if (existing.userId !== req.userId)
            return res.status(StatusCodes.FORBIDDEN).json({ error: "Sem permissão" });

        await prisma.transaction.delete({ where: { id: req.params.id } });

        res.status(StatusCodes.NO_CONTENT).send();
    }
    catch (err) {
        next(err);
    }
});

export default router;
