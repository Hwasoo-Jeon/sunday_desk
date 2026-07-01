"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TemplatePortfolioOutputsGenerator } from "@/lib/generator";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  GeneratedOutputRecord,
  InterviewQuestionRecord,
  OutputType,
  ProjectRecord,
  ProjectSourceRecord,
  ResumeBulletRecord
} from "@/types/database";

const OUTPUT_TYPES: OutputType[] = ["portfolio_description", "resume_bullets", "interview_qa"];

async function getAuthenticatedSupabase() {
  if (!hasSupabaseEnv()) {
    redirect("/admin/login?error=config");
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  return {
    supabase,
    user
  };
}

async function loadGeneratorInput(projectId: string) {
  const { supabase, user } = await getAuthenticatedSupabase();
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    throw new Error("project_not_found");
  }

  const { data: sources, error: sourceError } = await supabase
    .from("project_sources")
    .select("*")
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (sourceError) {
    throw new Error("source_load_failed");
  }

  return {
    supabase,
    user,
    project: project as ProjectRecord,
    sources: (sources ?? []) as ProjectSourceRecord[]
  };
}

function parseResumeBullets(contentMarkdown: string) {
  return contentMarkdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.replace(/^-\s+/, "").trim())
    .filter(Boolean)
    .slice(0, 5);
}

function parseInterviewQuestions(contentMarkdown: string) {
  const sections = contentMarkdown
    .split(/^##\s+/m)
    .map((section) => section.trim())
    .filter(Boolean);

  return sections
    .map((section) => {
      const [questionLine, ...answerLines] = section.split(/\r?\n/);
      const question = questionLine.replace(/^Q\d?\.\s*/, "").trim();
      const answer = answerLines
        .join("\n")
        .replace(/^A\.\s*/m, "")
        .trim();

      return {
        question,
        answer
      };
    })
    .filter((item) => item.question && item.answer)
    .slice(0, 3);
}

async function saveStructuredOutputRows({
  projectId,
  userId,
  generatedOutputId,
  outputType,
  contentMarkdown
}: {
  projectId: string;
  userId: string;
  generatedOutputId: string;
  outputType: OutputType;
  contentMarkdown: string;
}) {
  const { supabase } = await getAuthenticatedSupabase();

  if (outputType === "resume_bullets") {
    const rows = parseResumeBullets(contentMarkdown).map((content, index) => ({
      user_id: userId,
      project_id: projectId,
      generated_output_id: generatedOutputId,
      content,
      display_order: index,
      is_visible: false
    }));

    if (rows.length > 0) {
      const { error } = await supabase.from("resume_bullets").insert(rows);

      if (error) {
        throw new Error("resume_bullets_save_failed");
      }
    }
  }

  if (outputType === "interview_qa") {
    const rows = parseInterviewQuestions(contentMarkdown).map((item, index) => ({
      user_id: userId,
      project_id: projectId,
      generated_output_id: generatedOutputId,
      question: item.question,
      answer: item.answer,
      display_order: index,
      is_favorite: false
    }));

    if (rows.length > 0) {
      const { error } = await supabase.from("interview_questions").insert(rows);

      if (error) {
        throw new Error("interview_questions_save_failed");
      }
    }
  }
}

async function generateAndSaveProjectOutput(projectId: string, outputType: OutputType) {
  const { supabase, user, project, sources } = await loadGeneratorInput(projectId);
  const generator = new TemplatePortfolioOutputsGenerator();
  const generated = generator.generate({ project, sources }, outputType);
  const { data, error } = await supabase
    .from("generated_outputs")
    .insert({
      user_id: user.id,
      project_id: projectId,
      output_type: generated.outputType,
      title: generated.title,
      content_markdown: generated.contentMarkdown,
      input_snapshot: generated.inputSnapshot,
      is_favorite: false
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error("output_save_failed");
  }

  await saveStructuredOutputRows({
    projectId,
    userId: user.id,
    generatedOutputId: data.id,
    outputType,
    contentMarkdown: generated.contentMarkdown
  });
}

function redirectWithGeneratorError(projectId: string, error: unknown): never {
  const message = error instanceof Error ? error.message : "unknown";
  const knownErrors = new Set([
    "project_not_found",
    "source_load_failed",
    "output_save_failed",
    "resume_bullets_save_failed",
    "interview_questions_save_failed"
  ]);
  const code = knownErrors.has(message) ? message : "generate_failed";
  redirect(`/admin/projects/${projectId}?outputError=${code}`);
}

export async function listGeneratedOutputs(projectId: string) {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const { supabase } = await getAuthenticatedSupabase();
  const { data, error } = await supabase
    .from("generated_outputs")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load generated outputs", error.message);
    return [];
  }

  return (data ?? []) as GeneratedOutputRecord[];
}

export async function listResumeBullets(projectId: string) {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const { supabase } = await getAuthenticatedSupabase();
  const { data, error } = await supabase
    .from("resume_bullets")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to load resume bullets", error.message);
    return [];
  }

  return (data ?? []) as ResumeBulletRecord[];
}

export async function listInterviewQuestions(projectId: string) {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const { supabase } = await getAuthenticatedSupabase();
  const { data, error } = await supabase
    .from("interview_questions")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to load interview questions", error.message);
    return [];
  }

  return (data ?? []) as InterviewQuestionRecord[];
}

export async function generateProjectOutputAction(projectId: string, outputType: OutputType) {
  try {
    await generateAndSaveProjectOutput(projectId, outputType);
  } catch (error) {
    redirectWithGeneratorError(projectId, error);
  }

  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?outputType=${outputType}`);
}

export async function generateAllProjectOutputsAction(projectId: string) {
  try {
    for (const outputType of OUTPUT_TYPES) {
      await generateAndSaveProjectOutput(projectId, outputType);
    }
  } catch (error) {
    redirectWithGeneratorError(projectId, error);
  }

  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}?outputType=portfolio_description`);
}

export async function toggleGeneratedOutputFavoriteAction(projectId: string, outputId: string) {
  const { supabase } = await getAuthenticatedSupabase();
  const { data: output, error: outputError } = await supabase
    .from("generated_outputs")
    .select("id, output_type, is_favorite")
    .eq("id", outputId)
    .eq("project_id", projectId)
    .single();

  if (outputError || !output) {
    redirect(`/admin/projects/${projectId}?outputError=output_not_found`);
  }

  const typedOutput = output as Pick<GeneratedOutputRecord, "id" | "output_type" | "is_favorite">;

  if (typedOutput.is_favorite) {
    const { error } = await supabase.from("generated_outputs").update({ is_favorite: false }).eq("id", outputId);

    if (error) {
      redirect(`/admin/projects/${projectId}?outputError=favorite_failed`);
    }
  } else {
    const { error: clearError } = await supabase
      .from("generated_outputs")
      .update({ is_favorite: false })
      .eq("project_id", projectId)
      .eq("output_type", typedOutput.output_type);

    if (clearError) {
      redirect(`/admin/projects/${projectId}?outputError=favorite_failed`);
    }

    const { error: setError } = await supabase
      .from("generated_outputs")
      .update({ is_favorite: true })
      .eq("id", outputId);

    if (setError) {
      redirect(`/admin/projects/${projectId}?outputError=favorite_failed`);
    }
  }

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/projects");
  redirect(`/admin/projects/${projectId}?outputType=${typedOutput.output_type}`);
}
