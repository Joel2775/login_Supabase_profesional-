import { Redirect } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "@/presentation/auth/auth-provider";

export default function Index() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center bg-water-50"
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F3F6FC",
        }}
      >
        <ActivityIndicator size="large" color="#117DBF" />
        <Text className="mt-4 text-base font-bold text-water-700">
          Iniciando sesión…
        </Text>
      </View>
    );
  }

  return <Redirect href={user ? "/home" : "/sign-in"} />;
}
