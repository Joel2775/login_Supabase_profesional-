import { Link, Redirect } from "expo-router";
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

export default function SignUpScreen() {
  const { configurationError, isLoading, signUp, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(configurationError);
  const [success, setSuccess] = useState(false);

  if (!isLoading && user) return <Redirect href="/home" />;

  const submit = async () => {
    if (!isValidEmail(email.trim()) || password.length < 6) {
      setMessage("Enter a valid email and a password with at least 6 characters.");
      return;
    }
    if (password !== confirmation) {
      setMessage("The passwords do not match.");
      return;
    }

    setBusy(true);
    setMessage(null);
    try {
      const createdUser = await signUp(email.trim(), password);
      if (createdUser) {
        setSuccess(true);
        setMessage("Your account is ready. You can now sign in.");
      } else {
        setSuccess(true);
        setMessage("Account created. Check your email to confirm it before signing in.");
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not create the account.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthScreen
      title="Create account"
      subtitle="Use your email and a secure password to get started."
      footer={
        <Text style={styles.footerText}>
          Already have an account? <Link href="/sign-in" style={styles.link}>Sign in</Link>
        </Text>
      }
    >
      {configurationError || message ? (
        <AuthMessage
          message={configurationError ?? message ?? ""}
          kind={!configurationError && success ? "success" : "error"}
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
      <AuthField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="newPassword"
        autoComplete="new-password"
        placeholder="At least 6 characters"
      />
      <AuthField
        label="Confirm password"
        value={confirmation}
        onChangeText={setConfirmation}
        secureTextEntry
        textContentType="newPassword"
        autoComplete="new-password"
        placeholder="Enter your password again"
        onSubmitEditing={() => void submit()}
      />
      <AuthButton
        title="Create account"
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
