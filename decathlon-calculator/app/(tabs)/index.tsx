import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import DecathlonCalculator from "@/components/DecathlonCalculator";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <DecathlonCalculator />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
