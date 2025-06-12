import { NextApiRequest, NextApiResponse } from 'next';
import { JobApplication, UpdateJobRequest } from '../../../types';
import { readJobs, writeJobs } from '../../../utils/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    const jobs = readJobs();
    const jobIndex = jobs.findIndex(job => job.id === id);

    if (jobIndex === -1) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (req.method === 'PUT') {
      const { jobTitle, companyName, applicationLink, status }: UpdateJobRequest = req.body;

      // Validation
      if (!jobTitle || !companyName || !applicationLink || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const updatedJob: JobApplication = {
        ...jobs[jobIndex],
        jobTitle,
        companyName,
        applicationLink,
        status,
        updatedAt: new Date().toISOString(),
      };

      jobs[jobIndex] = updatedJob;
      writeJobs(jobs);

      return res.status(200).json(updatedJob);
    }

    if (req.method === 'DELETE') {
      const deletedJob = jobs[jobIndex];
      jobs.splice(jobIndex, 1);
      writeJobs(jobs);

      return res.status(200).json(deletedJob);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}