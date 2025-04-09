import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import './TreeDetail.css';

const TreeDetail = () => {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  
  const { rfidId } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/trees/${rfidId}`);
        setTree(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching tree data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchTree();
  }, [rfidId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this tree?')) {
      try {
        setDeleting(true);
        await axios.delete(`http://localhost:5000/api/trees/${rfidId}`);
        setDeleting(false);
        history.push('/');
      } catch (err) {
        setError('Error deleting tree');
        setDeleting(false);
        console.error(err);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Alive':
        return 'status-alive';
      case 'At Risk':
        return 'status-at-risk';
      case 'Dead':
        return 'status-dead';
      default:
        return '';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!tree) return <div className="not-found">Tree not found</div>;

  return (
    <div className="tree-detail">
      <div className="tree-detail-header">
        <h1>Tree Details</h1>
        <div className="tree-detail-actions">
          <Link to="/" className="btn btn-secondary">
            Back to Dashboard
          </Link>
          <Link to={`/trees/${rfidId}/edit`} className="btn btn-primary">
            Edit Tree
          </Link>
          <button 
            className="btn btn-danger" 
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Tree'}
          </button>
        </div>
      </div>

      <div className="tree-info-card">
        <div className="tree-info-header">
          <h2>{tree.species}</h2>
          <span className={`status-badge ${getStatusClass(tree.status)}`}>
            {tree.status}
          </span>
        </div>

        <div className="tree-info-body">
          <div className="info-group">
            <h3>RFID ID</h3>
            <p>{tree.rfidId}</p>
          </div>

          <div className="info-group">
            <h3>Location</h3>
            <p>{tree.location}</p>
          </div>

          <div className="info-group">
            <h3>Plantation Date</h3>
            <p>{formatDate(tree.plantationDate)}</p>
          </div>

          <div className="info-group">
            <h3>CO₂ Absorption</h3>
            <p>{tree.co2Absorption?.toFixed(2)} kg</p>
          </div>

          <div className="info-group">
            <h3>Last Updated</h3>
            <p>{formatDate(tree.lastUpdated)}</p>
          </div>

          {tree.notes && (
            <div className="info-group notes">
              <h3>Notes</h3>
              <p>{tree.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreeDetail;