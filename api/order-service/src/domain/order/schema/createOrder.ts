import Joi from 'joi';

export const createOrderSchema = Joi.object({
    products: Joi.array().items(
        Joi.object({
            id: Joi.string().uuid().required().messages({
                'any.required': 'The product id is required.',
                'string.empty': 'The product id cannot be empty.',
                'string.uuid': 'Invalid format for product id.',
            }),
            quantity: Joi.number().integer().min(1).required().messages({
                'any.required': 'The quantity is required.',
                'number.base': 'The quantity must be a valid number.',
                'number.integer': 'The quantity must be an integer.',
                'number.min': 'The quantity must be at least 1.',
            }),
        })
    ).min(1).required().messages({
        'array.base': 'Products must be an array.',
        'array.min': 'At least one product must be included in the order.',
        'any.required': 'The products field is required.',
    }),
});
