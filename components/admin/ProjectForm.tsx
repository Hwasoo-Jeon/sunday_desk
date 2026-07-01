"use client";

import { useMemo, useState } from "react";
import type { ProjectRecord } from "@/types/database";
import { createProjectAction, updateProjectAction } from "@/actions/projects";

type ProjectFormProps = {
  project?: ProjectRecord;
  error?: string;
};

const errorMessages: Record<string, string> = {
  missing_title: "프로젝트 제목을 입력하세요.",
  missing_slug: "slug를 입력하거나 제목을 입력해 자동 생성하세요.",
  invalid_links: "links는 JSON 배열 형식이어야 합니다.",
  save_failed: "저장에 실패했습니다. slug 중복 또는 입력값을 확인하세요.",
  publish_failed: "공개 상태 변경에 실패했습니다.",
  delete_failed: "삭제에 실패했습니다."
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDate(value: string | null) {
  return value ?? "";
}

function formatTechStack(value: string[]) {
  return value.join(", ");
}

function formatLinks(value: ProjectRecord["links"]) {
  return JSON.stringify(value ?? [], null, 2);
}

export function ProjectForm({ project, error }: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [isSlugDirty, setIsSlugDirty] = useState(Boolean(project?.slug));
  const action = useMemo(() => {
    if (!project) {
      return createProjectAction;
    }

    return updateProjectAction.bind(null, project.id);
  }, [project]);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!isSlugDirty) {
      setSlug(slugify(value));
    }
  }

  return (
    <form action={action} className="space-y-5">
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessages[error] ?? "프로젝트 저장 중 문제가 발생했습니다."}
        </p>
      ) : null}

      <section className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-base font-semibold text-ink">기본 정보</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Title" htmlFor="title" required>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              required
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-ink"
            />
          </Field>

          <Field label="Slug" htmlFor="slug" required>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(event) => {
                setIsSlugDirty(true);
                setSlug(slugify(event.target.value));
              }}
              required
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-ink"
            />
          </Field>

          <Field label="Period Start" htmlFor="period_start">
            <input
              id="period_start"
              name="period_start"
              type="date"
              defaultValue={formatDate(project?.period_start ?? null)}
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-ink"
            />
          </Field>

          <Field label="Period End" htmlFor="period_end">
            <input
              id="period_end"
              name="period_end"
              type="date"
              defaultValue={formatDate(project?.period_end ?? null)}
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-ink"
            />
          </Field>

          <Field label="Role" htmlFor="role">
            <input
              id="role"
              name="role"
              defaultValue={project?.role ?? ""}
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-ink"
            />
          </Field>

          <Field label="Company or Context" htmlFor="company_or_context">
            <input
              id="company_or_context"
              name="company_or_context"
              defaultValue={project?.company_or_context ?? ""}
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-ink"
            />
          </Field>

          <Field label="Display Order" htmlFor="display_order">
            <input
              id="display_order"
              name="display_order"
              type="number"
              defaultValue={project?.display_order ?? 0}
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-ink"
            />
          </Field>

          <Field label="Published" htmlFor="is_published">
            <label className="flex min-h-10 items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-muted">
              <input
                id="is_published"
                name="is_published"
                type="checkbox"
                defaultChecked={project?.is_published ?? false}
              />
              공개 포트폴리오에 노출
            </label>
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-base font-semibold text-ink">포트폴리오 내용</h2>
        <div className="mt-4 grid gap-4">
          <TextareaField label="Summary" name="summary" defaultValue={project?.summary ?? ""} rows={3} />
          <Field label="Tech Stack" htmlFor="tech_stack">
            <input
              id="tech_stack"
              name="tech_stack"
              defaultValue={formatTechStack(project?.tech_stack ?? [])}
              placeholder="Next.js, TypeScript, Supabase"
              className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-ink"
            />
            <p className="mt-1 text-xs text-muted">쉼표로 구분해 입력하면 text[]로 저장됩니다.</p>
          </Field>
          <TextareaField label="Problem" name="problem" defaultValue={project?.problem ?? ""} rows={4} />
          <TextareaField label="Solution" name="solution" defaultValue={project?.solution ?? ""} rows={4} />
          <TextareaField label="Result" name="result" defaultValue={project?.result ?? ""} rows={4} />
          <TextareaField label="Contribution" name="contribution" defaultValue={project?.contribution ?? ""} rows={4} />
          <TextareaField
            label="Links JSON"
            name="links"
            defaultValue={formatLinks(project?.links ?? [])}
            rows={5}
            description='예: [{"label":"GitHub","url":"https://github.com/..."}]'
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white">
          저장
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function TextareaField({
  label,
  name,
  defaultValue,
  rows,
  description
}: {
  label: string;
  name: string;
  defaultValue: string;
  rows: number;
  description?: string;
}) {
  return (
    <Field label={label} htmlFor={name}>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="w-full rounded-md border border-line px-3 py-2 text-sm leading-6 outline-none focus:border-ink"
      />
      {description ? <p className="mt-1 text-xs text-muted">{description}</p> : null}
    </Field>
  );
}
