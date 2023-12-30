const express = require('express');
const router = express.Router();
const { getDatabase } = require('../helpers/connection');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const { Readable } = require('stream');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para subir archivos CSV y crear la colección
router.post('/subir-csv', upload.single('archivoCsv'), async (req, res) => {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ message: 'No se ha proporcionado un archivo CSV' });
      }
  
      const db = getDatabase();
      if (!db) {
        return res.status(500).json({ message: 'No se pudo obtener la base de datos' });
      }

      const collection = db.collection(req.body.coleccion); // Nombre de tu colección en MongoDB
  
      const results = [];
  
      // Convierte el buffer del CSV a un stream legible
      const readableStream = Readable.from([req.file.buffer.toString()]);
  
      readableStream
        .pipe(csv({ separator: ';' })) // Parsea el CSV con el separador adecuado
        .on('data', (row) => {
          results.push(row);
        })
        .on('end', async () => {
          if (results.length > 0) {
            const insertResult = await collection.insertMany(results);
            res.status(200).json({ message: 'Datos del CSV subidos exitosamente', insertedCount: insertResult.insertedCount });
          } else {
            res.status(400).json({ message: 'No se encontraron datos en el archivo CSV' });
          }
        });
    } catch (error) {
      res.status(500).json({ message: 'Error al subir los datos del CSV', error: error.toString() });
    }
  });
module.exports = router;