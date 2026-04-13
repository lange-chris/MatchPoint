export interface MatchCriteria {
  experience: number;
  skills: number;
  industry: number;
  job_titles: number;
}

export interface Match {
  id: string;
  created_at: string;
  job_title: string;
  candidate_name: string;
  cv_url: string;
  match_score: number;
  matching_criteria: MatchCriteria;
  interview_questions: string[];
}

export type NewMatchRequest = {
  jd_text: string;
  cv_text: string;
  cv_url: string;
};
