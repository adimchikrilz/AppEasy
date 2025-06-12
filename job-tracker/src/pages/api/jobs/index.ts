import { NextApiRequest, NextApiResponse } from 'next';
import { JobApplication, CreateJobRequest } from '../../../types';
import { readJobs, writeJobs, generateId } from '../../../utils/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const jobs = readJobs();
      return res.status(200).json(jobs);
    }

    if (req.method === 'POST') {
      const { jobTitle, companyName, applicationLink, status }: CreateJobRequest = req.body;

      // Validation
      if (!jobTitle || !companyName || !applicationLink || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const jobs = readJobs();
      const newJob: JobApplication = {
        id: generateId(),
        jobTitle,
        companyName,
        applicationLink,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      jobs.push(newJob);
      writeJobs(jobs);

      return res.status(201).json(newJob);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}