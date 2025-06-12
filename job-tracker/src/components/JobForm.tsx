import React, { useState } from 'react';
import { JobApplication, JobStatus, CreateJobRequest } from '../types';
import styles from '../styles/JobForm.module.css';

interface JobFormProps {
  onSubmit: (job: CreateJobRequest) => void;
  onCancel?: () => void;
  initialData?: JobApplication;
  isEditing?: boolean;
  isLoading?: boolean;
}

const JobForm: React.FC<JobFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isEditing = false,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<CreateJobRequest>({
    jobTitle: initialData?.jobTitle || '',
    companyName: initialData?.companyName || '',
    applicationLink: initialData?.applicationLink || '',
    status: initialData?.status || 'Applied',
  });

  const [errors, setErrors] = useState<Partial<CreateJobRequest>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateJobRequest> = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.applicationLink.trim()) {
      newErrors.applicationLink = 'Application link is required';
    } else if (!isValidUrl(formData.applicationLink)) {
      newErrors.applicationLink = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof CreateJobRequest]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const getInputClass = (fieldName: keyof CreateJobRequest) => {
    return errors[fieldName] 
      ? `${styles.input} ${styles.inputError}` 
      : styles.input;
  };

  const statusOptions: JobStatus[] = ['Applied', 'Interviewing', 'Rejected', 'Offer'];

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        {isEditing ? 'Edit Job Application' : 'Add New Job Application'}
      </h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="jobTitle" className={styles.label}>
            Job Title *
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            className={getInputClass('jobTitle')}
            placeholder="e.g., Software Engineer Intern"
          />
          {errors.jobTitle && (
            <p className={styles.errorMessage}>{errors.jobTitle}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="companyName" className={styles.label}>
            Company Name *
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className={getInputClass('companyName')}
            placeholder="e.g., AppEasy"
          />
          {errors.companyName && (
            <p className={styles.errorMessage}>{errors.companyName}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="applicationLink" className={styles.label}>
            Application Link *
          </label>
          <input
            type="url"
            id="applicationLink"
            name="applicationLink"
            value={formData.applicationLink}
            onChange={handleInputChange}
            className={getInputClass('applicationLink')}
            placeholder="https://example.com/job-application"
          />
          {errors.applicationLink && (
            <p className={styles.errorMessage}>{errors.applicationLink}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status" className={styles.label}>
            Status *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className={styles.select}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.buttonContainer}>
          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Update Job' : 'Add Job')}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default JobForm;