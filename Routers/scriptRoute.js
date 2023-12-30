const express = require('express');
const router = express.Router();
const { getDatabase } = require('../helpers/connection');

router.get('/consulta1', async (req, res) => {
    try {
        const db = getDatabase();
        if (!db) {
          return res.status(500).json({ message: 'No se pudo obtener la base de datos' });
        }
    
        const collection = db.collection('Pacientes');
    
        const conteo18 = await collection.countDocuments({ edad: { $lt: "18" } });
        const conteo18y64 = await collection.countDocuments({ edad: { $gte: "18", $lte: "64" } });
        const conteo64 = await collection.countDocuments({ edad: { $gt: "64" } });

        res.status(200).json({ pedriatrico : conteo18 , mediana_edad : conteo18y64, geriatrico : conteo64});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al realizar la consulta.' });
    }
  });

  router.get('/consulta2', async (req, res) => {
    try {
        const db = getDatabase();
        if (!db) {
          return res.status(500).json({ message: 'No se pudo obtener la base de datos' });
        }
    
        const collection = db.collection('LogActividades1');
    
        const result = await collection.aggregate([
          {
            $group: {
              _id: "$idHabitacion",
              cantidadPacientes: { $sum: 1 }
            }
          },
          {
            $lookup: {
              from: "Habitaciones", // Nombre de la otra colección
              localField: "_id",
              foreignField: "idHabitacion",
              as: "habitacionInfo"
            }
          },
          {
            $unwind: "$habitacionInfo"
          },
          {
            $project: {
              _id: 0,
              idHabitacion: "$_id",
              habitacion: "$habitacionInfo.habitacion",
              cantidadPacientes: 1
            }
          }
        ]).toArray();
    
        res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al realizar la consulta.' });
    }
  });

  router.get('/consulta3', async (req, res) => {
    try {
        const db = getDatabase();
        if (!db) {
          return res.status(500).json({ message: 'No se pudo obtener la base de datos' });
        }
    
        const collection = db.collection('Pacientes');
    
        const result = await collection.aggregate([
            {
              $group: {
                _id: "$genero",
                cantidadPacientes: { $sum: 1 }
              }
            }
          ]).toArray();
    
        res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al realizar la consulta.' });
    }
  });

  router.get('/consulta4', async (req, res) => {
    try {
        const db = getDatabase();
        if (!db) {
          return res.status(500).json({ message: 'No se pudo obtener la base de datos' });
        }
    
        const collection = db.collection('Pacientes');
    
        const result = await collection.aggregate([
            {
              $group: {
                _id: "$edad",
                cantidadPacientes: { $sum: 1 }
              }
            },
            {
              $sort: { cantidadPacientes: -1 }
            },
            {
              $limit: 5
            },
            {
              $project: {
                _id: 0,
                edad: "$_id",
                cantidadPacientes: 1
              }
            }
          ]).toArray();
    
        res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al realizar la consulta.' });
    }
  });

  router.get('/consulta5', async (req, res) => {
    try {
        const db = getDatabase();
        if (!db) {
          return res.status(500).json({ message: 'No se pudo obtener la base de datos' });
        }
    
        const collection = db.collection('Pacientes');
    
        const result = await collection.aggregate([
            {
              $group: {
                _id: "$edad",
                cantidadPacientes: { $sum: 1 }
              }
            },
            {
              $sort: { cantidadPacientes: 1 }
            },
            {
              $limit: 5
            },
            {
              $project: {
                _id: 0,
                edad: "$_id",
                cantidadPacientes: 1
              }
            }
          ]).toArray();
    
        res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al realizar la consulta.' });
    }
  });

module.exports = router;