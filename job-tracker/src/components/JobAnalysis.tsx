import React, { useState } from 'react';
import { JobAnalysis } from '../types';
import './JobAnalysis.css';

interface JobAnalysisProps {
  onAnalyze: (jobDescription: string) => Promise<JobAnalysis>;
}

const JobAnalysisComponent: React.FC<JobAnalysisProps> = ({ onAnalyze }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await onAnalyze(jobDescription);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze job description. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setJobDescription('');
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="job-analysis-container">
      <div className="job-analysis-header">
        <div className="job-analysis-icon-container">
          <svg
            className="job-analysis-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <div>
          <h2 className="job-analysis-title">AI Job Analysis</h2>
          <p className="job-analysis-subtitle">
            Paste a job description to get insights and skill recommendations
          </p>
        </div>
      </div>

      <div className="job-analysis-form">
        <div className="job-analysis-input-group">
          <label htmlFor="jobDescription" className="job-analysis-label">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              setError(null);
            }}
            className="job-analysis-textarea"
            rows={8}
            placeholder="Paste the job description here..."
          />
          {error && (
            <p className="job-analysis-error">{error}</p>
          )}
        </div>

        <div className="job-analysis-button-group">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !jobDescription.trim()}
            className="job-analysis-btn-primary"
          >
            {isLoading ? (
              <>
                <svg className="job-analysis-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="job-analysis-spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="job-analysis-spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Analyze Job'
            )}
          </button>
          
          {(jobDescription || analysis) && (
            <button
              onClick={handleClear}
              className="job-analysis-btn-secondary"
            >
              Clear
            </button>
          )}
        </div>

        {analysis && (
          <div className="job-analysis-results">
            <h3 className="job-analysis-results-title">
              Analysis Results
            </h3>
            
            <div className="job-analysis-results-content">
              <div className="job-analysis-section">
                <h4 className="job-analysis-section-title">
                  Job Summary
                </h4>
                <p className="job-analysis-summary">
                  {analysis.summary}
                </p>
              </div>

              <div className="job-analysis-section">
                <h4 className="job-analysis-section-title">
                  Recommended Skills to Highlight
                </h4>
                <ul className="job-analysis-skills-list">
                  {analysis.suggestedSkills.map((skill, index) => (
                    <li key={index} className="job-analysis-skill-item">
                      <span className="job-analysis-skill-bullet"></span>
                      <span className="job-analysis-skill-text">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="job-analysis-tip">
              <p className="job-analysis-tip-text">
                💡 <strong>Tip:</strong> Use these insights to tailor your resume and cover letter for this specific role.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobAnalysisComponent;