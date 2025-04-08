// src/http/middlewares/validate.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ObjectSchema } from 'joi';

export function validate(schema: ObjectSchema): RequestHandler {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const messages = error.details.map(err => err.message);
            res.status(400).json({ errors: messages });
        } else {
            next();
        }
    };
}
