const express = require('express');
const errorMiddleware = require('./middleware/error.js');

const app = express();

app.use(express.json());

// Routes import
const product = require('./routes/productRoutes');

app.use('/api/v1', product);

// Error middleware
// Note : custom error middleware should be used at last after other middlewares
app.use(errorMiddleware);

module.exports = app;