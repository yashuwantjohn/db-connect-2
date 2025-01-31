const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./schema');  // Import User model

dotenv.config();  // Load environment variables from .env file

const app = express();
const port = 3010;

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to database');  // This should show up if the connection is successful
  })
  .catch((err) => {
    console.error('Error connecting to database', err);  // This will log if there are connection issues
  });

// POST API to create a new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Validate incoming data based on the schema
    const newUser = new User({ name, email, age });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    // Handle validation errors or server errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }

    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});