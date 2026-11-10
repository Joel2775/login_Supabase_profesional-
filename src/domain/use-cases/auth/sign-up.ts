import type { AuthUser } from "../../entities/auth-user";
import type { AuthRepository } from "../../repositories/auth-repository";

export class SignUp {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(email: string, password: string): Promise<AuthUser | null> {
    return this.authRepository.signUp(email, password);
  }
}
