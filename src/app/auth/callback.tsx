import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { AuthMessage } from "@/presentation/components/auth-form";
import { AuthScreen } from "@/presentation/components/auth-screen";
import { useAuth } from "@/presentation/auth/auth-provider";

export default function AuthCallbackScreen() {
  const { code, error_description: errorDescription } =
    useLocalSearchParams<{ code?: string; error_description?: string }>();
  const { completeAuthCallback } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (errorDescription || !code) return;

    let active = true;
    void completeAuthCallback(code)
      .then(() => {
        if (active) router.replace("/home");
      })
      .catch((error: unknown) => {
        if (active) {
          setMessage(
            error instanceof Error ? error.message : "Could not complete Google sign-in.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [code, completeAuthCallback, errorDescription, router]);

  const visibleMessage =
    message ??
    errorDescription ??
    (!code ? "The sign-in callback did not include an authorization code." : null);

  return (
    <AuthScreen
      title="Completing sign in"
      subtitle="You will be redirected as soon as your account is ready."
      footer={
        <Text>
          <Link href="/sign-in">Return to sign in</Link>
        </Text>
      }
    >
      {visibleMessage ? <AuthMessage message={visibleMessage} /> : null}
    </AuthScreen>
  );
}
