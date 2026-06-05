import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
//import {Request, Response, NextFunction} from "express";

/**
 * @description Verifica token JWT e barra requisições sem token ou com token inválido/expirado
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 * @returns 
 */
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Token não fornecido" });

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
        next();
    }
    catch {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Token inválido ou expirado" });
    }
}
