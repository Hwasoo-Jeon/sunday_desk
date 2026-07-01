export type ProjectSummary = {
  title: string;
  slug: string;
  summary: string;
  period: string;
  role: string;
  techStack: string[];
};

export type ProjectDetail = ProjectSummary & {
  companyOrContext: string;
  problem: string;
  solution: string;
  result: string;
  contribution: string;
  links: Array<{
    label: string;
    url: string;
  }>;
};

export type Skill = {
  name: string;
  category: string;
  level?: string;
};
