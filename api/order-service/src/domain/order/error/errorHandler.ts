import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);

    const status = err.statusCode || 500;
    const message = err.message || "Erro interno no servidor";

    res.status(status).json({ error: message });
}
