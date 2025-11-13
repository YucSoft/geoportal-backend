import Joi from 'joi';

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'El correo debe ser un email válido.',
        'string.empty': 'El correo es requerido.',
        'any.required': 'El correo es requerido.'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'La contraseña debe tener al menos 6 caracteres.',
        'string.empty': 'La contraseña es requerida.',
        'any.required': 'La contraseña es requerida.'
    }),
    institution: Joi.string().required().messages({
        'string.empty': 'La institución es requerida.',
        'any.required': 'La institución es requerida.'
    })
});