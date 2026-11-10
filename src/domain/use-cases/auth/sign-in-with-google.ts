import type { AuthRepository } from "../../repositories/auth-repository";

export class SignInWithGoogle {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): Promise<void> {
    return this.authRepository.signInWithGoogle();
  }
}
