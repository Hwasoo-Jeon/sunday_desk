import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { getPublishedProjects } from "@/lib/portfolio-projects";

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <SectionHeader
        eyebrow="Projects"
        title="공개 프로젝트"
        description="published 상태인 프로젝트만 display_order 기준으로 정렬해 표시합니다."
      />
      {projects.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-lg border border-line bg-white p-5 text-sm text-muted">
          아직 공개된 프로젝트가 없습니다.
        </p>
      )}
    </section>
  );
}
