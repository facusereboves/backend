import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import authenticateToken from '../middleware/auth.middleware.js'

// Repositorio
import UserRepository from '../repositories/user.repository.js'
import userDAO from '../dao/user.dao.js'
import { sendRecoveryEmail } from '../utils/email.utils.js'

const userRepository = new UserRepository(userDAO)
const router = Router()

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body

    const userExist = await userRepository.findByEmail(email)
    if (userExist) return res.status(400).json({ error: 'El usuario ya existe' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await userRepository.createUser({
      email,
      password: hashedPassword,
      first_name,
      last_name
    })

    res.status(201).json({ message: 'Usuario registrado exitosamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await userRepository.findByEmail(email)
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' })

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta' })

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      },
      process.env.JWT_SECRET || 'secreto123',
      { expiresIn: '1h' }
    )

    res.status(200).json({ message: 'Login exitoso', token })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// CURRENT SESSION (DTO)
router.get('/sessions/current', authenticateToken, async (req, res) => {
  try {
    const user = await userRepository.findById(req.user.id)
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    const { password, resetToken, resetTokenExpiration, ...userDTO } = user.toObject()
    res.status(200).json({ user: userDTO })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos del usuario' })
  }
})


//Recuperación de Contraseña


// Enviar email de recuperación
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    const user = await userRepository.findByEmail(email)

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

    const token = crypto.randomBytes(32).toString('hex')
    const expiration = Date.now() + 3600000 // 1 hora

    user.resetToken = token
    user.resetTokenExpiration = expiration
    await user.save()

    await sendRecoveryEmail(email, token)

    res.status(200).json({ message: 'Correo de recuperación enviado' })
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar correo de recuperación' })
  }
})

// Restablecer contraseña
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params
    const { newPassword } = req.body

    const user = await userRepository.findByResetToken(token)

    if (!user || user.resetTokenExpiration < Date.now()) {
      return res.status(400).json({ error: 'Token inválido o expirado' })
    }

    const samePassword = await bcrypt.compare(newPassword, user.password)
    if (samePassword) {
      return res.status(400).json({ error: 'No se puede usar la misma contraseña anterior' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    user.resetToken = undefined
    user.resetTokenExpiration = undefined

    await user.save()

    res.status(200).json({ message: 'Contraseña actualizada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al restablecer contraseña' })
  }
})

export default router
