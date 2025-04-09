import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TreeList from './components/trees/TreeList';
import StatCard from './components/layout/StatCard';
import './Dashboard.css';

const Dashboard = () => {
  const [trees, setTrees] = useState([]);
  const [stats, setStats] = useState({
    totalTrees: 0,
    totalCO2Absorbed: 0,
    statusCounts: { Alive: 0, 'At Risk': 0, Dead: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/trees');
        setTrees(res.data.trees);
        setStats(res.data.stats);
        setLoading(false);
      } catch (err) {
        setError('Error fetching tree data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchTrees();
  }, []);

  const filteredTrees = trees.filter(tree => 
    tree.rfidId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tree.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tree.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Tree Tracking Dashboard</h1>
        <Link to="/add-tree" className="btn btn-primary">
          Add New Tree
        </Link>
      </div>

      <div className="stats-container">
        <StatCard 
          title="Total Trees" 
          value={stats.totalTrees} 
          icon="tree" 
        />
        <StatCard 
          title="CO₂ Absorbed" 
          value={`${stats.totalCO2Absorbed.toFixed(2)} kg`} 
          icon="cloud" 
        />
        <StatCard 
          title="Alive Trees" 
          value={stats.statusCounts.Alive} 
          icon="check-circle" 
          color="green" 
        />
        <StatCard 
          title="At Risk Trees" 
          value={stats.statusCounts['At Risk']} 
          icon="exclamation-triangle" 
          color="orange" 
        />
        <StatCard 
          title="Dead Trees" 
          value={stats.statusCounts.Dead} 
          icon="times-circle" 
          color="red" 
        />
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by RFID, species or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <TreeList trees={filteredTrees} />
    </div>
  );
};

export default Dashboard;