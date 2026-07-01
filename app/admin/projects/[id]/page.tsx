import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectDangerZone } from "@/components/admin/ProjectDangerZone";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ProjectOutputPanel } from "@/components/admin/ProjectOutputPanel";
import { ProjectSourcePanel } from "@/components/admin/ProjectSourcePanel";
import { listGeneratedOutputs, listInterviewQuestions, listResumeBullets } from "@/actions/generator";
import { getProjectById } from "@/actions/projects";
import { listProjectSources } from "@/actions/project-sources";
import type { OutputType } from "@/types/database";

type AdminProjectDetailPageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    error?: string;
    sourceError?: string;
    outputError?: string;
    outputType?: string;
  };
};

const outputTypes: OutputType[] = ["portfolio_description", "resume_bullets", "interview_qa"];

function parseOutputType(value?: string): OutputType {
  return outputTypes.includes(value as OutputType) ? (value as OutputType) : "portfolio_description";
}

export default async function AdminProjectDetailPage({ params, searchParams }: AdminProjectDetailPageProps) {
  const project = await getProjectById(params.id);

  if (!project) {
    return (
      <div>
        <PageHeader
          title="Project Editor"
          description="Supabase 환경 변수가 설정되면 프로젝트 상세 정보를 조회합니다."
        />
        <ProjectForm error={searchParams?.error} />
      </div>
    );
  }

  const sources = await listProjectSources(project.id);
  const outputs = await listGeneratedOutputs(project.id);
  const resumeBullets = await listResumeBullets(project.id);
  const interviewQuestions = await listInterviewQuestions(project.id);
  const selectedOutputType = parseOutputType(searchParams?.outputType);

  return (
    <div>
      <PageHeader
        title={project.title}
        description="프로젝트 상세 정보, 원본 메모, publish 상태를 관리합니다."
      />
      <div className="grid gap-4">
        <ProjectForm project={project} error={searchParams?.error} />
        <ProjectSourcePanel projectId={project.id} sources={sources} error={searchParams?.sourceError} />
        <ProjectOutputPanel
          projectId={project.id}
          outputs={outputs}
          resumeBullets={resumeBullets}
          interviewQuestions={interviewQuestions}
          selectedType={selectedOutputType}
          error={searchParams?.outputError}
        />
        <ProjectDangerZone project={project} />
      </div>
    </div>
  );
}
