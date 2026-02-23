import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    // Verifica que exista el header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Extrae el token
    const token = authHeader.split(' ')[1];

    //  Verifica token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.user = decoded; // { id, role, iat, exp }
      next();
    });

  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default authMiddleware;