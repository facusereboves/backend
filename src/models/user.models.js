import { Schema, model } from 'mongoose'

const userSchema = new Schema({
first_name: { type: String, required: true },
last_name: { type: String, required: true },
email: { type: String, unique: true, required: true },
age: { type: Number, required: true },
  password: { type: String, required: true }, // encriptada
cart: {
    type: Schema.Types.ObjectId,
    ref: 'carts',
    default: null
},
role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
},

  // Campos para recuperación de contraseña
resetToken: { type: String, default: null },
resetTokenExpiration: { type: Date, default: null }
})

export const userModel = model('users', userSchema)
