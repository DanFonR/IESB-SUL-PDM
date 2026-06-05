import { StatusCodes } from "http-status-codes";
import express from "express";
const {Request, Response, NextFunction} = express;

/**
 * @description Intercepta alguns erros comuns
 * @param {*} err 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} _next 
 * @returns 
 */
export function errorHandler(err, req, res, _next) {
    console.error(err);

    if (err.name === "ZodError")
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Dados inválidos", details: err.issues });

    if (err.type === "entity.parse.failed")
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "JSON inválido no corpo da requisição" });

    if (err.code === "P2025")
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Recurso não encontrado" });

    if (err.code === "P2002")
        return res.status(StatusCodes.CONFLICT).json({ error: "Registro duplicado" });

    if (err.code === "P2003")
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Referência inválida (FK não existe)" });

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Erro interno do servidor" });
}
