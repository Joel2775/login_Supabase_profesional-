import { SupabaseAuthRepository } from "@/data/auth/supabase-auth-repository";
import { CompleteAuthCallback } from "@/domain/use-cases/auth/complete-auth-callback";
import { SendPasswordResetEmail } from "@/domain/use-cases/auth/send-password-reset-email";
import { SignIn } from "@/domain/use-cases/auth/sign-in";
import { SignInWithGoogle } from "@/domain/use-cases/auth/sign-in-with-google";
import { SignOut } from "@/domain/use-cases/auth/sign-out";
import { SignUp } from "@/domain/use-cases/auth/sign-up";
import { UpdatePassword } from "@/domain/use-cases/auth/update-password";
import { createSupabaseClient } from "@/core/supabase/client";

export function createAuthDependencies() {
  const repository = new SupabaseAuthRepository(createSupabaseClient());

  return {
    repository,
    completeAuthCallback: new CompleteAuthCallback(repository),
    sendPasswordResetEmail: new SendPasswordResetEmail(repository),
    signIn: new SignIn(repository),
    signInWithGoogle: new SignInWithGoogle(repository),
    signOut: new SignOut(repository),
    signUp: new SignUp(repository),
    updatePassword: new UpdatePassword(repository),
  };
}

export type AuthDependencies = ReturnType<typeof createAuthDependencies>;
