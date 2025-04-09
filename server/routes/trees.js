const express = require('express');
const router = express.Router();
const Tree = require('../models/Tree');

// @route   GET api/trees
// @desc    Get all trees
// @access  Public
router.get('/', async (req, res) => {
  try {
    const trees = await Tree.find().sort({ plantationDate: -1 });
    
    // Calculate total CO2 absorption for all trees
    const totalCO2 = trees.reduce((total, tree) => total + tree.calculateCO2Absorption(), 0);
    
    // Count trees by status
    const statusCounts = {
      Alive: trees.filter(tree => tree.status === 'Alive').length,
      'At Risk': trees.filter(tree => tree.status === 'At Risk').length,
      Dead: trees.filter(tree => tree.status === 'Dead').length
    };
    
    res.json({
      trees,
      stats: {
        totalTrees: trees.length,
        totalCO2Absorbed: totalCO2,
        statusCounts
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/trees/:rfidId
// @desc    Get tree by RFID ID
// @access  Public
router.get('/:rfidId', async (req, res) => {
  try {
    const tree = await Tree.findOne({ rfidId: req.params.rfidId });
    
    if (!tree) {
      return res.status(404).json({ msg: 'Tree not found' });
    }
    
    res.json(tree);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/trees
// @desc    Add a new tree
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { rfidId, species, location, plantationDate, status, notes } = req.body;
    
    // Check if tree with this RFID already exists
    let tree = await Tree.findOne({ rfidId });
    
    if (tree) {
      return res.status(400).json({ msg: 'Tree with this RFID already exists' });
    }
    
    // Create new tree
    tree = new Tree({
      rfidId,
      species,
      location,
      plantationDate,
      status: status || 'Alive',
      notes,
      lastUpdated: Date.now()
    });
    
    await tree.save();
    res.json(tree);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/trees/:rfidId
// @desc    Update a tree
// @access  Public
router.put('/:rfidId', async (req, res) => {
  try {
    const { species, location, plantationDate, status, notes } = req.body;
    
    // Find tree by RFID
    let tree = await Tree.findOne({ rfidId: req.params.rfidId });
    
    if (!tree) {
      return res.status(404).json({ msg: 'Tree not found' });
    }
    
    // Update fields if provided
    if (species) tree.species = species;
    if (location) tree.location = location;
    if (plantationDate) tree.plantationDate = plantationDate;
    if (status) tree.status = status;
    if (notes !== undefined) tree.notes = notes;
    
    // Always update the lastUpdated timestamp when updating a tree
    tree.lastUpdated = Date.now();
    
    await tree.save();
    res.json(tree);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/trees/:rfidId
// @desc    Delete a tree
// @access  Public
router.delete('/:rfidId', async (req, res) => {
  try {
    const tree = await Tree.findOne({ rfidId: req.params.rfidId });
    
    if (!tree) {
      return res.status(404).json({ msg: 'Tree not found' });
    }
    
    await tree.remove();
    res.json({ msg: 'Tree removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/trees/stats/summary
// @desc    Get tree statistics
// @access  Public
router.get('/stats/summary', async (req, res) => {
  try {
    const trees = await Tree.find();
    
    // Calculate total CO2 absorption
    const totalCO2 = trees.reduce((total, tree) => total + tree.calculateCO2Absorption(), 0);
    
    // Count trees by status
    const statusCounts = {
      Alive: trees.filter(tree => tree.status === 'Alive').length,
      'At Risk': trees.filter(tree => tree.status === 'At Risk').length,
      Dead: trees.filter(tree => tree.status === 'Dead').length
    };
    
    res.json({
      totalTrees: trees.length,
      totalCO2Absorbed: totalCO2,
      statusCounts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;