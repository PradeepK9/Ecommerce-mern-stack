const express = require('express');
const errorMiddleware = require('./middleware/error.js');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes import
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/v1', productRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', orderRoutes);

// Error middleware
// Note : custom error middleware should be used at last after other middlewares
app.use(errorMiddleware);

module.exports = app;