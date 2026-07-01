import Link from "next/link";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { SectionHeader } from "@/components/portfolio/SectionHeader";
import { BRAND } from "@/lib/brand";
import { getPublishedProjects } from "@/lib/portfolio-projects";

export default async function HomePage() {
  const featuredProjects = await getPublishedProjects(3);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-wide text-muted">{BRAND.name}</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            A quiet Sunday space to shape your work into a portfolio.
          </h1>
          <p className="mt-5 text-base leading-7 text-muted">
            Sunday Desk는 프로젝트 경험, 원본 메모, 문제와 해결 과정을 정리해 공개 가능한
            포트폴리오 콘텐츠로 다듬는 개인 작업 공간입니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white">
              프로젝트 보기
            </Link>
            <Link href="/contact" className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink">
              연락하기
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-panel">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <SectionHeader
            eyebrow="Featured"
            title="대표 프로젝트"
            description="관리자 Studio에서 published로 선택한 프로젝트만 공개 페이지에 표시됩니다."
          />
          {featuredProjects.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-lg border border-line bg-white p-5 text-sm text-muted">
              아직 공개된 프로젝트가 없습니다.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
