import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import './TreeForm.css';

const EditTree = () => {
  const [formData, setFormData] = useState({
    species: '',
    location: '',
    plantationDate: '',
    status: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { rfidId } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/trees/${rfidId}`);
        
        // Format the date for the date input
        const plantDate = new Date(res.data.plantationDate);
        const formattedDate = plantDate.toISOString().split('T')[0];
        
        setFormData({
          species: res.data.species,
          location: res.data.location,
          plantationDate: formattedDate,
          status: res.data.status,
          notes: res.data.notes || ''
        });
        setLoading(false);
      } catch (err) {
        setError('Error fetching tree data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchTree();
  }, [rfidId]);

  const { species, location, plantationDate, status, notes } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!species || !location || !plantationDate || !status) {
      setError('Please complete all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      await axios.put(`http://localhost:5000/api/trees/${rfidId}`, formData);
      setSubmitting(false);
      history.push(`/trees/${rfidId}`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error updating tree');
      setSubmitting(false);
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="tree-form-container">
      <h1>Edit Tree: {rfidId}</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={onSubmit} className="tree-form">
        <div className="form-group">
          <label htmlFor="species">Species*</label>
          <input
            type="text"
            name="species"
            id="species"
            value={species}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location*</label>
          <input
            type="text"
            name="location"
            id="location"
            value={location}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="plantationDate">Plantation Date*</label>
          <input
            type="date"
            name="plantationDate"
            id="plantationDate"
            value={plantationDate}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status*</label>
          <select
            name="status"
            id="status"
            value={status}
            onChange={onChange}
            required
          >
            <option value="Alive">Alive</option>
            <option value="At Risk">At Risk</option>
            <option value="Dead">Dead</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            name="notes"
            id="notes"
            value={notes}
            onChange={onChange}
            placeholder="Optional notes about this tree"
            rows="4"
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => history.push(`/trees/${rfidId}`)}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update Tree'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTree;