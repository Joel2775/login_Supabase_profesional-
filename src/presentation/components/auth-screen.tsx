import type { PropsWithChildren, ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

interface AuthScreenProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  footer?: ReactNode;
}

export function AuthScreen({ title, subtitle, children, footer }: AuthScreenProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-water-50"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 36,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-md self-center rounded-[32px] border border-white bg-white p-7 shadow-lg shadow-blue-900/10">
          <View className="mb-6 flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-water-100">
              <Text className="text-2xl font-bold text-water-700">A</Text>
            </View>
            <View>
              <Text className="text-xs font-extrabold tracking-[2px] text-water-700">
                PORTAL SEGURO
              </Text>
              <Text className="mt-1 text-xs text-muted">Gestión de cuenta</Text>
            </View>
          </View>
          <Text className="text-3xl font-extrabold text-water-700">{title}</Text>
          <Text className="mb-7 mt-2 text-base leading-6 text-muted">
            {subtitle}
          </Text>
          {children}
          {footer ? (
            <View className="mt-6 items-center">
              <View className="mb-3 h-px w-full bg-water-100" />
              {footer}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
