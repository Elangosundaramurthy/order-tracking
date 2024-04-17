const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/AuthRoutes');
class App {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 3005;
    this.setupDatabase();
    this.setupMiddleware();
    this.setupRoutes();
    this.startServer();
  }
  setupDatabase() {
    mongoose.connect('mongodb://localhost:27017/login',
    // { useNewUrlParser: true, useUnifiedTopology: true }
     )
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
      });
  }
  setupMiddleware() {
    this.app.use(bodyParser.json());
  }
  setupRoutes() {
    this.app.use(authRoutes);
  }
  startServer() {
    this.app.listen(this.PORT, () => {
      console.log(`Server is running on port ${this.PORT}`);
    });
  }
}
new App();
