import type { AuthRepository } from "../../repositories/auth-repository";

export class UpdatePassword {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(password: string): Promise<void> {
    return this.authRepository.updatePassword(password);
  }
}
