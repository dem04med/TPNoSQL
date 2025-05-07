const express = require("express");
const router = express.Router();
const { getDb } = require("../db/conn");
const { ObjectId } = require("mongodb");

// Helper function to validate comment data
const validateComment = (comment) => {
  if (!comment.name || !comment.text) {
    return false;
  }
  return true;
};

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
    
    // Validate movie exists
    const movie = await db.collection("movies").findOne({ _id: movieId });
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    
    // Validate comment data
    const comment = req.body;
    if (!validateComment(comment)) {
      return res.status(400).json({ error: "Invalid comment data. Name and text are required." });
    }
    
    // Prepare comment for insertion
    const newComment = {
      name: comment.name,
      email: comment.email || "",
      movie_id: movieId,
      text: comment.text,
      date: new Date()
    };
    
    // Insert comment
    const result = await db.collection("comments").insertOne(newComment);
    
    // Return the new comment with its ID
    res.status(201).json({
      ...newComment,
      _id: result.insertedId
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Update an existing comment
router.put("/comments/:commentId", async (req, res) => {
  try {
    const db = getDb();
    const commentId = new ObjectId(req.params.commentId);
    
    // Find the comment first
    const existingComment = await db.collection("comments").findOne({ _id: commentId });
    if (!existingComment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    
    // Validate comment data
    const updates = req.body;
    if (!validateComment(updates)) {
      return res.status(400).json({ error: "Invalid comment data. Name and text are required." });
    }
    
    // Update only allowed fields
    const result = await db.collection("comments").updateOne(
      { _id: commentId },
      {
        $set: {
          name: updates.name,
          email: updates.email || existingComment.email,
          text: updates.text,
          // Don't update movie_id or creation date
        }
      }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "Comment not modified" });
    }
    
    // Get the updated comment
    const updatedComment = await db.collection("comments").findOne({ _id: commentId });
    res.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ error: "Failed to update comment" });
  }
});

// Delete a comment
router.delete("/comments/:commentId", async (req, res) => {
  try {
    const db = getDb();
    const commentId = new ObjectId(req.params.commentId);
    
    // First find the comment to make sure it exists
    const comment = await db.collection("comments").findOne({ _id: commentId });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    
    // Delete the comment
    const result = await db.collection("comments").deleteOne({ _id: commentId });
    
    if (result.deletedCount === 0) {
      return res.status(400).json({ error: "Failed to delete comment" });
    }
    
    res.json({ message: "Comment deleted successfully", deletedId: req.params.commentId });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

module.exports = router;