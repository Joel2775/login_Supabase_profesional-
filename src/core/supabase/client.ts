import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import type { Database } from "./database.types";

let supabaseClient: SupabaseClient<Database> | null = null;

const webStorage = {
  getItem: async (key: string) =>
    typeof window === "undefined" ? null : window.localStorage.getItem(key),
  setItem: async (key: string, value: string) => {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
  },
};

export function createSupabaseClient(): SupabaseClient<Database> {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env.",
    );
  }

  supabaseClient = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      storage: Platform.OS === "web" ? webStorage : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: "pkce",
    },
  });
  return supabaseClient;
}
