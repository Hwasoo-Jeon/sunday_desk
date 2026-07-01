import Link from "next/link";
import {
  generateAllProjectOutputsAction,
  generateProjectOutputAction,
  toggleGeneratedOutputFavoriteAction
} from "@/actions/generator";
import { CopyMarkdownButton } from "@/components/admin/CopyMarkdownButton";
import type { GeneratedOutputRecord, InterviewQuestionRecord, OutputType, ResumeBulletRecord } from "@/types/database";

type ProjectOutputPanelProps = {
  projectId: string;
  outputs: GeneratedOutputRecord[];
  resumeBullets: ResumeBulletRecord[];
  interviewQuestions: InterviewQuestionRecord[];
  selectedType: OutputType;
  error?: string;
};

const tabs: Array<{ type: OutputType; label: string }> = [
  { type: "portfolio_description", label: "포폴 설명" },
  { type: "resume_bullets", label: "이력서 bullet" },
  { type: "interview_qa", label: "면접 Q&A" }
];

const errorMessages: Record<string, string> = {
  project_not_found: "프로젝트를 찾을 수 없습니다.",
  source_load_failed: "원본 메모를 불러오지 못했습니다.",
  output_save_failed: "생성 결과 저장에 실패했습니다.",
  resume_bullets_save_failed: "이력서 bullet 저장에 실패했습니다.",
  interview_questions_save_failed: "면접 Q&A 저장에 실패했습니다.",
  output_not_found: "생성 결과를 찾을 수 없습니다.",
  favorite_failed: "favorite 변경에 실패했습니다.",
  generate_failed: "생성 중 문제가 발생했습니다."
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function ProjectOutputPanel({
  projectId,
  outputs,
  resumeBullets,
  interviewQuestions,
  selectedType,
  error
}: ProjectOutputPanelProps) {
  const selectedOutputs = outputs.filter((output) => output.output_type === selectedType);
  const selectedOutput = selectedOutputs[0] ?? null;
  const generatePortfolioDescription = generateProjectOutputAction.bind(null, projectId, "portfolio_description");
  const generateResumeBullets = generateProjectOutputAction.bind(null, projectId, "resume_bullets");
  const generateInterviewQa = generateProjectOutputAction.bind(null, projectId, "interview_qa");
  const generateAll = generateAllProjectOutputsAction.bind(null, projectId);

  return (
    <section className="rounded-lg border border-line bg-white p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">생성 결과</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            템플릿 generator로 결과를 만들고 generated_outputs에 버전 히스토리를 저장합니다.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <GenerateButton action={generatePortfolioDescription} label="포폴 설명 생성" />
          <GenerateButton action={generateResumeBullets} label="이력서 bullet 생성" />
          <GenerateButton action={generateInterviewQa} label="면접 Q&A 생성" />
          <GenerateButton action={generateAll} label="전체 생성" />
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessages[error] ?? "생성 결과 처리 중 문제가 발생했습니다."}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2 border-b border-line">
        {tabs.map((tab) => (
          <Link
            key={tab.type}
            href={`/admin/projects/${projectId}?outputType=${tab.type}`}
            className={
              selectedType === tab.type
                ? "border-b-2 border-ink px-3 py-2 text-sm font-semibold text-ink"
                : "px-3 py-2 text-sm font-medium text-muted"
            }
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          {selectedOutput ? (
            <OutputPreview projectId={projectId} output={selectedOutput} />
          ) : (
            <p className="rounded-lg border border-dashed border-line p-5 text-sm text-muted">
              아직 저장된 생성 결과가 없습니다. 상단 버튼으로 새 결과를 생성하세요.
            </p>
          )}

          {selectedType === "resume_bullets" ? <ResumeBulletList bullets={resumeBullets} /> : null}
          {selectedType === "interview_qa" ? <InterviewQuestionList questions={interviewQuestions} /> : null}
        </div>

        <aside className="rounded-lg border border-line bg-panel p-4">
          <h3 className="text-sm font-semibold text-ink">버전 히스토리</h3>
          <div className="mt-3 space-y-3">
            {selectedOutputs.length > 0 ? (
              selectedOutputs.map((output) => (
                <Link
                  key={output.id}
                  href={`/admin/projects/${projectId}?outputType=${output.output_type}`}
                  className="block rounded-md border border-line bg-white p-3 text-sm"
                >
                  <span className="block font-medium text-ink">
                    {output.is_favorite ? "★ " : ""}
                    {output.title}
                  </span>
                  <span className="mt-1 block text-xs text-muted">{formatDateTime(output.created_at)}</span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted">히스토리가 없습니다.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function GenerateButton({ action, label }: { action: () => Promise<void>; label: string }) {
  return (
    <form action={action}>
      <button type="submit" className="w-full rounded-md bg-ink px-3 py-2 text-sm font-medium text-white">
        {label}
      </button>
    </form>
  );
}

function OutputPreview({ projectId, output }: { projectId: string; output: GeneratedOutputRecord }) {
  const toggleFavorite = toggleGeneratedOutputFavoriteAction.bind(null, projectId, output.id);

  return (
    <article className="rounded-lg border border-line p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-ink">{output.title}</h3>
          <p className="mt-1 text-xs text-muted">{formatDateTime(output.created_at)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={toggleFavorite}>
            <button type="submit" className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink">
              {output.is_favorite ? "Favorite 해제" : "Favorite 지정"}
            </button>
          </form>
          <CopyMarkdownButton content={output.content_markdown} />
        </div>
      </div>
      <pre className="mt-4 whitespace-pre-wrap rounded-md bg-panel p-4 text-sm leading-7 text-ink">
        {output.content_markdown}
      </pre>
    </article>
  );
}

function ResumeBulletList({ bullets }: { bullets: ResumeBulletRecord[] }) {
  if (bullets.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 rounded-lg border border-line p-4">
      <h3 className="text-sm font-semibold text-ink">resume_bullets 저장 행</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
        {bullets.slice(0, 10).map((bullet) => (
          <li key={bullet.id}>- {bullet.content}</li>
        ))}
      </ul>
    </div>
  );
}

function InterviewQuestionList({ questions }: { questions: InterviewQuestionRecord[] }) {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 rounded-lg border border-line p-4">
      <h3 className="text-sm font-semibold text-ink">interview_questions 저장 행</h3>
      <div className="mt-3 space-y-4">
        {questions.slice(0, 9).map((item) => (
          <div key={item.id} className="text-sm leading-6">
            <p className="font-medium text-ink">Q. {item.question}</p>
            <p className="mt-1 text-muted">A. {item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
