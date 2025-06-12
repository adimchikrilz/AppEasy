export interface JobApplication {
    id: string;
    jobTitle: string;
    companyName: string;
    applicationLink: string;
    status: JobStatus;
    createdAt: string;
    updatedAt: string;
  }
  
  export type JobStatus = 'Applied' | 'Interviewing' | 'Rejected' | 'Offer';
  
  export interface CreateJobRequest {
    jobTitle: string;
    companyName: string;
    applicationLink: string;
    status: JobStatus;
  }
  
  export interface UpdateJobRequest extends CreateJobRequest {
    id: string;
  }
  
  export interface JobAnalysis {
    summary: string;
    suggestedSkills: string[];
  }
  
  export interface AnalyzeJobRequest {
    jobDescription: string;
  }