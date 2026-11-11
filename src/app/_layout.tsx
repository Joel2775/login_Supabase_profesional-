import "../global.css";
import { Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { AuthProvider } from "@/presentation/auth/auth-provider";
import { AcademicProvider } from "@/presentation/academic/academic-provider";

WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  return (
    <AuthProvider>
      <AcademicProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AcademicProvider>
    </AuthProvider>
  );
}
