const isSellerorAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
    if (req.user.role !== 'admin' && req.user.role !== 'customer') {
    return res.status(403).json({ message: 'Seller or Admin access required' });
    }
    next();
}

export default isSellerorAdmin;