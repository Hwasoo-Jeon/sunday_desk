"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { ProjectSourceRecord, SourceType } from "@/types/database";

const SUPPORTED_SOURCE_TYPES = new Set<SourceType>(["manual_note"]);

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseSourceType(value: string): SourceType {
  const sourceType = value || "manual_note";

  if (!SUPPORTED_SOURCE_TYPES.has(sourceType)) {
    throw new Error("unsupported_source_type");
  }

  return sourceType;
}

function parseProjectSourceForm(formData: FormData) {
  const title = getStringValue(formData, "title");
  const content = getStringValue(formData, "content");
  const source_type = parseSourceType(getStringValue(formData, "source_type"));

  if (!content) {
    throw new Error("missing_content");
  }

  return {
    title: title || null,
    content,
    source_type,
    metadata: {}
  };
}

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

function redirectWithSourceError(projectId: string, error: unknown): never {
  const message = error instanceof Error ? error.message : "unknown";
  const knownErrors = new Set(["missing_content", "unsupported_source_type"]);
  const code = knownErrors.has(message) ? message : "source_save_failed";
  redirect(`/admin/projects/${projectId}?sourceError=${code}`);
}

export async function listProjectSources(projectId: string) {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const { supabase } = await getAuthenticatedSupabase();
  const { data, error } = await supabase
    .from("project_sources")
    .select("*")
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load project sources", error.message);
    return [];
  }

  return (data ?? []) as ProjectSourceRecord[];
}

export async function createProjectSourceAction(projectId: string, formData: FormData) {
  let values: ReturnType<typeof parseProjectSourceForm>;

  try {
    values = parseProjectSourceForm(formData);
  } catch (error) {
    redirectWithSourceError(projectId, error);
  }

  const { supabase, user } = await getAuthenticatedSupabase();
  const { error } = await supabase.from("project_sources").insert({
    ...values,
    project_id: projectId,
    user_id: user.id
  });

  if (error) {
    redirect(`/admin/projects/${projectId}?sourceError=source_save_failed`);
  }

  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}`);
}

export async function updateProjectSourceAction(projectId: string, sourceId: string, formData: FormData) {
  let values: ReturnType<typeof parseProjectSourceForm>;

  try {
    values = parseProjectSourceForm(formData);
  } catch (error) {
    redirectWithSourceError(projectId, error);
  }

  const { supabase } = await getAuthenticatedSupabase();
  const { error } = await supabase.from("project_sources").update(values).eq("id", sourceId);

  if (error) {
    redirect(`/admin/projects/${projectId}?sourceError=source_save_failed`);
  }

  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}`);
}

export async function deleteProjectSourceAction(projectId: string, sourceId: string) {
  const { supabase } = await getAuthenticatedSupabase();
  const { error } = await supabase.from("project_sources").delete().eq("id", sourceId);

  if (error) {
    redirect(`/admin/projects/${projectId}?sourceError=source_delete_failed`);
  }

  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}`);
}
