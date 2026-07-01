import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectList } from "@/components/admin/ProjectList";
import { listProjects } from "@/actions/projects";

export default async function AdminProjectsPage() {
  const projects = await listProjects();

  return (
    <div>
      <PageHeader
        title="Projects"
        description="내 프로젝트만 조회하고 publish 상태를 관리합니다."
        action={
          <Link href="/admin/projects/new" className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white">
            새 프로젝트
          </Link>
        }
      />
      <ProjectList projects={projects} />
    </div>
  );
}
