import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

interface AuthFieldProps extends TextInputProps {
  label: string;
}

export function AuthField({ label, ...inputProps }: AuthFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        placeholderTextColor="#9aa3b5"
        style={styles.input}
        {...inputProps}
      />
    </View>
  );
}

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  secondary?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}

export function AuthButton({
  title,
  onPress,
  loading = false,
  secondary = false,
  disabled = false,
  icon,
}: AuthButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondaryButton,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? "#263553" : "#ffffff"} />
      ) : (
        <>
          {icon}
          <Text style={[styles.buttonText, secondary && styles.secondaryText]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

export function AuthMessage({
  message,
  kind = "error",
}: {
  message: string;
  kind?: "error" | "success" | "info";
}) {
  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.message,
        kind === "success" && styles.successMessage,
        kind === "info" && styles.infoMessage,
      ]}
    >
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 17 },
  label: {
    color: "#263553",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#dce1eb",
    borderRadius: 12,
    color: "#172033",
    fontSize: 15,
    backgroundColor: "#ffffff",
  },
  button: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#3157d5",
    marginTop: 6,
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    borderColor: "#dce1eb",
    borderWidth: 1,
  },
  buttonText: { color: "#ffffff", fontWeight: "700", fontSize: 15 },
  secondaryText: { color: "#263553" },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.6 },
  message: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff0f0",
    marginBottom: 16,
  },
  successMessage: { backgroundColor: "#eaf8ef" },
  infoMessage: { backgroundColor: "#edf2ff" },
  messageText: { color: "#35415a", fontSize: 13, lineHeight: 19 },
});
