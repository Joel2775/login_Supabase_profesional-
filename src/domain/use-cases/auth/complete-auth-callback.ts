import type { AuthRepository } from "../../repositories/auth-repository";

export class CompleteAuthCallback {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(code: string): Promise<void> {
    return this.authRepository.completeAuthCallback(code);
  }
}
