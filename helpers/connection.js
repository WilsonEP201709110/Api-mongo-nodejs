const { MongoClient } = require('mongodb');

let db = null;

async function connectDatabase() {
  try {
    const client = new MongoClient('mongodb+srv://grupo15:grupo15@proyectodb2.skqlwup.mongodb.net/?retryWrites=true&w=majority');
    await client.connect();
    db = client.db('mi_base_de_datos');
    console.log('Conexión a MongoDB establecida');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
}

function getDatabase() {
  return db;
}

module.exports = { connectDatabase, getDatabase };
