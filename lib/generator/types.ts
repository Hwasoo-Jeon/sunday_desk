import type { ProjectRecord, ProjectSourceRecord, OutputType, Json } from "@/types/database";

export type GeneratorInput = {
  project: ProjectRecord;
  sources: ProjectSourceRecord[];
};

export type GeneratorResult = {
  outputType: OutputType;
  title: string;
  contentMarkdown: string;
  inputSnapshot: Record<string, Json>;
};

export interface PortfolioGenerator {
  generate(input: GeneratorInput, outputType: OutputType): GeneratorResult;
}
