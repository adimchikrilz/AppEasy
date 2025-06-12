import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import JobForm from '../components/JobForm';
import JobTable from '../components/JobTable';
import JobAnalysisComponent from '../components/JobAnalysis';
import { JobApplication, CreateJobRequest, JobAnalysis } from '../types';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tracker' | 'analysis'>('tracker');

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsTableLoading(true);
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const jobsData: JobApplication[] = await response.json();
        setJobs(jobsData);
      } else {
        console.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsTableLoading(false);
    }
  };

  const handleAddJob = async (jobData: CreateJobRequest) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        const newJob: JobApplication = await response.json();
        setJobs(prev => [...prev, newJob]);
      } else {
        console.error('Failed to add job');
      }
    } catch (error) {
      console.error('Error adding job:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateJob = async (jobData: CreateJobRequest) => {
    if (!editingJob) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/jobs/${editingJob.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        const updatedJob: JobApplication = await response.json();
        setJobs(prev => prev.map(job => 
          job.id === editingJob.id ? updatedJob : job
        ));
        setEditingJob(null);
      } else {
        console.error('Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job application?')) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setJobs(prev => prev.filter(job => job.id !== jobId));
      } else {
        console.error('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleEditJob = (job: JobApplication) => {
    setEditingJob(job);
  };

  const handleCancelEdit = () => {
    setEditingJob(null);
  };

  const handleAnalyzeJob = async (jobDescription: string): Promise<JobAnalysis> => {
    const response = await fetch('/api/analyze-job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobDescription }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze job description');
    }

    return response.json();
  };

  const getTabButtonClass = (tab: 'tracker' | 'analysis') => {
    const baseClass = styles.tabButton;
    if (activeTab === tab) {
      return `${baseClass} ${tab === 'tracker' ? styles.tabButtonActiveTracker : styles.tabButtonActiveAnalysis}`;
    }
    return `${baseClass} ${styles.tabButtonInactive}`;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Mini Job Tracker - AppEasy Assessment</title>
        <meta name="description" content="Track your job applications with AI-powered insights" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.mainContent}>
        {/* Header */}
        <div className={styles.header}>
          <h1>Mini Job Tracker</h1>
          <p>Track your job applications and get AI-powered insights</p>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          <div className={styles.tabContainer}>
            <button
              onClick={() => setActiveTab('tracker')}
              className={getTabButtonClass('tracker')}
            >
              Job Tracker
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={getTabButtonClass('analysis')}
            >
              AI Analysis
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'tracker' ? (
          <div className={styles.contentSection}>
            {/* Job Form */}
            <JobForm
              onSubmit={editingJob ? handleUpdateJob : handleAddJob}
              onCancel={editingJob ? handleCancelEdit : undefined}
              initialData={editingJob || undefined}
              isEditing={!!editingJob}
              isLoading={isLoading}
            />

            {/* Job Table */}
            <JobTable
              jobs={jobs}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
              isLoading={isTableLoading}
            />
          </div>
        ) : (
          <div className={styles.analysisContainer}>
            <JobAnalysisComponent onAnalyze={handleAnalyzeJob} />
          </div>
        )}

        {/* Footer */}
        <footer className={styles.footer}>
          <p>Built for AppEasy Technical Assessment</p>
          <p>
            Features: Next.js • TypeScript • Regular CSS • OpenAI Integration
          </p>
        </footer>
      </main>
    </div>
  );
};