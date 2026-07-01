export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type OutputType = "portfolio_description" | "resume_bullets" | "interview_qa";

export type SourceType = "manual_note" | string;

export type ProjectRecord = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  summary: string | null;
  period_start: string | null;
  period_end: string | null;
  role: string | null;
  company_or_context: string | null;
  tech_stack: string[];
  problem: string | null;
  solution: string | null;
  result: string | null;
  contribution: string | null;
  links: Json;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectSourceRecord = {
  id: string;
  user_id: string;
  project_id: string;
  source_type: SourceType;
  title: string | null;
  content: string;
  metadata: Json;
  created_at: string;
  updated_at: string;
};

export type GeneratedOutputRecord = {
  id: string;
  user_id: string;
  project_id: string;
  output_type: OutputType;
  title: string;
  content_markdown: string;
  input_snapshot: Json;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
};

export type ResumeBulletRecord = {
  id: string;
  user_id: string;
  project_id: string | null;
  generated_output_id: string | null;
  content: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type InterviewQuestionRecord = {
  id: string;
  user_id: string;
  project_id: string | null;
  generated_output_id: string | null;
  question: string;
  answer: string;
  display_order: number;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
};
