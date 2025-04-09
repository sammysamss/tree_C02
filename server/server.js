const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const Tree = require('./models/Tree');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tree-tracking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Import routes
const treeRoutes = require('./routes/trees');

// Use routes
app.use('/api/trees', treeRoutes);

// Schedule a task to run daily at midnight to check for "At Risk" trees
cron.schedule('0 0 * * *', async () => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    await Tree.updateMany(
      { 
        lastUpdated: { $lt: sixMonthsAgo },
        status: 'Alive'
      },
      { $set: { status: 'At Risk' } }
    );
    
    console.log('Auto-updated at-risk trees');
  } catch (err) {
    console.error('Error updating at-risk trees:', err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});