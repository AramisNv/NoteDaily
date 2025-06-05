const express = require('express');
const Note = require('../models/Note');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(auth);

// Crear nota
router.post('/', async (req, res) => {
  const { title, body, tag } = req.body;

  try {
    const newNote = new Note({
      title,
      body,
      tag,
      userId: req.user.id, // viene del token
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error al crear la nota:', error);
    res.status(500).json({ message: 'Error al crear la nota', error: error.message });
  }
});

// Obtener todas las notas del usuario autenticado
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Error al obtener notas:', error);
    res.status(500).json({ message: 'Error al obtener notas', error: error.message });
  }
});

// Actualizar nota del usuario
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, body, tag } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de nota no válido' });
  }

  try {
    const note = await Note.findById(id);

    if (!note || note.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para modificar esta nota' });
    }

    note.title = title;
    note.body = body;
    note.tag = tag;
    await note.save();

    res.json(note);
  } catch (error) {
    console.error('Error al actualizar la nota:', error);
    res.status(500).json({ message: 'Error al actualizar la nota', error: error.message });
  }
});


// Eliminar nota del usuario
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de nota no válido' });
  }

  try {
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para eliminar esta nota' });
    }

    // Cambiar de note.remove() a:
    await Note.findByIdAndDelete(id);

    res.json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la nota:', error);
    res.status(500).json({ message: 'Error al eliminar la nota', error: error.message });
  }
});

module.exports = router;
