const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();

// GET all feedbacks
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Error fetching feedbacks' });
  }
});

// POST new feedback (تم إضافة name هنا)
router.post('/', async (req, res) => {
  try {
    const { name, rate, comment } = req.body;

    // تأكد من إرسال البيانات المطلوبة
    if (!name || !rate || !comment) {
      return res.status(400).json({ message: 'name, rate, and comment are required' });
    }

    const newFeedback = new Feedback({ name, rate, comment });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ message: 'Error adding feedback' });
  }
});

// DELETE feedback by ID
router.delete("/delete/:id", async (req, res)  => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting feedback" });
  }
});

module.exports = router;






