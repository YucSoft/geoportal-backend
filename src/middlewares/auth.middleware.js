import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const checkJwt = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new ApiError(401, 'Acceso denegado: No se proporcionó token.');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new ApiError(401, 'Acceso denegado: Formato de token inválido.');
        }

        jwt.verify(token, JWT_SECRET, (err, userPayload) => {
            if (err) {
                throw new ApiError(403, 'Token inválido o expirado.');
            }
            req.user = userPayload;
            next();
        });
    } catch (error) {
        next(error);
    }
};