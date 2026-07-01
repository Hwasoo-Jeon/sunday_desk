import {
  createProjectSourceAction,
  deleteProjectSourceAction,
  updateProjectSourceAction
} from "@/actions/project-sources";
import type { ProjectSourceRecord } from "@/types/database";

type ProjectSourcePanelProps = {
  projectId: string;
  sources: ProjectSourceRecord[];
  error?: string;
};

const errorMessages: Record<string, string> = {
  missing_content: "메모 내용을 입력하세요.",
  unsupported_source_type: "지원하지 않는 source_type입니다.",
  source_save_failed: "원본 메모 저장에 실패했습니다.",
  source_delete_failed: "원본 메모 삭제에 실패했습니다."
};

export function ProjectSourcePanel({ projectId, sources, error }: ProjectSourcePanelProps) {
  const createSource = createProjectSourceAction.bind(null, projectId);

  return (
    <section className="rounded-lg border border-line bg-white p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">원본 메모</h2>
          <p className="mt-1 text-sm text-muted">
            MVP에서는 manual_note만 저장합니다. source_type 필드는 이후 GitHub, 파일 업로드 소스로 확장합니다.
          </p>
        </div>
        <span className="rounded border border-line px-2 py-1 text-xs text-muted">{sources.length} notes</span>
      </div>

      {error ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessages[error] ?? "원본 메모 처리 중 문제가 발생했습니다."}
        </p>
      ) : null}

      <form action={createSource} className="mt-5 rounded-lg border border-line bg-panel p-4">
        <SourceFields submitLabel="메모 추가" />
      </form>

      <div className="mt-5 space-y-4">
        {sources.length > 0 ? (
          sources.map((source) => <SourceItem key={source.id} projectId={projectId} source={source} />)
        ) : (
          <p className="rounded-lg border border-dashed border-line p-5 text-sm text-muted">
            아직 원본 메모가 없습니다. 프로젝트를 진행하며 남긴 사실 기반 메모를 추가하세요.
          </p>
        )}
      </div>
    </section>
  );
}

function SourceItem({ projectId, source }: { projectId: string; source: ProjectSourceRecord }) {
  const updateSource = updateProjectSourceAction.bind(null, projectId, source.id);
  const deleteSource = deleteProjectSourceAction.bind(null, projectId, source.id);

  return (
    <article className="rounded-lg border border-line p-4">
      <form action={updateSource}>
        <SourceFields submitLabel="메모 수정" source={source} />
      </form>
      <form action={deleteSource} className="mt-3 flex justify-end">
        <button type="submit" className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700">
          삭제
        </button>
      </form>
    </article>
  );
}

function SourceFields({
  source,
  submitLabel
}: {
  source?: ProjectSourceRecord;
  submitLabel: string;
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-[180px_1fr]">
        <Field label="Source Type" htmlFor={source ? `source_type_${source.id}` : "source_type_new"}>
          <select
            id={source ? `source_type_${source.id}` : "source_type_new"}
            name="source_type"
            defaultValue={source?.source_type ?? "manual_note"}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
          >
            <option value="manual_note">manual_note</option>
          </select>
        </Field>

        <Field label="Title" htmlFor={source ? `title_${source.id}` : "title_new"}>
          <input
            id={source ? `title_${source.id}` : "title_new"}
            name="title"
            defaultValue={source?.title ?? ""}
            placeholder="예: UAT 일정 관리 메모"
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink"
          />
        </Field>
      </div>

      <Field label="Content" htmlFor={source ? `content_${source.id}` : "content_new"} required>
        <textarea
          id={source ? `content_${source.id}` : "content_new"}
          name="content"
          defaultValue={source?.content ?? ""}
          rows={source ? 5 : 4}
          required
          placeholder="사실 기반 원본 메모를 입력하세요. 수치, 역할, 문제, 해결 과정을 있는 그대로 적습니다."
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-ink"
        />
      </Field>

      <div className="flex justify-end">
        <button type="submit" className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white">
          {submitLabel}
        </button>
      </div>
    </div>
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
