const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


// Import user/auth routes
const user = require('./routers/auth');

// Import Admin routes
const admin = require('./routers/admin');

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB().then(() => {
  console.log('MongoDB connected successfully');
});

// Body parser middleware
app.use(express.json());  // To parse incoming JSON requests

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Mess Management API is running');
});

// Member routes (public, no protection required for registration)
app.use('/auth/', user);
app.use('/admin/', admin);


// Listen on the designated port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
