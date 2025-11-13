import Joi from 'joi';
import ApiError from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const validationErrors = error.details.map(detail => detail.message);
        throw new ApiError(400, validationErrors.join(', '));
    }

    next();
};