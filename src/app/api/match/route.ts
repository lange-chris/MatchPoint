import { NextResponse } from 'next/server';
import { Match } from '@/types';

export async function POST(req: Request) {
  try {
    const { jd_text, cv_text, cv_url } = await req.json();

    // TO Engineer A:
    // This is the High-Efficiency Mock Response.
    // Replace this logic with your real AI heuristic and Supabase save logic.
    
    const mockMatch: Match = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      job_title: "Senior Frontend Engineer",
      candidate_name: "Mock Candidate",
      cv_url: cv_url || "https://example.com/cv.pdf",
      match_score: 85,
      matching_criteria: {
        experience: 90,
        skills: 80,
        industry: 75,
        job_titles: 95
      },
      interview_questions: [
        "How would you optimize a high-traffic Next.js application?",
        "Explain your experience with Framer Motion and complex animations.",
        "How do you handle state management across large-scale projects?",
        "What is your approach to ensuring accessibility in a Tailwind project?",
        "Describe a time you had to resolve a complex merge conflict in a multi-agent team."
      ]
    };

    return NextResponse.json({
      success: true,
      data: mockMatch
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
