import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.models.js';

const JWT_SECRET = 'tu_secreto_super_seguro'; // Mejor usar variables de entorno

export const createUser = async (userData) => {
    const { password, ...rest } = userData;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new userModel({
        ...rest,
        password: hashedPassword
    });

    return await user.save();
};

export const loginUser = async ({ email, password }) => {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error('Usuario no encontrado');

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) throw new Error('Contraseña incorrecta');

    // Generar token
    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { user, token };
};

