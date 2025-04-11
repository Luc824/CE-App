import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  SafeAreaView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import PentathlonCalculator from "@/components/PentathlonCalculator";

const PENTATHLON_EVENTS = [
  [
    { name: "60m Hurdles", placeholder: "8.23", type: "track" },
    { name: "High Jump", placeholder: "1.92", type: "field" },
  ],
  [
    { name: "Shot Put", placeholder: "15.54", type: "field" },
    { name: "Long Jump", placeholder: "6.59", type: "field" },
  ],
  [
    { name: "800m", placeholder: "2:13.60", type: "track" },
    { name: "", placeholder: "", type: "none" }, // Empty slot for alignment
  ],
];

export default function PentathlonScreen() {
  return <PentathlonCalculator />;
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
    marginBottom: 8,
  },
  eventTitle: {
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
