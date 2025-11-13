import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { queryDatabase } from '../services/db.service.js';
import ApiError from '../utils/ApiError.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
    const { email, password, institution } = req.body;

    const userQuery = 'SELECT * FROM usuarios WHERE email = $1 AND institution_id = $2';
    const { rows } = await queryDatabase(userQuery, [email.toLowerCase(), institution]);

    if (rows.length === 0) {
        throw new ApiError(401, 'Credenciales incorrectas');
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
        throw new ApiError(401, 'Credenciales incorrectas');
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