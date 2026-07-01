import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { ProjectRecord } from "@/types/database";

function formatPeriod(project: Pick<ProjectRecord, "period_start" | "period_end">) {
  const start = project.period_start?.slice(0, 7) ?? "";
  const end = project.period_end?.slice(0, 7) ?? "";

  if (start && end) {
    return `${start} - ${end}`;
  }

  if (start) {
    return `${start} - 현재`;
  }

  if (end) {
    return end;
  }

  return "";
}

export type PublishedProject = ProjectRecord & {
  period: string;
  favoritePortfolioDescription: string | null;
};

function withComputedFields(project: ProjectRecord, favoritePortfolioDescription: string | null = null): PublishedProject {
  return {
    ...project,
    period: formatPeriod(project),
    favoritePortfolioDescription
  };
}

export async function getPublishedProjects(limit?: number) {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("period_start", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to load published projects", error.message);
    return [];
  }

  return ((data ?? []) as ProjectRecord[]).map((project) => withComputedFields(project));
}

export async function getPublishedProjectBySlug(slug: string) {
  if (!hasSupabaseEnv()) {
    notFound();
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .eq("slug", slug)
    .single();

  if (error || !data) {
    notFound();
  }

  const { data: favoriteOutput, error: favoriteError } = await supabase
    .from("generated_outputs")
    .select("content_markdown")
    .eq("project_id", data.id)
    .eq("output_type", "portfolio_description")
    .eq("is_favorite", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (favoriteError) {
    console.error("Failed to load favorite portfolio description", favoriteError.message);
  }

  return withComputedFields(
    data as ProjectRecord,
    typeof favoriteOutput?.content_markdown === "string" ? favoriteOutput.content_markdown : null
  );
}
