const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectToDatabase } = require("./db/conn");
const moviesRoutes = require("./routes/movies");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/movies", moviesRoutes);

// Serve static files from the React build for production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../client/build')));

  // For any request that doesn't match an API route, send the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Connect to MongoDB and start server
async function startServer() {
  await connectToDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

startServer().catch(console.error);