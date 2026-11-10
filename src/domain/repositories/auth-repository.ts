import type { AuthUser } from "../entities/auth-user";

export interface AuthRepository {
  signIn(email: string, password: string): Promise<AuthUser>;
  signUp(email: string, password: string): Promise<AuthUser | null>;
  signInWithGoogle(): Promise<void>;
  completeAuthCallback(code: string): Promise<void>;
  sendPasswordResetEmail(email: string, redirectTo: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
}
