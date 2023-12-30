const express = require('express');
const router = express.Router();
const { getDatabase } = require('../helpers/connection');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/obtener-pdf-usuario/:usuario', async (req, res) => {
    try {
      const db = getDatabase();
      if (!db) {
        return res.status(500).json({ message: 'No se pudo obtener la base de datos' });
      }
  
      const collection = db.collection('archivosPdf');
  
      const usuario = req.params.usuario;
  
      const pdfsUsuario = await collection.find({ usuario }).toArray();
      res.status(200).json({ message: 'PDFs encontrados para el usuario', pdfsUsuario });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los PDFs', error: error.toString() });
    }
  });

// Ruta para subir archivos PDF
router.post('/subir-pdf', upload.single('archivoPdf'), async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(500).json({ message: 'No se pudo obtener la base de datos' });
    }

    const collection = db.collection('archivosPdf');

    const pdfBinario = req.file.buffer;

    const resultado = await collection.insertOne({ usuario: req.body.usuario ,pdf: pdfBinario });
    res.status(200).json({ message: 'PDF subido exitosamente', resultado });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir el PDF', error: error.toString() });
  }
});

module.exports = router;
