const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./db/conn");
const moviesRoutes = require("./routes/movies");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/movies", moviesRoutes);

// Connect to MongoDB and start server
async function startServer() {
  await connectToDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

startServer().catch(console.error);