import { Link, Redirect, type Href } from "expo-router";
import type { PropsWithChildren, ReactNode } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/presentation/auth/auth-provider";
import { LottieState } from "@/presentation/components/lottie-state";
import { useAcademic } from "./academic-provider";

export const colors = {
  background: "#F3F6FC",
  surface: "#FFFFFF",
  text: "#263973",
  muted: "#64748B",
  primary: "#0511F2",
  water: "#117DBF",
  gold: "#D9B64E",
  danger: "#D92534",
  border: "#C9E2F1",
  errorBackground: "#FEF2F2",
  success: "#117DBF",
  successBackground: "#E5F0F8",
  soft: "#E5F0F8",
};

interface PageProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  backHref?: Href;
  headerAction?: ReactNode;
}

export function AcademicPage({
  title,
  subtitle,
  backHref,
  headerAction,
  children,
}: PageProps) {
  const { isLoading, user } = useAuth();
  const { configurationError } = useAcademic();

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-water-50"
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <LottieState type="loading" size={76} />
      </SafeAreaView>
    );
  }
  if (!user) return <Redirect href="/sign-in" />;

  return (
    <SafeAreaView
      className="flex-1 bg-water-50"
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <KeyboardAvoidingView
        className="flex-1"
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            width: "100%",
            maxWidth: 760,
            alignSelf: "center",
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {backHref ? (
            <Link
              href={backHref}
              className="mb-4 self-start rounded-full border border-water-100 bg-white px-4 py-2 text-sm font-bold text-water-700 shadow-sm shadow-blue-900/5"
            >
              ‹ Volver
            </Link>
          ) : null}
          <View className="mb-5 flex-row items-start justify-between gap-3 rounded-[28px] bg-water-700 p-6 shadow-lg shadow-blue-900/15">
            <View className="flex-1">
              <Text className="mb-2 text-[10px] font-extrabold tracking-[2px] text-water-200">
                PORTAL DE GESTIÓN
              </Text>
              <Text className="text-3xl font-extrabold text-white">{title}</Text>
              {subtitle ? (
                <Text className="mt-2 text-sm leading-5 text-water-100">
                  {subtitle}
                </Text>
              ) : null}
            </View>
            {headerAction}
          </View>
          {configurationError ? (
            <Notice message={configurationError} kind="error" />
          ) : null}
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
}) {
  const variantClass =
    variant === "secondary"
      ? "border border-water-100 bg-white"
      : variant === "danger"
        ? "border border-red-100 bg-red-50"
        : "bg-action shadow-md shadow-blue-900/10";
  const textClass =
    variant === "danger"
      ? "text-alert"
      : variant === "secondary"
        ? "text-water-700"
        : "text-white";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      className={`mt-2 min-h-12 flex-row items-center justify-center rounded-2xl px-4 active:opacity-80 ${variantClass} ${
        disabled || loading ? "opacity-55" : ""
      }`}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading ? (
        <LottieState type="loading" size={28} />
      ) : (
        <Text className={`text-sm font-extrabold ${textClass}`}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-bold text-water-700">{label}</Text>
      <TextInput
        placeholderTextColor="#94a3b8"
        className={`min-h-12 rounded-2xl border border-water-100 bg-water-50 px-4 text-[15px] text-water-700 ${
          props.multiline ? "min-h-28 pt-3" : ""
        }`}
        {...props}
      />
    </View>
  );
}

export function Card({
  children,
  onPress,
  className = "",
}: PropsWithChildren<{ onPress?: () => void; className?: string }>) {
  const cardClassName = `mb-3 rounded-[24px] border border-white bg-white shadow-md shadow-blue-900/10 ${
    onPress ? "active:opacity-80" : ""
  } ${className}`;
  const content = (
    <View className="gap-2 p-5">
      {children}
    </View>
  );

  return onPress ? (
    <Pressable
      accessibilityRole="button"
      className={cardClassName}
      onPress={onPress}
    >
      {content}
    </Pressable>
  ) : (
    <View className={cardClassName}>{content}</View>
  );
}

export function Notice({
  message,
  kind = "info",
}: {
  message: string;
  kind?: "info" | "error" | "success";
}) {
  const kindClass =
    kind === "error"
      ? "border-red-100 bg-red-50"
      : kind === "success"
        ? "border-water-100 bg-water-100"
        : "border-water-100 bg-white";

  return (
    <View
      accessibilityRole="alert"
      className={`mb-4 flex-row items-center gap-2 rounded-2xl border px-3 py-2 ${kindClass}`}
    >
      {kind !== "info" ? (
        <LottieState type={kind === "success" ? "success" : "error"} size={30} />
      ) : null}
      <Text className="flex-1 text-sm leading-5 text-water-700">{message}</Text>
    </View>
  );
}

export function LoadingState({ label = "Cargando…" }: { label?: string }) {
  return (
    <View className="my-4 flex-row items-center justify-center gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-blue-900/5">
      <LottieState type="loading" size={38} />
      <Text className="text-sm font-medium text-muted">{label}</Text>
    </View>
  );
}

export function EmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <Card>
      <Text className={uiStyles.cardTitle}>{title}</Text>
      <Text className="text-sm leading-5 text-muted">{subtitle}</Text>
    </Card>
  );
}

export function confirmDestructiveAction(
  title: string,
  message: string,
  onConfirm: () => void,
): void {
  Alert.alert(title, message, [
    { text: "Cancelar", style: "cancel" },
    { text: "Eliminar", style: "destructive", onPress: onConfirm },
  ]);
}

export const uiStyles = {
  row: "flex-row items-center gap-3",
  rowBetween: "flex-row items-center justify-between gap-3",
  sectionTitle: "mb-2 mt-4 text-lg font-extrabold text-water-700",
  cardTitle: "text-base font-extrabold text-water-700",
  body: "text-sm leading-5 text-muted",
  tiny: "text-xs font-medium text-muted",
};
