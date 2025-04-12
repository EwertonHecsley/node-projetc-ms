"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema) {
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
