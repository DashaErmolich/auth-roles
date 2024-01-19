const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = require('./auth-router');

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.json());
app.use('/auth', router);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASSWORD}@cluster0.lbtc64z.mongodb.net/?retryWrites=true&w=majority`
    )
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
}

start();