const express = require("express");
const router = express.Router();
const { getDb } = require("../db/conn");
const { ObjectId } = require("mongodb");


// Get all movies with pagination
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 20;
    
    const movies = await db
      .collection("movies")
      .find({})
      .project({ title: 1, year: 1, poster: 1, plot: 1 })
      .sort({ year: -1 })
      .skip(page * limit)
      .limit(limit)
      .toArray();
    
    const total = await db.collection("movies").countDocuments();
    
    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// Get a single movie by ID with its comments
router.get("/:id", async (req, res) => {
  try {
    const db = getDb();
    const movieId = new ObjectId(req.params.id);
    
    const movie = await db.collection("movies").findOne({ _id: movieId });
    
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    
    // Fetch comments for this movie
    const comments = await db
      .collection("comments")
      .find({ movie_id: movieId })
      .sort({ date: -1 })
      .toArray();
    
    res.json({ movie, comments });
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

// Add a new comment to a movie
router.post("/:id/comments", async (req, res) => {
  try {
    const db = getDb();
    const movieId = new ObjectId(req.params.id);
    
    // Check if movie exists
    const movie = await db.collection("movies").findOne({ _id: movieId });
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    
    // Prepare the comment object
    const newComment = {
      _id: new ObjectId(),
      movie_id: movieId,
      name: req.body.name || "Anonymous",
      email: req.body.email || "",
      text: req.body.text,
      date: new Date()
    };
    
    // Insert the comment
    await db.collection("comments").insertOne(newComment);
    
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Delete a comment
router.delete("/comments/:commentId", async (req, res) => {
  try {
    const db = getDb();
    const commentId = new ObjectId(req.params.commentId);
    
    const result = await db.collection("comments").deleteOne({ _id: commentId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }
    
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

module.exports = router;