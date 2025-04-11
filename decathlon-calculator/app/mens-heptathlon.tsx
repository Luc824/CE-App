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
import { ThemedText } from "@/components/ThemedText";
import { calculateEventPoints } from "@/utils/scoring";

interface EventResult {
  event: string;
  result: string;
  points: number;
}

const HEPTATHLON_EVENTS = [
  [
    { name: "60m", placeholder: "6.75", type: "track" },
    { name: "Long Jump", placeholder: "7.80", type: "field" },
  ],
  [
    { name: "Shot Put", placeholder: "16.00", type: "field" },
    { name: "High Jump", placeholder: "2.05", type: "field" },
  ],
  [
    { name: "60m Hurdles", placeholder: "7.90", type: "track" },
    { name: "Pole Vault", placeholder: "5.45", type: "field" },
  ],
  [
    { name: "1000m", placeholder: "2:30.00", type: "track" },
    { name: "", placeholder: "", type: "none" },
  ],
];

export default function MensHeptathlonCalculator() {
  const [results, setResults] = useState<Record<string, EventResult>>(
    HEPTATHLON_EVENTS.flat()
      .filter((event) => event.type !== "none")
      .reduce(
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

    if (eventName === "1000m") {
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
        points: calculateEventPoints(eventName, formattedValue, "men"),
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
              Men's Indoor Heptathlon Points Calculator
            </ThemedText>
            {HEPTATHLON_EVENTS.map((pair, pairIndex) => (
              <View key={pairIndex} style={styles.eventPairContainer}>
                <View style={styles.columnContainer}>
                  <View style={styles.eventContainer}>
                    <View style={styles.eventHeader}>
                      <ThemedText style={styles.eventTitle}>
                        {pair[0].name}
                      </ThemedText>
                      {results[pair[0].name]?.result !== "" && (
                        <ThemedText style={styles.pointsText}>
                          {results[pair[0].name].points}
                        </ThemedText>
                      )}
                    </View>
                    <TextInput
                      style={styles.input}
                      value={results[pair[0].name]?.result}
                      onChangeText={(value) =>
                        handleInputChange(pair[0].name, value)
                      }
                      placeholder={pair[0].placeholder}
                      placeholderTextColor="#999"
                      keyboardType="default"
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                      maxLength={pair[0].name === "1000m" ? 8 : 6}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {pair[1].type !== "none" && (
                  <View style={styles.columnContainer}>
                    <View style={styles.eventContainer}>
                      <View style={styles.eventHeader}>
                        <ThemedText style={styles.eventTitle}>
                          {pair[1].name}
                        </ThemedText>
                        {results[pair[1].name]?.result !== "" && (
                          <ThemedText style={styles.pointsText}>
                            {results[pair[1].name].points}
                          </ThemedText>
                        )}
                      </View>
                      <TextInput
                        style={styles.input}
                        value={results[pair[1].name]?.result}
                        onChangeText={(value) =>
                          handleInputChange(pair[1].name, value)
                        }
                        placeholder={pair[1].placeholder}
                        placeholderTextColor="#999"
                        keyboardType="default"
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                        maxLength={pair[1].name === "1000m" ? 8 : 6}
                        autoCapitalize="none"
                      />
                    </View>
                  </View>
                )}
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
  eventPairContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  columnContainer: {
    flex: 1,
    marginHorizontal: 8,
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
