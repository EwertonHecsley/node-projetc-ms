import joi from 'joi';

const schemaProduct = joi.object(
    {
        name: joi.string().required().regex(/^[A-Za-z\s]+$/).messages(
            {
                'any.required': 'Campo nome é obrigatorio',
                'string.empty': 'Campo nome não pode ser vazio',
                'string.base': 'Formato de nome invalido',
                'string.pattern.base': 'Formato de nome inválido. Use apenas letras e espaços.',
            }
        ),
        price: joi.number().required().min(0).messages(
            {
                'any.required': 'Campo preco é obrigatorio',
                'string.empty': 'Campo preco não pode ser vazio',
                'number.base': 'Campo preco deve ser preenchido corretamente',
                'number.min': 'O preco do produto não pode ser menor que 0'
            }
        ),
        description: joi.string().optional().messages(
            {
                'string.base': 'Formato de descricao invalido'
            }
        )
    }
)