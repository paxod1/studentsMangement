const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const studentRouter = require('./Routers/studentRouter');

dotenv.config();

const app = express();

// CORS configuration

app.use(cors());
// {
//   origin: 'http://localhost:5173',
//   methods: 'GET,POST,PUT,DELETE',
//   allowedHeaders: 'Content-Type,Authorization'
// }

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});


// Route setup
app.use('/student', studentRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
