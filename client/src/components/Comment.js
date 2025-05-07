import React, { useState } from 'react';

function Comment({ comment, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(comment.name);
  const [editedText, setEditedText] = useState(comment.text);
  
  // Format date - convert to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSave = () => {
    // Validate input
    if (!editedName.trim() || !editedText.trim()) {
      alert("Name and comment text cannot be empty");
      return;
    }
    
    onEdit(comment._id, {
      name: editedName,
      text: editedText
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setEditedName(comment.name);
    setEditedText(comment.text);
    setIsEditing(false);
  };

  return (
    <div className="comment">
      {isEditing ? (
        <div className="comment-edit-form">
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="Your name"
            className="comment-input"
          />
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            placeholder="Your comment"
            className="comment-textarea"
          ></textarea>
          <div className="comment-edit-actions">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="comment-header">
            <span className="comment-name">{comment.name}</span>
            <span className="comment-date">{formatDate(comment.date)}</span>
          </div>
          <div className="comment-text">{comment.text}</div>
          <div className="comment-actions">
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
            <button onClick={() => onDelete(comment._id)} className="delete-btn">Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Comment;