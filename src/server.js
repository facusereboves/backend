import express from 'express'
import mongoose from 'mongoose'
import { create } from 'express-handlebars'
import { Server } from 'socket.io'
import path from 'path'
import { __dirname } from './path.js'

// Cargar variables de entorno
import dotenv from 'dotenv'
dotenv.config()

// Import passport y configuración
import passport from 'passport'
import './config/passport.js'

// Routers existentes
import productRouter from './routes/productos.routes.js'
import cartRouter from './routes/carritos.routes.js'
import multerRouter from './routes/imagenes.routes.js'
import chatRouter from './routes/chat.routes.js'
import orderRouter from './routes/orders.routes.js'

// Router de usuarios (reutilizado para /api/users y /api/sessions)
import userRouter from './routes/users.routes.js'

const app = express()
const hbs = create()
const PORT = process.env.PORT || 8080

const server = app.listen(PORT, () => {
    console.log("Server on port", PORT)
})

// Conexión a MongoDB
try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("BDD conectada")
} catch (e) {
    console.log("Error al conectar con BDD: ", e)
}

// Websockets
const io = new Server(server)

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

// Motor de plantillas
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

// Archivos públicos
app.use('/public', express.static(path.join(__dirname, 'public')))

// Rutas
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/chat', chatRouter)
app.use('/api/orders', orderRouter)
app.use('/upload', multerRouter)

// Usuarios y sesiones (misma lógica, distintas rutas)
app.use('/api/users', userRouter)
app.use('/api/sessions', userRouter) // <- Esta línea hace posible /api/sessions/current

// Ruta base
app.get('/', (req, res) => {
    res.status(200).send("Ok")
})

// WebSocket Chat
let mensajes = []

io.on('connection', (socket) => {
    console.log('Usuario conectado: ', socket.id)

    socket.on('mensaje', (data) => {
        console.log('Mensaje recibido: ', data)
        mensajes.push(data)
        socket.emit('respuesta', mensajes)
    })

    socket.on('disconnect', () => {
        console.log('Usuario desconectado: ', socket.id)
    })
})


//68360d358253362cba7001ef
