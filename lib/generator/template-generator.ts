import type { OutputType } from "@/types/database";
import type { GeneratorInput, GeneratorResult, PortfolioGenerator } from "@/lib/generator/types";
import { TemplatePortfolioOutputsGenerator } from "@/lib/generator/generatePortfolioOutputs";

export class TemplatePortfolioGenerator implements PortfolioGenerator {
  private readonly generator = new TemplatePortfolioOutputsGenerator();

  generate(input: GeneratorInput, outputType: OutputType): GeneratorResult {
    return this.generator.generate(input, outputType);
  }
}
