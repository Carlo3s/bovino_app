const express = require('express');
const router = express.Router();
const Bovino = require('../models/Bovino');

// Obtener todos los bovinos
router.get('/', async (req, res) => {
  const bovinos = await Bovino.find();
  res.json(bovinos);
});

// Crear un bovino
router.post('/', async (req, res) => {
  const bovino = new Bovino(req.body);
  await bovino.save();
  res.json(bovino);
});

// Actualizar un bovino
router.put('/:id', async (req, res) => {
  const bovino = await Bovino.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(bovino);
});

// Eliminar un bovino
router.delete('/:id', async (req, res) => {
  await Bovino.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
