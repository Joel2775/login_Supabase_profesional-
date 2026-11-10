import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { AuthUser } from "@/domain/entities/auth-user";
import {
  createAuthDependencies,
  type AuthDependencies,
} from "@/core/di/auth-dependencies";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  configurationError: string | null;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (email: string, password: string) => Promise<AuthUser | null>;
  signInWithGoogle: () => Promise<void>;
  completeAuthCallback: (code: string) => Promise<void>;
  sendPasswordResetEmail: (email: string, redirectTo: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function initializeAuth(): {
  dependencies: AuthDependencies | null;
  configurationError: string | null;
} {
  try {
    return { dependencies: createAuthDependencies(), configurationError: null };
  } catch (error) {
    return {
      dependencies: null,
      configurationError:
        error instanceof Error
          ? error.message
          : "Could not initialize authentication.",
    };
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [initialization] = useState(initializeAuth);
  const { dependencies } = initialization;
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(dependencies !== null);
  const [configurationError, setConfigurationError] = useState<string | null>(
    initialization.configurationError,
  );

  useEffect(() => {
    if (!dependencies) return;

    let active = true;
    const unsubscribe = dependencies.repository.onAuthStateChanged((nextUser) => {
      if (active) setUser(nextUser);
    });

    void dependencies.repository
      .getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser);
      })
      .catch((error: unknown) => {
        if (active) {
          setConfigurationError(
            error instanceof Error ? error.message : "Could not restore the session.",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [dependencies]);

  const requireDependencies = useCallback(() => {
    if (!dependencies) {
      throw new Error(
        configurationError ?? "Authentication has not finished initializing.",
      );
    }
    return dependencies;
  }, [configurationError, dependencies]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      configurationError,
      signIn: (email, password) =>
        requireDependencies().signIn.execute(email, password),
      signUp: (email, password) =>
        requireDependencies().signUp.execute(email, password),
      signInWithGoogle: () =>
        requireDependencies().signInWithGoogle.execute(),
      completeAuthCallback: (code) =>
        requireDependencies().completeAuthCallback.execute(code),
      sendPasswordResetEmail: (email, redirectTo) =>
        requireDependencies().sendPasswordResetEmail.execute(email, redirectTo),
      updatePassword: (password) =>
        requireDependencies().updatePassword.execute(password),
      signOut: () => requireDependencies().signOut.execute(),
    }),
    [configurationError, isLoading, requireDependencies, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider.");
  return context;
}
