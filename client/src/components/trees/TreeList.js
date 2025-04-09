import React from 'react';
import { Link } from 'react-router-dom';
import './TreeList.css';

const TreeList = ({ trees }) => {
  if (trees.length === 0) {
    return <div className="no-trees">No trees found</div>;
  }

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="tree-list">
      <h2>Registered Trees</h2>
      <table className="tree-table">
        <thead>
          <tr>
            <th>RFID ID</th>
            <th>Species</th>
            <th>Location</th>
            <th>Planted</th>
            <th>Status</th>
            <th>CO₂ Absorbed</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trees.map((tree) => (
            <tr key={tree.rfidId}>
              <td>{tree.rfidId}</td>
              <td>{tree.species}</td>
              <td>{tree.location}</td>
              <td>{formatDate(tree.plantationDate)}</td>
              <td>
                <span className={`status-badge ${getStatusClass(tree.status)}`}>
                  {tree.status}
                </span>
              </td>
              <td>{tree.co2Absorption?.toFixed(2)} kg</td>
              <td>{formatDate(tree.lastUpdated)}</td>
              <td>
                <Link to={`/trees/${tree.rfidId}`} className="btn btn-sm btn-info">
                  View
                </Link>
                <Link to={`/trees/${tree.rfidId}/edit`} className="btn btn-sm btn-primary">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TreeList;