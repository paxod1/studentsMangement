const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const studentRouter = require('./Routers/studentRouter');

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); 

// Route setup
app.use('/student', studentRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
