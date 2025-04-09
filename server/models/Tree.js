const mongoose = require('mongoose');

const TreeSchema = new mongoose.Schema({
  rfidId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  species: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  plantationDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Alive', 'Dead', 'At Risk'],
    default: 'Alive'
  },
  notes: {
    type: String,
    trim: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Calculate CO2 absorption (21kg per year for each tree)
TreeSchema.methods.calculateCO2Absorption = function() {
  const now = new Date();
  const plantationDate = this.plantationDate;
  
  // Calculate years (including partial years)
  const ageInMilliseconds = now - plantationDate;
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  
  // If the tree is dead, it absorbs CO2 until it died (assume last updated is when it died)
  if (this.status === 'Dead') {
    const deathDate = this.lastUpdated;
    const lifeInMilliseconds = deathDate - plantationDate;
    const lifeInYears = lifeInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, lifeInYears * 21); // 21kg per year
  }
  
  return Math.max(0, ageInYears * 21); // 21kg per year
};

// Virtual property for CO2 absorption
TreeSchema.virtual('co2Absorption').get(function() {
  return this.calculateCO2Absorption();
});

// Ensure virtual fields are included when converting to JSON
TreeSchema.set('toJSON', { virtuals: true });
TreeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Tree', TreeSchema);