import joi from 'joi';

export const schemaProduct = joi.object({
    name: joi.string().required().regex(/^[A-Za-z\s]+$/).messages({
        'any.required': 'The name field is required.',
        'string.empty': 'The name field cannot be empty.',
        'string.base': 'Invalid format for the name field.',
        'string.pattern.base': 'Invalid name format. Use only letters and spaces.',
    }),
    price: joi.number().required().min(0).messages({
        'any.required': 'The price field is required.',
        'string.empty': 'The price field cannot be empty.',
        'number.base': 'The price field must be a valid number.',
        'number.min': 'The product price cannot be less than 0.',
    }),
    description: joi.string().optional().messages({
        'string.base': 'Invalid format for the description field.',
    }),
});
