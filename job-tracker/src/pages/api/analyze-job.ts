import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { JobAnalysis, AnalyzeJobRequest } from '../../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { jobDescription }: AnalyzeJobRequest = req.body;

    if (!jobDescription || jobDescription.trim().length === 0) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      // Fallback response when API key is not available
      const mockAnalysis: JobAnalysis = {
        summary: "Job analysis unavailable - OpenAI API key not configured. This would typically provide a concise summary of the role, responsibilities, and requirements.",
        suggestedSkills: [
          "Technical skills relevant to the role",
          "Communication and teamwork abilities", 
          "Problem-solving and analytical thinking"
        ]
      };
      return res.status(200).json(mockAnalysis);
    }

    const prompt = `Analyze the following job description and provide:
1. A brief summary (2-3 sentences)
2. Top 3 skills a candidate should highlight on their resume

Job Description:
${jobDescription}

Please respond in JSON format with "summary" and "suggestedSkills" fields.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes job descriptions. Always respond with valid JSON containing 'summary' (string) and 'suggestedSkills' (array of 3 strings)."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    try {
      const analysis: JobAnalysis = JSON.parse(responseContent);
      return res.status(200).json(analysis);
    } catch {
      // Fallback if JSON parsing fails
      const fallbackAnalysis: JobAnalysis = {
        summary: "Unable to parse AI response. The job description analysis feature requires valid OpenAI integration.",
        suggestedSkills: [
          "Relevant technical skills",
          "Communication abilities",
          "Problem-solving skills"
        ]
      };
      return res.status(200).json(fallbackAnalysis);
    }

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Provide a helpful fallback response
    const fallbackAnalysis: JobAnalysis = {
      summary: "AI analysis temporarily unavailable. Please try again later or review the job description manually.",
      suggestedSkills: [
        "Core technical requirements from the job posting",
        "Soft skills mentioned in the description",
        "Industry-specific expertise"
      ]
    };
    
    return res.status(200).json(fallbackAnalysis);
  }
}