import Link from "next/link";
import type { PublishedProject } from "@/lib/portfolio-projects";

type ProjectCardProps = {
  project: PublishedProject;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="rounded-lg border border-line bg-white p-5">
      <div className="flex h-full flex-col gap-3">
        <div>
          {project.period ? <p className="text-sm text-muted">{project.period}</p> : null}
          <h2 className="mt-1 text-xl font-semibold text-ink">{project.title}</h2>
          {project.role ? <p className="mt-1 text-sm text-muted">{project.role}</p> : null}
        </div>
        {project.summary ? <p className="text-sm leading-6 text-muted">{project.summary}</p> : null}
        {project.tech_stack.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span key={tech} className="rounded border border-line px-2 py-1 text-xs text-muted">
                {tech}
              </span>
            ))}
          </div>
        ) : null}
        <Link href={`/projects/${project.slug}`} className="mt-auto text-sm font-medium text-ink">
          상세 보기
        </Link>
      </div>
    </article>
  );
}
