import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { createCategorySchema, updateCategorySchema } from "../schemas/categorySchema.js";
import { StatusCodes } from "http-status-codes";

const router = Router();

// GET /categories — Retorna categorias padrão + categorias do usuário
router.get("/", async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany({
            where: { OR: [{ isDefault: true }, { userId: req.userId }] },
            orderBy: { displayName: "asc" },
        });

        res.json(categories);
    }
    catch (err) {
        next(err);
    }
});

// POST /categories - Cria uma categoria e a retorna
router.post("/", async (req, res, next) => {
    try {
        const data = createCategorySchema.parse(req.body);
        const category = await prisma.category.create({
            data: { ...data, userId: req.userId, isDefault: false },
        });

        res.status(StatusCodes.CREATED).json(category);
    }
    catch (err) {
        next(err);
    }
});

// PATCH /categories/:id - Atualiza parte de uma categoria e a retorna
router.patch("/:id", async (req, res, next) => {
    try {
        const existing = await prisma.category.findUnique({ where: { id: req.params.id } });

        if (!existing)
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Categoria não encontrada" });
        if (existing.isDefault)
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Categorias padrão não podem ser editadas" });
        if (existing.userId !== req.userId)
            return res.status(StatusCodes.FORBIDDEN).json({ error: "Sem permissão" });

        const data = updateCategorySchema.parse(req.body);
        const category = await prisma.category.update({ where: { id: req.params.id }, data });

        res.json(category);
    }
    catch (err) {
        next(err);
    }
});

// DELETE /categories/:id - Deleta uma categoria
router.delete("/:id", async (req, res, next) => {
    try {
        const existing = await prisma.category.findUnique({ where: { id: req.params.id } });

        if (!existing)
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Categoria não encontrada" });
        if (existing.isDefault)
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Categorias padrão não podem ser excluídas" });
        if (existing.userId !== req.userId)
            return res.status(StatusCodes.FORBIDDEN).json({ error: "Sem permissão" });

        await prisma.category.delete({ where: { id: req.params.id } });

        res.status(StatusCodes.NO_CONTENT).send();
    }
    catch (err) {
        next(err);
    }
});

export default router;
