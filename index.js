const express = require('express');
const cors = require('cors');
const { connectDatabase } = require('./helpers/connection');
const image_router = require('./Routers/imageRoute');
const pdf_router = require('./Routers/pdfRoute');
const csv_router = require('./Routers/loadCSVRoute');
const script_router = require('./Routers/scriptRoute');

const app = express();
app.use(cors());
const PORT = 3001;

app.use(express.json());
app.use('/imagen', image_router);
app.use('/pdf', pdf_router);
app.use('/csv', csv_router);
app.use('/script', script_router);

connectDatabase();

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
