import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import {
  AuthButton,
  AuthField,
  AuthMessage,
} from "@/presentation/components/auth-form";
import { AuthScreen } from "@/presentation/components/auth-screen";
import { useAuth } from "@/presentation/auth/auth-provider";

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ code?: string; error_description?: string }>();
  const router = useRouter();
  const { completeAuthCallback, configurationError, isLoading, updatePassword, user } =
    useAuth();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [callbackCompleted, setCallbackCompleted] = useState(false);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const callbackReady = params.code ? callbackCompleted : Boolean(user);

  useEffect(() => {
    if (!params.code) return;

    let active = true;
    void completeAuthCallback(params.code)
      .then(() => {
        if (active) setCallbackCompleted(true);
      })
      .catch((error: unknown) => {
        if (active) {
          setCallbackError(
            error instanceof Error ? error.message : "This reset link is invalid or expired.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [completeAuthCallback, params.code]);

  if (
    !isLoading &&
    user &&
    callbackReady &&
    !configurationError &&
    !params.error_description &&
    !callbackError
  ) {
    const update = async () => {
      setBusy(true);
      try {
        await updatePassword(password);
        router.replace("/home");
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Could not update the password.",
        );
      } finally {
        setBusy(false);
      }
    };

    return (
      <AuthScreen
        title="Choose a new password"
        subtitle="Your new password must be at least 6 characters long."
        footer={
          <Text style={styles.footerText}>
            <Link href="/sign-in" style={styles.link}>Back to sign in</Link>
          </Text>
        }
      >
        {message ? <AuthMessage message={message} /> : null}
        <AuthField
          label="New password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="newPassword"
          autoComplete="new-password"
          placeholder="At least 6 characters"
        />
        <AuthField
          label="Confirm new password"
          value={confirmation}
          onChangeText={setConfirmation}
          secureTextEntry
          textContentType="newPassword"
          autoComplete="new-password"
          placeholder="Enter your password again"
        />
        <AuthButton
          title="Update password"
          loading={busy}
          disabled={busy}
          onPress={() => {
            if (password.length < 6) {
              setMessage("Use a password with at least 6 characters.");
            } else if (password !== confirmation) {
              setMessage("The passwords do not match.");
            } else {
              void update();
            }
          }}
        />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Verifying your link"
      subtitle="Please wait while we validate your password reset link."
      footer={
        <Text style={styles.footerText}>
          <Link href="/forgot-password" style={styles.link}>Request another link</Link>
        </Text>
      }
    >
      {params.error_description || configurationError || callbackError || message ? (
        <AuthMessage
          message={
            params.error_description ??
            configurationError ??
            callbackError ??
            message ??
            ""
          }
        />
      ) : !params.code && !user ? (
        <AuthMessage message="Open this page from the password reset link sent to your email." />
      ) : null}
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  footerText: { color: "#68738a", textAlign: "center", fontSize: 14 },
  link: { color: "#3157d5", fontWeight: "700" },
});
