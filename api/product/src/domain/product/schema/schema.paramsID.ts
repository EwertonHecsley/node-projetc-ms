import Joi from "joi";

export const IdParamSchema = Joi.object({
    id: Joi.string()
        .guid({ version: ['uuidv4'] })
        .messages({
            'string.guid': 'Invalid ID format. Must be a UUID v4.',
        }),
});