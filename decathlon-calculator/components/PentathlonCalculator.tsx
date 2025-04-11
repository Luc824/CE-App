import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { calculateEventPoints } from "@/utils/scoring";

interface EventResult {
  event: string;
  result: string;
  points: number;
}

const PENTATHLON_EVENTS = [
  { name: "60m Hurdles", placeholder: "8.20", type: "track" },
  { name: "High Jump", placeholder: "1.85", type: "field" },
  { name: "Shot Put", placeholder: "15.00", type: "field" },
  { name: "Long Jump", placeholder: "6.50", type: "field" },
  { name: "800m", placeholder: "2:10.00", type: "track" },
];

export default function PentathlonCalculator() {
  const [results, setResults] = useState<Record<string, EventResult>>(
    PENTATHLON_EVENTS.reduce(
      (acc, event) => ({
        ...acc,
        [event.name]: {
          event: event.name,
          result: "",
          points: 0,
        },
      }),
      {}
    )
  );

  const formatInputValue = (value: string, eventName: string): string => {
    const normalizedValue = value.replace(/,/g, ".");

    if (eventName === "800m") {
      const cleaned = normalizedValue.replace(/[^\d:.]/g, "");
      if (cleaned.includes(":")) {
        const [mins, secs] = cleaned.split(":");
        if (secs && secs.length > 2 && !secs.includes(".")) {
          return `${mins}:${secs.slice(0, 2)}.${secs.slice(2)}`;
        }
      }
      return cleaned;
    }

    const cleaned = normalizedValue.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return `${parts[0]}.${parts.slice(1).join("")}`;
    }
    return cleaned;
  };

  const handleInputChange = useCallback((eventName: string, value: string) => {
    const formattedValue = formatInputValue(value, eventName);
    setResults((prev) => ({
      ...prev,
      [eventName]: {
        ...prev[eventName],
        result: formattedValue,
        points: calculateEventPoints(eventName, formattedValue, "women"),
      },
    }));
  }, []);

  const totalPoints = Object.values(results).reduce(
    (sum, event) => sum + event.points,
    0
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <ThemedText style={styles.mainTitle}>
              Women's Pentathlon Points Calculator
            </ThemedText>
            {PENTATHLON_EVENTS.map((event) => (
              <View key={event.name} style={styles.eventContainer}>
                <View style={styles.eventHeader}>
                  <ThemedText style={styles.eventTitle}>
                    {event.name}
                  </ThemedText>
                  {results[event.name].result !== "" && (
                    <ThemedText style={styles.pointsText}>
                      {results[event.name].points}
                    </ThemedText>
                  )}
                </View>
                <TextInput
                  style={styles.input}
                  value={results[event.name].result}
                  onChangeText={(value) => handleInputChange(event.name, value)}
                  placeholder={event.placeholder}
                  placeholderTextColor="#999"
                  keyboardType="default"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  maxLength={event.name === "800m" ? 8 : 6}
                  autoCapitalize="none"
                />
              </View>
            ))}
            <View style={styles.totalContainer}>
              <ThemedText style={styles.totalText}>
                Total Points: {totalPoints || 0}
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    padding: 16,
    paddingTop: 60,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  eventContainer: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pointsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
  },
  totalContainer: {
    backgroundColor: "#D35400",
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  totalText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
