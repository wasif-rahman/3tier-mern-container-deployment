const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://db:27017/quotesdb';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Quote Schema & Model
const QuoteSchema = new mongoose.Schema({
  quote: { type: String, required: true },
  author: { type: String, default: 'Anonymous' }
});

const Quote = mongoose.model('Quote', QuoteSchema);

// Routes
// GET all quotes
app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await Quote.find();
    // Map to simple shape if needed, but Mongoose object includes id, quote, author
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quotes from database.' });
  }
});

// POST a new quote
app.post('/api/quotes', async (req, res) => {
  const { quote, author } = req.body;
  if (!quote) {
    return res.status(400).json({ error: 'Quote content is required.' });
  }
  try {
    const newQuote = new Quote({ quote, author: author || 'Anonymous' });
    const savedQuote = await newQuote.save();
    res.status(201).json(savedQuote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save quote.' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
});
