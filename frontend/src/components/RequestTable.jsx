import React from 'react';

const RequestTable = ({ requests, onApprove, onReject, showActions = false }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req._id}>
              <td>{req.user?.name || 'N/A'}</td>
              <td>{req.leaveType}</td>
              <td>{new Date(req.startDate).toLocaleDateString()}</td>
              <td>{new Date(req.endDate).toLocaleDateString()}</td>
              <td>{req.reason}</td>
              <td>
                <span className={`status-badge ${getStatusClass(req.status)}`}>
                  {req.status}
                </span>
              </td>
              {showActions && req.status === 'pending' && (
                <td>
                  <div className="action-buttons">
                    <button className="btn-approve" onClick={() => onApprove(req._id)}>Approve</button>
                    <button className="btn-reject" onClick={() => onReject(req._id)}>Reject</button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;