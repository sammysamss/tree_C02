const mongoose = require('mongoose');
const Tree = require('./models/Tree');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tree-tracking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected for seeding'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Sample data
const sampleTrees = [
  {
    rfidId: 'RFID-001-2023',
    species: 'Oak',
    location: 'North Park, Section A',
    plantationDate: new Date('2023-01-15'),
    status: 'Alive',
    notes: 'Healthy growth observed',
    lastUpdated: new Date()
  },
  {
    rfidId: 'RFID-002-2023',
    species: 'Maple',
    location: 'North Park, Section B',
    plantationDate: new Date('2023-02-20'),
    status: 'Alive',
    notes: 'Requires additional watering during summer',
    lastUpdated: new Date()
  },
  {
    rfidId: 'RFID-003-2022',
    species: 'Pine',
    location: 'South Hills, Area 1',
    plantationDate: new Date('2022-11-10'),
    status: 'At Risk',
    notes: 'Signs of pest infestation',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200) // 200 days ago
  },
  {
    rfidId: 'RFID-004-2022',
    species: 'Birch',
    location: 'East Gardens, Plot 7',
    plantationDate: new Date('2022-06-05'),
    status: 'Dead',
    notes: 'Did not survive severe drought',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90) // 90 days ago
  },
  {
    rfidId: 'RFID-005-2021',
    species: 'Redwood',
    location: 'Central Reserve, Zone C',
    plantationDate: new Date('2021-12-12'),
    status: 'Alive',
    notes: 'Growing well, exceptional height for age',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) // 30 days ago
  },
  {
    rfidId: 'RFID-006-2023',
    species: 'Cedar',
    location: 'Mountain Range, Area 4',
    plantationDate: new Date('2023-03-17'),
    status: 'Alive',
    notes: 'Protected area, minimal human intervention',
    lastUpdated: new Date()
  },
  {
    rfidId: 'RFID-007-2022',
    species: 'Willow',
    location: 'Riverside Path, Section D',
    plantationDate: new Date('2022-09-28'),
    status: 'Alive',
    notes: 'Perfect location near water source',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45) // 45 days ago
  },
  {
    rfidId: 'RFID-008-2021',
    species: 'Elm',
    location: 'Urban Center, Block 3',
    plantationDate: new Date('2021-05-20'),
    status: 'At Risk',
    notes: 'Showing signs of urban stress, pollution effects',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 210) // 210 days ago
  }
];

// Seed the database
const seedDB = async () => {
  try {
    // Clear existing data
    await Tree.deleteMany({});
    console.log('Cleared existing tree data');
    
    // Insert sample trees
    await Tree.insertMany(sampleTrees);
    console.log('Sample trees added successfully');
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Database seeding complete');
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.disconnect();
  }
};

// Run the seed function
seedDB();