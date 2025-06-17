import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { userModel } from '../models/user.models.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secreto123';

// Ruta para solicitar recuperación de contraseña
router.post('/forgot-password', async (req, res) => {
const { email } = req.body;

try {
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const token = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    const resetLink = `http://localhost:8080/api/password/reset-password/${token}`;
    console.log('📧 Enlace de recuperación enviado:', resetLink);

    // Simulación de envío de email
    res.json({ message: 'Email de recuperación enviado (simulado)', resetLink });
} catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
}
});

// Ruta para restablecer contraseña
router.post('/reset-password/:token', async (req, res) => {
const { token } = req.params;
const { newPassword } = req.body;

try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la anterior' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Contraseña restablecida correctamente' });
} catch (error) {
    if (error.name === 'TokenExpiredError') {
        return res.status(400).json({ error: 'El enlace ha expirado' });
    }
    res.status(500).json({ error: 'Token inválido o error del servidor' });
}
});

export default router;
