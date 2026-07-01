import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

type NewProjectPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default function NewProjectPage({ searchParams }: NewProjectPageProps) {
  return (
    <div>
      <PageHeader
        title="New Project"
        description="프로젝트 기본 정보와 slug를 입력하는 생성 화면입니다."
      />
      <ProjectForm error={searchParams?.error} />
    </div>
  );
}
