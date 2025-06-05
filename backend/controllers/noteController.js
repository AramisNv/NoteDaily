const Note = require('../models/Note');

// Crear una nota nueva y asignarla al usuario autenticado
const createNote = async (req, res) => {
  try {
    const { title, body, tag } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: 'Título y contenido son obligatorios' });
    }

    const newNote = new Note({
      title,
      body,
      tag: tag || 'general',
      user: req.user.id, // El usuario que creó la nota
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear nota', error: err.message });
  }
};

// Obtener solo las notas del usuario autenticado
const getUserNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener notas', error: err.message });
  }
};

module.exports = {
  createNote,
  getUserNotes,
};
