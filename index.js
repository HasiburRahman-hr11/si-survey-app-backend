const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const missionRoutes = require('./routes/missionRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(fileUpload());

// Routes
app.use(userRoutes);
app.use(missionRoutes);


// mongodb+srv://hrhasib:<password>@si-survey-cluster.9qrszl4.mongodb.net/?retryWrites=true&w=majority&appName=si-survey-cluster

const PORT = process.env.PORT || 8000;
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.9qrszl4.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB_CLUSTER}`)
  .then(() => {
    console.log('Database Connected.')
    app.listen(PORT, () => {
      console.log(`Server is connected at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });