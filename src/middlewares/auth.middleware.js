import jwt from 'jsonwebtoken';

// Clave secreta para verificar el token JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para verificar el token JWT en las solicitudes entrantes
export const checkJwt = (req, res, next) => {
    // Obtener el token del encabezado Authorization
    try {
        // Verificar que el encabezado Authorization esté presente
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Acceso denegado: No se proporcionó token.' });
        }
        // El formato
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Acceso denegado: Formato de token inválido.' });
        }
        
        // Verificar el token
        jwt.verify(token, JWT_SECRET, (err, userPayload) => {
            if (err) {
                return res.status(403).json({ message: 'Token inválido o expirado.' });
            }
            req.user = userPayload;
            next(); // El token es válido, continuar
        });
    } catch (error) {
        // Pasa el error al manejador global
        next(error);
    }
};