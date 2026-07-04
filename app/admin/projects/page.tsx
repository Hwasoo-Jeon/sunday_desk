import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectList } from "@/components/admin/ProjectList";
import { listProjects } from "@/actions/projects";
import type { ProjectRecord } from "@/types/database";

export default async function AdminProjectsPage() {
  let projects: ProjectRecord[] = [];
  let loadError: string | null = null;

  try {
    projects = await listProjects();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "프로젝트 목록을 불러오지 못했습니다.";
  }

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
      {loadError ? (
        <section className="mb-4 rounded-lg border border-red-200 bg-red-50 p-5">
          <h2 className="text-base font-semibold text-red-800">Supabase schema 확인 필요</h2>
          <p className="mt-3 text-sm leading-6 text-red-700">
            프로젝트 목록을 불러오지 못했습니다. 현재 연결된 Supabase 프로젝트에
            <code className="mx-1 rounded bg-white px-1">public.projects</code>
            테이블이 없거나 schema cache가 갱신되지 않은 상태입니다.
          </p>
          <p className="mt-3 text-sm leading-6 text-red-700">
            Supabase SQL Editor에서
            <code className="mx-1 rounded bg-white px-1">supabase/schema.sql</code>
            전체를 실행한 뒤 브라우저를 새로고침하세요.
          </p>
          <p className="mt-3 text-xs text-red-600">원본 오류: {loadError}</p>
        </section>
      ) : null}
      <ProjectList projects={projects} />
    </div>
  );
}
