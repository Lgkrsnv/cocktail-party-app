require('dotenv').config();
const app = require('../app');
const mongoose = require("mongoose");

const port = process.env.PORT ?? 3500;

app.listen(
  port,
  () => {
    console.log(`Server started on port ${port}.`);

    mongoose.connect('mongodb://localhost:27017/party', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }, () => {
      console.log('Connection to databse is successful.');
    });
  }
);
