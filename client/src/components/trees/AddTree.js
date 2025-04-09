import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './TreeForm.css';

const AddTree = () => {
  const [formData, setFormData] = useState({
    rfidId: '',
    species: '',
    location: '',
    plantationDate: '',
    status: 'Alive',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const history = useHistory();

  const { rfidId, species, location, plantationDate, status, notes } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!rfidId || !species || !location || !plantationDate) {
      setError('Please complete all required fields');
      return;
    }
    
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/trees', formData);
      setLoading(false);
      history.push('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding tree');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="tree-form-container">
      <h1>Add New Tree</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={onSubmit} className="tree-form">
        <div className="form-group">
          <label htmlFor="rfidId">RFID ID*</label>
          <input
            type="text"
            name="rfidId"
            id="rfidId"
            value={rfidId}
            onChange={onChange}
            required
            placeholder="Enter RFID ID (e.g., RFID-123-2023)"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="species">Species*</label>
          <input
            type="text"
            name="species"
            id="species"
            value={species}
            onChange={onChange}
            required
            placeholder="Enter tree species"
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
            placeholder="Enter planting location"
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
          <label htmlFor="status">Status</label>
          <select
            name="status"
            id="status"
            value={status}
            onChange={onChange}
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
            onClick={() => history.push('/')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Tree'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTree;