export function isAdmin(req, res, next) {
if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
}

if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: solo admins' });
}

next();
}

export function isUser(req, res, next) {
if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
}

if (req.user.role !== 'user') {
    return res.status(403).json({ error: 'Acceso denegado: solo usuarios' });
}

    next();
}

export function isUserOrAdmin(req, res, next) {
if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
}

if (req.user.role === 'admin' || req.user.id === req.params.userId) {
    return next();
}

    return res.status(403).json({ error: 'Acceso denegado' });
}
