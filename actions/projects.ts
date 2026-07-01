"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { Json, ProjectRecord } from "@/types/database";

type ProjectFormValues = {
  title: string;
  slug: string;
  summary: string | null;
  period_start: string | null;
  period_end: string | null;
  role: string | null;
  company_or_context: string | null;
  tech_stack: string[];
  problem: string | null;
  solution: string | null;
  result: string | null;
  contribution: string | null;
  links: Json;
  is_published: boolean;
  display_order: number;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNullableStringValue(formData: FormData, key: string) {
  const value = getStringValue(formData, key);
  return value.length > 0 ? value : null;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseTechStack(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseDisplayOrder(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseLinks(value: string): Json {
  if (!value.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      throw new Error("links must be an array");
    }

    return parsed as Json;
  } catch {
    throw new Error("invalid_links");
  }
}

function parseProjectForm(formData: FormData): ProjectFormValues {
  const title = getStringValue(formData, "title");
  const requestedSlug = getStringValue(formData, "slug");
  const slug = slugify(requestedSlug || title);

  if (!title) {
    throw new Error("missing_title");
  }

  if (!slug) {
    throw new Error("missing_slug");
  }

  return {
    title,
    slug,
    summary: getNullableStringValue(formData, "summary"),
    period_start: getNullableStringValue(formData, "period_start"),
    period_end: getNullableStringValue(formData, "period_end"),
    role: getNullableStringValue(formData, "role"),
    company_or_context: getNullableStringValue(formData, "company_or_context"),
    tech_stack: parseTechStack(getStringValue(formData, "tech_stack")),
    problem: getNullableStringValue(formData, "problem"),
    solution: getNullableStringValue(formData, "solution"),
    result: getNullableStringValue(formData, "result"),
    contribution: getNullableStringValue(formData, "contribution"),
    links: parseLinks(getStringValue(formData, "links")),
    is_published: formData.get("is_published") === "on",
    display_order: parseDisplayOrder(getStringValue(formData, "display_order"))
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

function redirectWithProjectFormError(basePath: string, error: unknown): never {
  const message = error instanceof Error ? error.message : "unknown";
  const knownErrors = new Set(["missing_title", "missing_slug", "invalid_links"]);
  const code = knownErrors.has(message) ? message : "save_failed";
  redirect(`${basePath}?error=${code}`);
}

export async function listProjects() {
  if (!hasSupabaseEnv()) {
    return [];
  }

  const { supabase } = await getAuthenticatedSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ProjectRecord[];
}

export async function getProjectById(id: string) {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const { supabase } = await getAuthenticatedSupabase();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();

  if (error) {
    notFound();
  }

  return data as ProjectRecord;
}

export async function createProjectAction(formData: FormData) {
  let values: ProjectFormValues;

  try {
    values = parseProjectForm(formData);
  } catch (error) {
    redirectWithProjectFormError("/admin/projects/new", error);
  }

  const { supabase, user } = await getAuthenticatedSupabase();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      ...values,
      user_id: user.id
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/admin/projects/new?error=save_failed");
  }

  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${data.id}`);
}

export async function updateProjectAction(projectId: string, formData: FormData) {
  let values: ProjectFormValues;

  try {
    values = parseProjectForm(formData);
  } catch (error) {
    redirectWithProjectFormError(`/admin/projects/${projectId}`, error);
  }

  const { supabase } = await getAuthenticatedSupabase();
  const { error } = await supabase.from("projects").update(values).eq("id", projectId);

  if (error) {
    redirect(`/admin/projects/${projectId}?error=save_failed`);
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
  redirect(`/admin/projects/${projectId}`);
}

export async function deleteProjectAction(projectId: string) {
  const { supabase } = await getAuthenticatedSupabase();
  const { error } = await supabase.from("projects").delete().eq("id", projectId);

  if (error) {
    redirect(`/admin/projects/${projectId}?error=delete_failed`);
  }

  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function toggleProjectPublishAction(projectId: string, isPublished: boolean) {
  const { supabase } = await getAuthenticatedSupabase();
  const { error } = await supabase
    .from("projects")
    .update({ is_published: !isPublished })
    .eq("id", projectId);

  if (error) {
    redirect(`/admin/projects/${projectId}?error=publish_failed`);
  }

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
}
