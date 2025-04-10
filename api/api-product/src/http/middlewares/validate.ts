import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ObjectSchema } from 'joi';

export function validate(schema: ObjectSchema): RequestHandler {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const messages = error.details.map(err => err.message);
            res.status(400).json({ errors: messages });
            return; // <- só isso já resolve
        }

        req.body = value;
        next();
    };
}
