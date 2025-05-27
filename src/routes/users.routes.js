import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/user.models.js' // Ajustá la ruta si está en otra carpeta

const router = Router()

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body

    const userExist = await User.findOne({ email })
    if (userExist) return res.status(400).json({ error: 'El usuario ya existe' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      email,
      password: hashedPassword,
      first_name,
      last_name
    })

    await newUser.save()

    res.status(201).json({ message: 'Usuario registrado exitosamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
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

export default router
