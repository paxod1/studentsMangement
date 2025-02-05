const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const studentRouter = require('./Routers/studentRouter');


dotenv.config();

const app = express();


const corsOptions = {
  origin: 'https://students-mangement.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Request Origin: ${req.headers.origin}`);
  console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
  next();
});



app.use('/student', studentRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
