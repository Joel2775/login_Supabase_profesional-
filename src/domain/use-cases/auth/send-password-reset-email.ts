import type { AuthRepository } from "../../repositories/auth-repository";

export class SendPasswordResetEmail {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(email: string, redirectTo: string): Promise<void> {
    return this.authRepository.sendPasswordResetEmail(email, redirectTo);
  }
}
