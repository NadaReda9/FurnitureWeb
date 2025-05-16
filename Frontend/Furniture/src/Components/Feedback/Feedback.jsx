import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Feedback.css';

const FeedbackForm = () => {
  const [rate, setRate] = useState(1);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [allReviews, setAllReviews] = useState([]);
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/feedback');
        setAllReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setMessage('Failed to load feedbacks.');
      }
    };

    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!name) {
        setMessage('Please enter your name');
        return;
      }else {
        await axios.post('http://localhost:8000/api/feedback', { 
          rate, 
          comment,
          name 
        });
        setMessage('Feedback submitted successfully!');
      }

      const response = await axios.get('http://localhost:8000/api/feedback');
      setAllReviews(response.data);
      setRate(1);
      setComment('');
      setName('');
      setEditId(null);
    } catch (error) {
      console.error('Error submitting or updating feedback:', error);
      setMessage('Failed to submit or update feedback. Please try again.');
    }
  };

  const handleEdit = (id, currentComment, currentRate, currentName) => {
    setEditId(id);
    setComment(currentComment);
    setRate(currentRate);
    setName(currentName);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/feedback/delete/${id}`);
      const response = await axios.get('http://localhost:8000/api/feedback');
      setAllReviews(response.data);
      setMessage('Feedback deleted successfully!');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      setMessage('Failed to delete feedback. Please try again.');
    }
  };

  return (
    <div className="feedback-container main_color2">
      {/* Form Section */}
      <div className="feedback-form-section">
        <h2 className="feedback-title">{editId ? 'Edit Your Feedback' : 'Share Your Feedback'}</h2>
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Rating (1-5)</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${rate >= star ? 'filled' : ''}`}
                  onClick={() => setRate(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Feedback</label>
            <textarea
              className="form-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              placeholder="Share your thoughts..."
              rows="4"
            />
          </div>

          <button type="submit" className="submit-btn">
            {editId ? 'Update Feedback' : 'Submit Feedback'}
          </button>

          {message && (
            <div className={`feedback-message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Reviews Section */}
      <div className="feedback-reviews-section">
        <h2 className="reviews-title">Customer Feedback</h2>
        
        {allReviews.length === 0 ? (
          <div className="empty-reviews">
            <p>No feedback yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {allReviews.map((rev) => (
              <div key={rev._id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <span className="reviewer-name">{rev.name}</span>
                    <div className="rating-display">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star} 
                          className={star <= rev.rate ? 'filled' : 'empty'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="review-actions">
                    <button 
                      onClick={() => handleDelete(rev._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="review-content">
                  <p>{rev.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;