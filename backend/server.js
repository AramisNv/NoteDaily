// backend/server.js
const express = require('express');

const app = express();
app.use(express.static('public'));

const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env');
console.log('Intentando cargar .env desde:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error cargando .env:', result.error);
} else {
  console.log('.env cargado correctamente:', result.parsed);
}

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET);


const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;




// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
connectDB();

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
