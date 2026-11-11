import LottieView from "lottie-react-native";

const animations = {
  loading: require("@/assets/animations/water-loading.json"),
  success: require("@/assets/animations/success.json"),
  error: require("@/assets/animations/error.json"),
};

export function LottieState({
  type,
  size = 36,
}: {
  type: keyof typeof animations;
  size?: number;
}) {
  return (
    <LottieView
      autoPlay
      loop={type === "loading"}
      source={animations[type]}
      style={{ width: size, height: size }}
      webStyle={{ width: size, height: size }}
    />
  );
}
