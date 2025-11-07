import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { queryDatabase } from '../services/db.service.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
    const { email, password, institution } = req.body;

    if (!email || !password || !institution) {
        const err = new Error('Correo, contraseña e institución son requeridos.');
        err.status = 400;
        throw err;
    }
    const userQuery = 'SELECT * FROM usuarios WHERE email = $1 AND institution_id = $2';
    const { rows } = await queryDatabase(userQuery, [email.toLowerCase(), institution]);

    if (rows.length === 0) {
        const err = new Error('Credenciales incorrectas');
        err.status = 401;
        throw err;
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
        const err = new Error('Credenciales incorrectas');
        err.status = 401;
        throw err;
    }
    const payload = {
        userId: user.id,
        email: user.email,
        rol: user.rol,
        institution: user.institution_id
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token });
};