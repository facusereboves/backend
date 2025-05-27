import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { userModel } from '../models/user.models.js'; 
import bcrypt from 'bcrypt';

// Registrar estrategia local en Passport
passport.use('local', new LocalStrategy(
  {
    usernameField: 'email',  // Indica que el username es el email
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

export default passport;
