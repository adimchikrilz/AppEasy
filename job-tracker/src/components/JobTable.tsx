import React from 'react';
import { JobApplication } from '../types';
import './JobTable.css';

interface JobTableProps {
  jobs: JobApplication[];
  onEdit: (job: JobApplication) => void;
  onDelete: (jobId: string) => void;
  isLoading?: boolean;
}

const JobTable: React.FC<JobTableProps> = ({ jobs, onEdit, onDelete, isLoading = false }) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'status-badge status-applied';
      case 'Interviewing':
        return 'status-badge status-interviewing';
      case 'Offer':
        return 'status-badge status-offer';
      case 'Rejected':
        return 'status-badge status-rejected';
      default:
        return 'status-badge status-default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-pulse">
          <div className="loading-title"></div>
          <div className="loading-rows">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="loading-row"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="empty-container">
        <div className="empty-content">
          <svg
            className="empty-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="empty-title">No job applications yet</h3>
          <p className="empty-description">Get started by adding your first job application above.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">
          Job Applications ({jobs.length})
        </h2>
      </div>
      
      <div className="table-wrapper">
        <table className="table">
          <thead className="table-head">
            <tr className="table-head-row">
              <th className="table-head-cell">
                Job Title
              </th>
              <th className="table-head-cell">
                Company
              </th>
              <th className="table-head-cell">
                Status
              </th>
              <th className="table-head-cell">
                Applied
              </th>
              <th className="table-head-cell">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="table-body">
            {jobs.map((job) => (
              <tr key={job.id} className="table-body-row">
                <td className="table-cell">
                  <div className="job-title-container">
                    <div className="job-title">
                      {job.jobTitle}
                    </div>
                    <div>
                      <a
                        href={job.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="application-link"
                      >
                        View Application
                      </a>
                    </div>
                  </div>
                </td>
                <td className="table-cell company-name">
                  {job.companyName}
                </td>
                <td className="table-cell">
                  <span className={getStatusClass(job.status)}>
                    {job.status}
                  </span>
                </td>
                <td className="table-cell date-text">
                  {formatDate(job.createdAt)}
                </td>
                <td className="table-cell">
                  <div className="actions-container">
                    <button
                      onClick={() => onEdit(job)}
                      className="action-button edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(job.id)}
                      className="action-button delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobTable;