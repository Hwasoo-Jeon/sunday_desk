import { deleteProjectAction, toggleProjectPublishAction } from "@/actions/projects";
import type { ProjectRecord } from "@/types/database";

type ProjectDangerZoneProps = {
  project: ProjectRecord;
};

export function ProjectDangerZone({ project }: ProjectDangerZoneProps) {
  const togglePublish = toggleProjectPublishAction.bind(null, project.id, project.is_published);
  const deleteProject = deleteProjectAction.bind(null, project.id);

  return (
    <section className="rounded-lg border border-line bg-white p-5">
      <h2 className="text-base font-semibold text-ink">상태 관리</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <form action={togglePublish}>
          <button type="submit" className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink">
            {project.is_published ? "Unpublish" : "Publish"}
          </button>
        </form>
        <form action={deleteProject}>
          <button type="submit" className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700">
            삭제
          </button>
        </form>
      </div>
      <p className="mt-3 text-sm text-muted">
        Published 프로젝트만 공개 포트폴리오에 노출됩니다. 삭제는 되돌릴 수 없습니다.
      </p>
    </section>
  );
}
