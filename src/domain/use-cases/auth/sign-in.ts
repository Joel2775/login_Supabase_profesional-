import type { AuthUser } from "../../entities/auth-user";
import type { AuthRepository } from "../../repositories/auth-repository";

export class SignIn {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(email: string, password: string): Promise<AuthUser> {
    return this.authRepository.signIn(email, password);
  }
}
