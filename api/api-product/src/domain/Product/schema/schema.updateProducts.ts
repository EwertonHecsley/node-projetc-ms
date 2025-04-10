import joi from 'joi';

export const updateProductSchema = joi.object({
    name: joi.string().regex(/^[A-Za-z\s]+$/).messages({
        'string.empty': 'The name field cannot be empty.',
        'string.base': 'Invalid format for the name field.',
        'string.pattern.base': 'Invalid name format. Use only letters and spaces.',
    }),

    price: joi.number().min(0).messages({
        'string.empty': 'The price field cannot be empty.',
        'number.base': 'The price field must be a valid number.',
        'number.min': 'The product price cannot be less than 0.',
    }),

    description: joi.string().messages({
        'string.base': 'Invalid format for the description field.',
    }),
}).min(1).messages({
    'object.min': 'At least one field must be provided to update the product.'
});
