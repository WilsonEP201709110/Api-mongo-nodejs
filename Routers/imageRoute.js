const express = require('express');
const router = express.Router();
const { getDatabase } = require('../helpers/connection');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/obtener-imagenes-usuario/:usuario', async (req, res) => {
    try {
      const db = getDatabase();
      if (!db) {
        return res.status(500).json({ message: 'No se pudo obtener la base de datos' });
      }
  
      const collection = db.collection('imagenes');
  
      const usuario = req.params.usuario;
  
      const imagenes = await collection.find({ usuario }).toArray();
      res.status(200).json({ message: 'Imágenes encontradas', imagenes });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las imágenes', error: error.toString() });
    }
  });

router.post('/subir-imagen', upload.single('imagen'), async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(500).json({ message: 'No se pudo obtener la base de datos' });
    }

    const collection = db.collection('imagenes');

    const imagenBinaria = req.file.buffer;

    const resultado = await collection.insertOne({ usuario: req.body.usuario ,imagen: imagenBinaria });
    res.status(200).json({ message: 'Imagen subida exitosamente', resultado });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir la imagen', error: error.toString() });
  }
});

module.exports = router;
