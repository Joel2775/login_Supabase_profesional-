import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/core/supabase/database.types";

export type AppSupabaseClient = SupabaseClient<Database>;

export async function requireCurrentUserId(
  supabase: AppSupabaseClient,
): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throwSupabaseError(
      error,
      "No se pudo verificar la sesión",
      "el acceso a los datos académicos",
    );
  }
  if (!data.user) {
    throw new Error("Debes iniciar sesión para acceder a los datos académicos.");
  }
  return data.user.id;
}

export function throwSupabaseError(
  error: { code?: string; message: string },
  operation: string,
  resource: string,
): never {
  if (error.code === "23505") {
    throw new Error(`Ya existe ${resource} con esos datos.`);
  }
  if (error.code === "23503") {
    throw new Error(
      `No se puede completar la operación: ${resource} relacionado no existe o no pertenece a tu cuenta.`,
    );
  }
  if (error.code === "42501") {
    throw new Error(`No tienes permiso para ${operation.toLowerCase()}.`);
  }

  throw new Error(`${operation}: ${error.message}`);
}

export function requireRecord<T>(
  record: T | null,
  resource: string,
): T {
  if (!record) {
    throw new Error(`${resource} no existe o no está disponible.`);
  }
  return record;
}
