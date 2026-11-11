import type { ReactNode } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { LottieState } from "./lottie-state";

interface AuthFieldProps extends TextInputProps {
  label: string;
}

export function AuthField({ label, ...inputProps }: AuthFieldProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-bold text-water-700">{label}</Text>
      <TextInput
        autoCapitalize="none"
        placeholderTextColor="#94a3b8"
        className="min-h-14 rounded-2xl border border-water-100 bg-water-50 px-4 text-base text-water-700"
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
      className={`mt-2 min-h-14 flex-row items-center justify-center gap-2 rounded-2xl px-4 shadow-md shadow-blue-900/10 active:opacity-80 ${
        secondary
          ? "border border-water-100 bg-white"
          : "bg-action"
      } ${(disabled || loading) ? "opacity-55" : ""}`}
    >
      {loading ? (
        <LottieState type="loading" size={30} />
      ) : (
        <>
          {icon}
          <Text
            className={`text-base font-bold ${
              secondary ? "text-water-700" : "text-white"
            }`}
          >
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
      className={`mb-4 flex-row items-center gap-2 rounded-2xl border px-3 py-2 ${
        kind === "success"
          ? "border-emerald-100 bg-emerald-50"
          : kind === "info"
            ? "border-water-100 bg-water-50"
            : "border-red-100 bg-red-50"
      }`}
    >
      {kind !== "info" ? (
        <LottieState type={kind === "success" ? "success" : "error"} size={30} />
      ) : null}
      <Text className="flex-1 text-sm leading-5 text-water-700">{message}</Text>
    </View>
  );
}
