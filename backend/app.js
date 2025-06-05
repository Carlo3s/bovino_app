require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/bovinos', require('./routes/bovinos'));
app.use('/api/fisicos', require('./routes/fisicos'));
app.use('/api/actividades', require('./routes/actividades'));
app.use('/api/gramineas', require('./routes/gramineas'));

// Conexión a MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cms_ganadero';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor backend en puerto ${PORT}`));
  })
  .catch(err => console.error('Error de conexión a MongoDB:', err));
