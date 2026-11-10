import { Platform } from "react-native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/core/supabase/database.types";
import type { AuthUser } from "@/domain/entities/auth-user";
import type { AuthRepository } from "@/domain/repositories/auth-repository";

function toAuthUser(user: {
  id: string;
  email?: string;
}): AuthUser {
  return { id: user.id, email: user.email ?? null };
}

export class SupabaseAuthRepository implements AuthRepository {
  private readonly callbackPromises = new Map<string, Promise<void>>();

  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async signIn(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("Supabase did not return an authenticated user.");
    return toAuthUser(data.user);
  }

  async signUp(email: string, password: string): Promise<AuthUser | null> {
    const { data, error } = await this.supabase.auth.signUp({ email, password });

    if (error) throw error;
    return data.user && data.session ? toAuthUser(data.user) : null;
  }

  async signInWithGoogle(): Promise<void> {
    const redirectTo = Linking.createURL("auth/callback");
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: Platform.OS !== "web",
      },
    });

    if (error) throw error;
    if (Platform.OS === "web") return;
    if (!data.url) throw new Error("Supabase did not return a Google sign-in URL.");

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type === "success") {
      const callbackUrl = new URL(result.url);
      const callbackError = callbackUrl.searchParams.get("error_description");
      if (callbackError) throw new Error(callbackError);

      const code = callbackUrl.searchParams.get("code");
      if (!code) {
        throw new Error("The Google sign-in callback did not contain an authorization code.");
      }
      await this.completeAuthCallback(code);
    } else if (result.type !== "cancel" && result.type !== "dismiss") {
      throw new Error("Google sign-in did not complete.");
    }
  }

  completeAuthCallback(code: string): Promise<void> {
    const existing = this.callbackPromises.get(code);
    if (existing) return existing;

    const callback = this.exchangeAuthCode(code);
    this.callbackPromises.set(code, callback);
    return callback;
  }

  private async exchangeAuthCode(code: string): Promise<void> {
    const { error } = await this.supabase.auth.exchangeCodeForSession(code);
    if (error) {
      this.callbackPromises.delete(code);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, redirectTo: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
  }

  async updatePassword(password: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({ password });
    if (error) throw error;
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return data.session?.user ? toAuthUser(data.session.user) : null;
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    const { data } = this.supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ? toAuthUser(session.user) : null);
    });
    return () => data.subscription.unsubscribe();
  }
}
