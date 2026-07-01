import type { OutputType } from "@/types/database";
import type { GeneratorInput, GeneratorResult, PortfolioGenerator } from "@/lib/generator/types";

const OUTPUT_TYPES = ["portfolio_description", "resume_bullets", "interview_qa"] as const;

type SupportedOutputType = (typeof OUTPUT_TYPES)[number];

export type GeneratedPortfolioOutputs = Record<SupportedOutputType, GeneratorResult>;

export interface PortfolioOutputsGenerator extends PortfolioGenerator {
  generateAll(input: GeneratorInput): GeneratedPortfolioOutputs;
}

type FieldValue = string | null | undefined;

function clean(value: FieldValue) {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : null;
}

function fallback(value: FieldValue, fallbackText = "추가 확인 필요") {
  return clean(value) ?? fallbackText;
}

function hasClearResult(value: FieldValue) {
  const result = clean(value);
  if (!result) {
    return false;
  }

  return !/추가\s*확인\s*필요/.test(result);
}

function formatResult(value: FieldValue) {
  return hasClearResult(value) ? clean(value)! : "성과: 추가 확인 필요";
}

function formatTechStack(techStack: string[]) {
  return techStack.length > 0 ? techStack.join(", ") : "추가 확인 필요";
}

function formatPeriod(start: FieldValue, end: FieldValue) {
  const periodStart = clean(start);
  const periodEnd = clean(end);

  if (periodStart && periodEnd) {
    return `${periodStart} ~ ${periodEnd}`;
  }

  return periodStart ?? periodEnd ?? "추가 확인 필요";
}

function uniqueLines(lines: string[]) {
  return Array.from(new Set(lines.map((line) => line.trim()).filter(Boolean)));
}

function summarizeSources(input: GeneratorInput) {
  const sourceLines = input.sources.flatMap((source) => {
    const title = clean(source.title);
    const contentLines = source.content
      .split(/\r?\n/)
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean);

    if (contentLines.length === 0) {
      return [];
    }

    const prefix = title ? `${title}: ` : "";
    return contentLines.slice(0, 4).map((line) => `${prefix}${line}`);
  });

  return uniqueLines(sourceLines).slice(0, 8);
}

function buildInputSnapshot(input: GeneratorInput) {
  return {
    projectId: input.project.id,
    sourceIds: input.sources.map((source) => source.id),
    generatedBy: "template",
    paidApiUsed: false
  };
}

function getOutputTitle(projectTitle: string, outputType: OutputType) {
  const labelByType: Record<OutputType, string> = {
    portfolio_description: "포트폴리오 설명",
    resume_bullets: "이력서 bullet",
    interview_qa: "면접 Q&A"
  };

  return `${projectTitle} - ${labelByType[outputType]}`;
}

function renderSourceSection(sourceSummary: string[]) {
  if (sourceSummary.length === 0) {
    return ["## 원천 노트", "", "- 추가 확인 필요"];
  }

  return ["## 원천 노트 기반 근거", "", ...sourceSummary.map((line) => `- ${line}`)];
}

function renderPortfolioDescription(input: GeneratorInput) {
  const { project } = input;
  const sourceSummary = summarizeSources(input);
  const result = formatResult(project.result);

  return [
    `## ${project.title}`,
    "",
    fallback(project.summary, "프로젝트 요약 추가 필요"),
    "",
    "## 프로젝트 개요",
    "",
    `- 기간: ${formatPeriod(project.period_start, project.period_end)}`,
    `- 역할: ${fallback(project.role)}`,
    `- 맥락: ${fallback(project.company_or_context)}`,
    `- 기술 스택: ${formatTechStack(project.tech_stack)}`,
    "",
    "## 문제와 접근",
    "",
    `이 프로젝트는 ${fallback(project.problem, "정리된 문제 정의가 추가로 필요합니다")}라는 문제를 다루었습니다. ` +
      `${fallback(project.solution, "구체적인 해결 방식은 추가 확인이 필요합니다")} 중심으로 접근했고, ` +
      `${fallback(project.contribution, "담당 기여 내용은 추가 확인이 필요합니다")}을 맡았습니다.`,
    "",
    "## 결과",
    "",
    result,
    "",
    ...renderSourceSection(sourceSummary)
  ].join("\n");
}

function renderResumeBullets(input: GeneratorInput) {
  const { project } = input;
  const sourceSummary = summarizeSources(input);
  const result = formatResult(project.result);
  const bullets = [
    `${project.title}에서 ${fallback(project.role, "역할 추가 필요")}로 참여하여 ${fallback(
      project.contribution,
      "담당 기여 내용 추가 확인 필요"
    )}`,
    `${fallback(project.problem, "문제 정의 추가 확인 필요")} 문제를 ${fallback(
      project.solution,
      "해결 방식 추가 확인 필요"
    )} 방식으로 개선`,
    `${formatTechStack(project.tech_stack)} 기반으로 프로젝트 요구사항을 구현하고 운영 흐름을 정리`,
    result,
    sourceSummary.length > 0
      ? `원천 노트 기준 주요 작업: ${sourceSummary.slice(0, 2).join("; ")}`
      : "원천 노트 기준 주요 작업: 추가 확인 필요"
  ];

  return uniqueLines(bullets)
    .slice(0, 5)
    .map((bullet) => `- ${bullet}`)
    .join("\n");
}

function renderInterviewQa(input: GeneratorInput) {
  const { project } = input;
  const sourceSummary = summarizeSources(input);
  const result = formatResult(project.result);
  const sourceTalkingPoint =
    sourceSummary.length > 0 ? sourceSummary.slice(0, 3).join("; ") : "원천 노트 추가 확인 필요";

  return [
    `## Q1. ${project.title}에서 본인의 역할은 무엇이었나요?`,
    "",
    `A. ${fallback(project.role, "역할 추가 필요")}로 참여했습니다. 프로젝트 맥락은 ${fallback(
      project.company_or_context,
      "추가 확인 필요"
    )}였고, 제 주요 기여는 ${fallback(project.contribution, "기여 내용 추가 확인 필요")}입니다.`,
    "",
    `## Q2. 가장 중요하게 해결한 문제는 무엇이었나요?`,
    "",
    `A. 핵심 문제는 ${fallback(project.problem, "추가 확인 필요")}였습니다. 이를 해결하기 위해 ${fallback(
      project.solution,
      "추가 확인 필요"
    )}에 집중했고, 관련 기술 스택은 ${formatTechStack(project.tech_stack)}입니다.`,
    "",
    `## Q3. 결과와 배운 점을 어떻게 설명할 수 있나요?`,
    "",
    `A. ${result} 원천 노트 기준으로는 ${sourceTalkingPoint}가 주요 근거입니다. 수치나 영향이 명확하지 않은 부분은 과장하지 않고 추가 확인 대상으로 남깁니다.`
  ].join("\n");
}

export class TemplatePortfolioOutputsGenerator implements PortfolioOutputsGenerator {
  generate(input: GeneratorInput, outputType: OutputType): GeneratorResult {
    const renderers: Record<OutputType, (input: GeneratorInput) => string> = {
      portfolio_description: renderPortfolioDescription,
      resume_bullets: renderResumeBullets,
      interview_qa: renderInterviewQa
    };

    return {
      outputType,
      title: getOutputTitle(input.project.title, outputType),
      contentMarkdown: renderers[outputType](input),
      inputSnapshot: buildInputSnapshot(input)
    };
  }

  generateAll(input: GeneratorInput): GeneratedPortfolioOutputs {
    return {
      portfolio_description: this.generate(input, "portfolio_description"),
      resume_bullets: this.generate(input, "resume_bullets"),
      interview_qa: this.generate(input, "interview_qa")
    };
  }
}

export function generatePortfolioOutputs(
  input: GeneratorInput,
  generator: PortfolioOutputsGenerator = new TemplatePortfolioOutputsGenerator()
) {
  return generator.generateAll(input);
}
