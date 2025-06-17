import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'secreto123';

const authenticateToken = (req, res, next) => {
const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // "Bearer token"

if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
}

jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }

    req.user = decoded; // guardamos el contenido del JWT en req.user
    next();
});
};

export default authenticateToken;
