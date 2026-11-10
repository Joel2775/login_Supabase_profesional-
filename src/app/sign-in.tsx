import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  AuthButton,
  AuthField,
  AuthMessage,
} from "@/presentation/components/auth-form";
import { AuthScreen } from "@/presentation/components/auth-screen";
import { useAuth } from "@/presentation/auth/auth-provider";
import { isValidEmail } from "@/presentation/utils/validation";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Could not sign in. Try again.";
}

export default function SignInScreen() {
  const { configurationError, signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"email" | "google" | null>(null);
  const [message, setMessage] = useState<string | null>(configurationError);

  const submit = async () => {
    if (!isValidEmail(email.trim()) || !password) {
      setMessage("Enter a valid email address and password.");
      return;
    }

    setBusy("email");
    setMessage(null);
    try {
      await signIn(email.trim(), password);
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  const google = async () => {
    setBusy("google");
    setMessage(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to continue to your account."
      footer={
        <Text style={styles.footerText}>
          New here? <Link href="/sign-up" style={styles.link}>Create an account</Link>
        </Text>
      }
    >
      {configurationError || message ? (
        <AuthMessage message={configurationError ?? message ?? ""} />
      ) : null}
      <AuthField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        placeholder="you@example.com"
        returnKeyType="next"
      />
      <AuthField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        textContentType="password"
        autoComplete="current-password"
        placeholder="Your password"
        onSubmitEditing={() => void submit()}
      />
      <View style={styles.forgot}>
        <Link href="/forgot-password" style={styles.link}>
          Forgot password?
        </Link>
      </View>
      <AuthButton
        title="Sign in"
        onPress={() => void submit()}
        loading={busy === "email"}
        disabled={busy !== null}
      />
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>
      <AuthButton
        title="Continue with Google"
        onPress={() => void google()}
        loading={busy === "google"}
        disabled={busy !== null}
        secondary
        icon={<Text style={styles.googleIcon}>G</Text>}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  footerText: { color: "#68738a", textAlign: "center", fontSize: 14 },
  link: { color: "#3157d5", fontWeight: "700" },
  forgot: { alignItems: "flex-end", marginTop: -4, marginBottom: 16 },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 20,
  },
  dividerLine: { height: 1, flex: 1, backgroundColor: "#e7eaf1" },
  dividerText: { color: "#919bad", fontSize: 11, fontWeight: "700" },
  googleIcon: { color: "#4285f4", fontSize: 17, fontWeight: "700" },
});
