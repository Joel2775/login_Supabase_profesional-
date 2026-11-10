import type { AuthRepository } from "../../repositories/auth-repository";

export class SignOut {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): Promise<void> {
    return this.authRepository.signOut();
  }
}
