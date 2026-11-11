import { Link, Redirect } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
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
  const { configurationError, signIn, signInWithGoogle, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"email" | "google" | null>(null);
  const [message, setMessage] = useState<string | null>(configurationError);

  if (user) return <Redirect href="/home" />;

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
        <Text className="text-center text-sm text-muted">
          New here?{" "}
          <Link href="/sign-up" className="font-extrabold text-action">
            Create an account
          </Link>
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
      <View className="mb-3 mt-1 items-end">
        <Link href="/forgot-password" className="font-bold text-action">
          Forgot password?
        </Link>
      </View>
      <AuthButton
        title="Sign in"
        onPress={() => void submit()}
        loading={busy === "email"}
        disabled={busy !== null}
      />
      <View className="my-5 flex-row items-center gap-3">
        <View className="h-px flex-1 bg-water-100" />
        <Text className="text-xs font-bold tracking-widest text-muted">OR</Text>
        <View className="h-px flex-1 bg-water-100" />
      </View>
      <AuthButton
        title="Continue with Google"
        onPress={() => void google()}
        loading={busy === "google"}
        disabled={busy !== null}
        secondary
        icon={
          <Text className="text-lg font-extrabold text-[#4285F4]">G</Text>
        }
      />
    </AuthScreen>
  );
}
