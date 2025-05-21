const express = require('express');
const router = express.Router();

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Ruta de test
router.get('/test', (req, res) => {
res.json({ msg: 'Ruta de test funcionando correctamente' });
});

// Ruta POST /api/auth/register
router.post('/register', async (req, res) => {
const { name, email, password } = req.body;

  // Validar que los campos estén presentes
if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Por favor completa todos los campos' });
}

try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
    return res.status(400).json({ msg: 'El usuario ya está registrado' });
    }

    // Crear nuevo usuario
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ msg: 'Usuario registrado correctamente' });
} catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
}
});

// Ruta POST /api/auth/login
router.post('/login', async (req, res) => {
const { email, password } = req.body;

if (!email || !password) {
    return res.status(400).json({ msg: 'Por favor completa todos los campos' });
}

try {
    const user = await User.findOne({ email });
    if (!user) {
    return res.status(400).json({ msg: 'Usuario no encontrado' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
    return res.status(401).json({ msg: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
    );

    res.json({
    token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
    }
    });
} catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
}
});

module.exports = router;
