import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { getPublishedProjectBySlug } from "@/lib/portfolio-projects";

type ProjectDetailPageProps = {
  params: {
    slug: string;
  };
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = await getPublishedProjectBySlug(params.slug);
  const detailSections = [
    { title: "Context", body: project.company_or_context },
    { title: "Contribution", body: project.contribution },
    { title: "Problem", body: project.problem },
    { title: "Solution", body: project.solution },
    { title: "Result", body: project.result }
  ].filter((section) => section.body && section.body.trim().length > 0);

  return (
    <article className="mx-auto max-w-6xl px-6 py-14">
      <SectionHeader eyebrow="Project Detail" title={project.title} description={project.summary ?? undefined} />

      <dl className="mt-8 grid gap-4 rounded-lg border border-line bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        {project.role ? <MetaItem label="Role" value={project.role} /> : null}
        {project.period ? <MetaItem label="Period" value={project.period} /> : null}
        {project.company_or_context ? <MetaItem label="Context" value={project.company_or_context} /> : null}
        {project.tech_stack.length > 0 ? <MetaItem label="Tech" value={project.tech_stack.join(", ")} /> : null}
      </dl>

      {detailSections.length > 0 ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {detailSections.map((section) => (
            <section key={section.title} className="rounded-lg border border-line bg-white p-5">
              <h2 className="text-base font-semibold text-ink">{section.title}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">{section.body}</p>
            </section>
          ))}
        </div>
      ) : null}

      {project.favoritePortfolioDescription ? (
        <section className="mt-8 rounded-lg border border-line bg-white p-5">
          <h2 className="text-base font-semibold text-ink">Portfolio Description</h2>
          <div className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">
            {project.favoritePortfolioDescription}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}
