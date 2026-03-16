const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateJWT, authorizeRoles } = require('../middleware/authenticateJWT');

// List all users (admin only)
router.get('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error listando usuarios' });
  }
});

// Update user role (admin only)
router.put('/:id/role', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rol no válido' });
    }
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: 'Usuario no encontrado' });
    u.role = role;
    await u.save();
    const { password, ...userData } = u.toObject();
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: 'Error actualizando rol' });
  }
});

// Delete user (admin only, cannot delete self)
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' });
    }
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error eliminando usuario' });
  }
});

module.exports = router;
