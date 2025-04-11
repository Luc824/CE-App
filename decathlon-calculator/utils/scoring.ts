// Define types for our scoring constants
type EventType = "track" | "field";
type Gender = "men" | "women";

interface ScoringConstants {
  A: number;
  B: number;
  C: number;
  type: EventType;
  conversionFactor?: number;
}

// Constants for the scoring formulas
const DECATHLON_CONSTANTS: Record<string, ScoringConstants> = {
  "100m": { A: 25.4347, B: 18, C: 1.81, type: "track" },
  "Long Jump": {
    A: 0.14354,
    B: 220,
    C: 1.4,
    type: "field",
    conversionFactor: 100,
  },
  "Shot Put": { A: 51.39, B: 1.5, C: 1.05, type: "field" },
  "High Jump": {
    A: 0.8465,
    B: 75,
    C: 1.42,
    type: "field",
    conversionFactor: 100,
  },
  "400m": { A: 1.53775, B: 82, C: 1.81, type: "track" },
  "110m Hurdles": { A: 5.74352, B: 28.5, C: 1.92, type: "track" },
  "Discus Throw": { A: 12.91, B: 4, C: 1.1, type: "field" },
  "Pole Vault": {
    A: 0.2797,
    B: 100,
    C: 1.35,
    type: "field",
    conversionFactor: 100,
  },
  "Javelin Throw": { A: 10.14, B: 7, C: 1.08, type: "field" },
  "1500m": { A: 0.03768, B: 480, C: 1.85, type: "track" },
};

const MENS_HEPTATHLON_CONSTANTS: Record<string, ScoringConstants> = {
  "60m": { A: 58.015, B: 11.5, C: 1.81, type: "track" },
  "Long Jump": {
    A: 0.14354,
    B: 220,
    C: 1.4,
    type: "field",
    conversionFactor: 100,
  },
  "Shot Put": { A: 51.39, B: 1.5, C: 1.05, type: "field" },
  "High Jump": {
    A: 0.8465,
    B: 75,
    C: 1.42,
    type: "field",
    conversionFactor: 100,
  },
  "60m Hurdles": { A: 20.5173, B: 15.5, C: 1.92, type: "track" },
  "Pole Vault": {
    A: 0.2797,
    B: 100,
    C: 1.35,
    type: "field",
    conversionFactor: 100,
  },
  "1000m": { A: 0.08713, B: 305.5, C: 1.85, type: "track" },
};

const WOMENS_HEPTATHLON_CONSTANTS: Record<string, ScoringConstants> = {
  "100m Hurdles": { A: 9.23076, B: 26.7, C: 1.835, type: "track" },
  "High Jump": {
    A: 1.84523,
    B: 75,
    C: 1.348,
    type: "field",
    conversionFactor: 100,
  },
  "Shot Put": { A: 56.0211, B: 1.5, C: 1.05, type: "field" },
  "200m": { A: 4.99087, B: 42.5, C: 1.81, type: "track" },
  "Long Jump": {
    A: 0.188807,
    B: 210,
    C: 1.41,
    type: "field",
    conversionFactor: 100,
  },
  "Javelin Throw": { A: 15.9803, B: 3.8, C: 1.04, type: "field" },
  "800m": { A: 0.11193, B: 254, C: 1.88, type: "track" },
};

const WOMENS_PENTATHLON_CONSTANTS: Record<string, ScoringConstants> = {
  "60m Hurdles": { A: 20.0479, B: 17, C: 1.835, type: "track" },
  "High Jump": {
    A: 1.84523,
    B: 75,
    C: 1.348,
    type: "field",
    conversionFactor: 100,
  },
  "Shot Put": { A: 56.0211, B: 1.5, C: 1.05, type: "field" },
  "Long Jump": {
    A: 0.188807,
    B: 210,
    C: 1.41,
    type: "field",
    conversionFactor: 100,
  },
  "800m": { A: 0.11193, B: 254, C: 1.88, type: "track" },
};

// Function to convert time string to seconds
function timeToSeconds(time: string): number {
  // Handle minutes:seconds format (e.g., "4:36.11")
  if (time.includes(":")) {
    const [minutes, seconds] = time.split(":");
    return parseFloat(minutes) * 60 + parseFloat(seconds);
  }
  // Handle seconds format (e.g., "10.55")
  return parseFloat(time);
}

// Function to validate and convert field event measurement to centimeters
function convertToMeters(result: string): number {
  const meters = parseFloat(result);
  if (isNaN(meters) || meters < 0) {
    throw new Error("Invalid measurement");
  }
  return meters;
}

// Function to calculate points for field events (distance-based)
function calculateFieldPoints(
  event: string,
  result: string,
  gender: Gender
): number {
  if (!result) return 0;

  try {
    const meters = convertToMeters(result);
    if (isNaN(meters) || meters < 0) {
      return 0;
    }

    let constants: ScoringConstants | undefined;

    if (gender === "women") {
      constants =
        WOMENS_HEPTATHLON_CONSTANTS[event] ||
        WOMENS_PENTATHLON_CONSTANTS[event];
    } else if (gender === "men") {
      constants =
        MENS_HEPTATHLON_CONSTANTS[event] || DECATHLON_CONSTANTS[event];
    }

    if (!constants || constants.type !== "field") {
      return 0;
    }

    const { A, B, C, conversionFactor = 1 } = constants;

    // For jumping events (with conversionFactor), convert both the performance and the B value
    const convertedPerformance = meters * conversionFactor;
    const convertedB = B * (conversionFactor === 100 ? 1 : conversionFactor);

    const points = A * Math.pow(convertedPerformance - convertedB, C);
    return Math.floor(Math.max(0, points));
  } catch (error) {
    console.error(`Error calculating field points for ${event}:`, error);
    return 0;
  }
}

// Function to calculate points for track events (time-based)
function calculateTrackPoints(
  event: string,
  result: string,
  gender: Gender
): number {
  if (!result) return 0;

  try {
    const seconds = timeToSeconds(result);
    if (isNaN(seconds) || seconds <= 0) {
      return 0;
    }

    let constants: ScoringConstants | undefined;

    if (gender === "women") {
      constants =
        WOMENS_HEPTATHLON_CONSTANTS[event] ||
        WOMENS_PENTATHLON_CONSTANTS[event];
    } else if (gender === "men") {
      constants =
        MENS_HEPTATHLON_CONSTANTS[event] || DECATHLON_CONSTANTS[event];
    }

    if (!constants || constants.type !== "track") {
      return 0;
    }

    const { A, B, C } = constants;
    const points = A * Math.pow(B - seconds, C);
    return Math.floor(Math.max(0, points));
  } catch (error) {
    console.error(`Error calculating track points for ${event}:`, error);
    return 0;
  }
}

// Main function to calculate points for any event
export function calculateEventPoints(
  event: string,
  result: string,
  gender: Gender
): number {
  if (!result) return 0;

  let constants: ScoringConstants | undefined;

  if (gender === "women") {
    constants =
      WOMENS_HEPTATHLON_CONSTANTS[event] || WOMENS_PENTATHLON_CONSTANTS[event];
  } else if (gender === "men") {
    constants = MENS_HEPTATHLON_CONSTANTS[event] || DECATHLON_CONSTANTS[event];
  }

  if (!constants) return 0;

  try {
    return constants.type === "track"
      ? calculateTrackPoints(event, result, gender)
      : calculateFieldPoints(event, result, gender);
  } catch (error) {
    console.error(`Error calculating points for ${event}:`, error);
    return 0;
  }
}

// Function to format time for display
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = (seconds % 60).toFixed(2);
  return minutes > 0
    ? `${minutes}:${remainingSeconds.padStart(5, "0")}`
    : remainingSeconds;
}
