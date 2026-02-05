const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use(routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? 'Internal server error';
  res.status(status).json({ error: message, code: err.code });
});

module.exports = app;
