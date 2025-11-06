import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { queryDatabase } from '../services/db.service.js';

// Cargar la variable de entorno JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;

// Controlador de login
export const login = async (req, res) => {
    // Extraer email y contraseña del cuerpo de la solicitud
    const { email, password } = req.body;

    // Validar que ambos campos estén presentes
    if (!email || !password) {
        const err = new Error('Correo y contraseña son requeridos.');
        err.status = 400; // Bad Request
        throw err;
    }

    // Consultar el usuario en la base de datos
    const userQuery = 'SELECT * FROM usuarios WHERE email = $1';
    // Ejecutar la consulta
    const { rows } = await queryDatabase(userQuery, [email.toLowerCase()]);

    // Verificar si el usuario existe
    if (rows.length === 0) {
        const err = new Error('Credenciales incorrectas');
        err.status = 401; // Unauthorized
        throw err;
    }

    // Comparar la contraseña proporcionada con el hash almacenado
    const user = rows[0];
    // Realizar la comparación de contraseñas
    const isMatch = await bcrypt.compare(password, user.password_hash);

    // Si no coinciden, lanzar un error
    if (!isMatch) {
        const err = new Error('Credenciales incorrectas');
        err.status = 401; // Unauthorized
        throw err;
    }
    
    // Generar el token JWT
    const payload = {
        userId: user.id,
        email: user.email,
        rol: user.rol,
    };

    // Firmar el token con la clave secreta y establecer la expiración
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token });
};