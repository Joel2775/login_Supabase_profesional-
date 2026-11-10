import { Redirect } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AuthButton, AuthMessage } from "@/presentation/components/auth-form";
import { useAuth } from "@/presentation/auth/auth-provider";

export default function HomeScreen() {
  const { isLoading, signOut, user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isLoading && !user) return <Redirect href="/sign-in" />;

  const logout = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await signOut();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not sign out. Try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>SIGNED IN</Text>
        <Text style={styles.title}>You are all set.</Text>
        <Text style={styles.subtitle}>{user?.email ?? "Google account"}</Text>
        {message ? <AuthMessage message={message} /> : null}
        <AuthButton
          title="Sign out"
          onPress={() => void logout()}
          loading={busy}
          disabled={busy}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f4f6fb",
  },
  card: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    padding: 28,
    borderRadius: 24,
    backgroundColor: "#ffffff",
  },
  eyebrow: {
    color: "#3157d5",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 12,
  },
  title: { color: "#172033", fontSize: 30, fontWeight: "700" },
  subtitle: { color: "#68738a", fontSize: 15, marginTop: 8, marginBottom: 24 },
});
