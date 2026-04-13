import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchPdfAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { jd_text, cv_url } = await req.json();

    if (!jd_text?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Job description text is required.' },
        { status: 400 }
      );
    }

    // Fetch the CV PDF from Supabase Storage
    const cvPdfBase64 = cv_url ? await fetchPdfAsBase64(cv_url) : null;
    const hasCv = !!cvPdfBase64;

    // Build the user message — include the CV PDF if available
    const userContent: Anthropic.MessageParam['content'] = hasCv
      ? [
          {
            type: 'text' as const,
            text: `Here is the job description:\n\n${jd_text}\n\nHere is the candidate's CV:`,
          },
          {
            type: 'document' as const,
            source: {
              type: 'base64' as const,
              media_type: 'application/pdf' as const,
              data: cvPdfBase64!,
            },
          },
        ]
      : `Here is the job description:\n\n${jd_text}`;

    const systemPrompt = hasCv
      ? `You are an expert recruiter. Analyze the candidate's CV against the job description and return ONLY valid JSON — no markdown, no explanation.

Use this exact shape:
{
  "job_title": "<job title from the JD>",
  "candidate_name": "<full name from the CV>",
  "match_score": <0-100, overall match>,
  "matching_criteria": {
    "experience": <0-100, how well their experience matches>,
    "skills": <0-100, how well their skills match the required skills>,
    "industry": <0-100, how relevant their industry background is>,
    "job_titles": <0-100, how closely their previous job titles match>
  },
  "interview_questions": [
    "<question 1 — based on gaps or strengths you identified>",
    "<question 2>",
    "<question 3>",
    "<question 4>",
    "<question 5>"
  ]
}

Rules:
- Score based on the actual CV content vs the JD requirements — be accurate, not generous.
- Extract the candidate's real full name from the CV.
- Interview questions must reference specific skills, roles, or gaps you found in the CV.`
      : `You are an expert recruiter. Analyze the job description and return ONLY valid JSON — no markdown, no explanation.

Use this exact shape:
{
  "job_title": "<extracted from JD>",
  "candidate_name": "Candidate",
  "match_score": <0-100, baseline for a strong candidate>,
  "matching_criteria": {
    "experience": <0-100>,
    "skills": <0-100>,
    "industry": <0-100>,
    "job_titles": <0-100>
  },
  "interview_questions": [
    "<question 1 — specific to this JD>",
    "<question 2>",
    "<question 3>",
    "<question 4>",
    "<question 5>"
  ]
}

Note: No CV was provided. Generate a baseline score for a strong candidate and JD-specific questions.`;

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    let parsed: {
      job_title: string;
      candidate_name: string;
      match_score: number;
      matching_criteria: {
        experience: number;
        skills: number;
        industry: number;
        job_titles: number;
      };
      interview_questions: string[];
    };

    try {
      // Strip markdown code fences Claude sometimes adds despite instructions
      const cleaned = textBlock.text
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error(`Claude returned invalid JSON: ${textBlock.text}`);
    }

    const matchPayload = {
      job_title: parsed.job_title ?? 'Untitled Position',
      candidate_name: parsed.candidate_name ?? 'Candidate',
      cv_url: cv_url || '',
      match_score: parsed.match_score,
      matching_criteria: parsed.matching_criteria,
      interview_questions: parsed.interview_questions,
    };

    const { data: savedMatch, error: dbError } = await supabase
      .from('matches')
      .insert(matchPayload)
      .select()
      .single();

    if (dbError) {
      console.error('[MatchPoint] DB save error:', dbError.message);
      return NextResponse.json({
        success: true,
        data: {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          ...matchPayload,
        },
      });
    }

    return NextResponse.json({ success: true, data: savedMatch });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[MatchPoint] API error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
