import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.origin.includes('5002') 
    ? window.location.origin.replace('5002', '5001') 
    : 'http://localhost:5001');

function App() {
  const [quotes, setQuotes] = useState([]);
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/quotes`);
      if (!res.ok) throw new Error('API server returned error');
      const data = await res.json();
      // Reverse list to show newest quotes first
      setQuotes(data.reverse());
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch quotes. Is the API server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quote.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/api/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote, author: author.trim() || 'Anonymous' })
      });
      
      if (!res.ok) throw new Error('Failed to submit quote');
      const newQuote = await res.json();
      
      setQuotes((prev) => [newQuote, ...prev]);
      setQuote('');
      setAuthor('');
    } catch (err) {
      console.error(err);
      alert('Failed to save quote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <span className="badge">3-Tier MERN Stack</span>
        <h1>Quotes Gallery</h1>
        <p className="subtitle">Manual to Containerized Deployment Showcase</p>
      </header>

      <div className="grid">
        <div className="glass-panel form-panel">
          <h2 className="form-title">Add a New Quote</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="quote">Quote Text</label>
              <textarea
                id="quote"
                placeholder="Enter an inspirational quote..."
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="author">Author</label>
              <input
                id="author"
                type="text"
                placeholder="Author Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Submit Quote'}
            </button>
          </form>
        </div>

        <div className="quotes-section">
          {error && <div className="glass-panel empty-state" style={{color: '#f87171'}}>{error}</div>}
          {loading ? (
            <div className="loading-spinner"></div>
          ) : quotes.length === 0 ? (
            <div className="glass-panel empty-state">
              No quotes found. Start by adding one on the left!
            </div>
          ) : (
            <div className="quotes-display">
              {quotes.map((q, idx) => (
                <div key={q._id || q.id || idx} className="glass-panel quote-card">
                  <p className="quote-text">"{q.quote}"</p>
                  <span className="quote-author">{q.author || 'Anonymous'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
