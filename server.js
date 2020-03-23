const express = require('express');
const authRoutes = require('./routes/auth');

const app = express();

app.use('/api', authRoutes);

const port = process.env.PORT || 2000;
app.listen(port, () => console.log(`API is running on port ${port}`));
