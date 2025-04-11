import React from "react";
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from "react-native";
import { ThemedText } from "./ThemedText";
import { useRouter } from "expo-router";

export default function MensEvents() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>Men's Events</ThemedText>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/decathlon")}
          >
            <ThemedText style={styles.buttonText}>Decathlon</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { marginTop: 20 }]}
            onPress={() => router.push("/mens-heptathlon")}
          >
            <ThemedText style={styles.buttonText}>Heptathlon</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    padding: 20,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    lineHeight: 34,
  },
  buttonContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#D35400",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 200,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
