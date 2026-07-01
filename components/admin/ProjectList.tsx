import Link from "next/link";
import type { ProjectRecord } from "@/types/database";

type ProjectListProps = {
  projects: ProjectRecord[];
};

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <section className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-base font-semibold text-ink">Project List</h2>
        <p className="mt-3 text-sm text-muted">
          아직 프로젝트가 없습니다. 새 프로젝트를 만들고 원본 경험을 구조화하세요.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-white">
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-line px-5 py-3 text-xs font-medium uppercase text-muted">
        <span>Project</span>
        <span>Status</span>
        <span>Updated</span>
      </div>
      <div className="divide-y divide-line">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/admin/projects/${project.id}`}
            className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-4 hover:bg-panel"
          >
            <span>
              <span className="block text-sm font-medium text-ink">{project.title}</span>
              <span className="mt-1 block text-xs text-muted">/{project.slug}</span>
            </span>
            <span className="self-center rounded border border-line px-2 py-1 text-xs text-muted">
              {project.is_published ? "Published" : "Draft"}
            </span>
            <span className="self-center text-xs text-muted">
              {new Date(project.updated_at).toLocaleDateString("ko-KR")}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
