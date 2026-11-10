import { Link } from "expo-router";
import * as Linking from "expo-linking";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import {
  AuthButton,
  AuthField,
  AuthMessage,
} from "@/presentation/components/auth-form";
import { AuthScreen } from "@/presentation/components/auth-screen";
import { useAuth } from "@/presentation/auth/auth-provider";
import { isValidEmail } from "@/presentation/utils/validation";

export default function ForgotPasswordScreen() {
  const { configurationError, sendPasswordResetEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(configurationError);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!isValidEmail(email.trim())) {
      setMessage("Enter a valid email address associated with your account.");
      return;
    }

    setBusy(true);
    setMessage(null);
    try {
      await sendPasswordResetEmail(
        email.trim(),
        Linking.createURL("reset-password"),
      );
      setSent(true);
      setMessage("If an account exists for that email, a password reset link is on its way.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not send the reset email.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthScreen
      title="Reset password"
      subtitle="We will email you a secure link to choose a new password."
      footer={
        <Text style={styles.footerText}>
          Remembered it? <Link href="/sign-in" style={styles.link}>Back to sign in</Link>
        </Text>
      }
    >
      {configurationError || message ? (
        <AuthMessage
          message={configurationError ?? message ?? ""}
          kind={!configurationError && sent ? "success" : "error"}
        />
      ) : null}
      <AuthField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        placeholder="you@example.com"
      />
      <AuthButton
        title="Send reset link"
        onPress={() => void submit()}
        loading={busy}
        disabled={busy}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  footerText: { color: "#68738a", textAlign: "center", fontSize: 14 },
  link: { color: "#3157d5", fontWeight: "700" },
});
