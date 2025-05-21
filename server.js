require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const authRoutes = require('./routes/auth');

app.use(express.json());
app.use('/api/auth', authRoutes);

// 👇 Agrega esta línea para verificar si la URI se está cargando bien
console.log('URI de Mongo:', process.env.MONGODB_URI);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Bienvenido a NoteDaily backend');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
