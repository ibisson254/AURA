import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { analyzePhoto, type PhotoAnalysis } from "../storage/analyze-photo";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; result: PhotoAnalysis };

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!id) {
      setState({ status: "error", message: "Sem id de foto." });
      return;
    }
    let alive = true;
    analyzePhoto(id)
      .then((result) => { if (alive) setState({ status: "ready", result }); })
      .catch((e) => { if (alive) setState({ status: "error", message: String(e?.message ?? e) }); });
    return () => { alive = false; };
  }, [id]);

  if (state.status === "loading") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text>A analisar…</Text>
      </View>
    );
  }
  if (state.status === "error") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <Text>Não foi possível analisar: {state.message}</Text>
      </View>
    );
  }

  const { fraction, advice } = state.result;
  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      {advice.length === 0 ? (
        <Text>Nada a apontar.</Text>
      ) : (
        advice.map((a) => <Text key={a.id}>{a.message}</Text>)
      )}
      <Text style={{ marginTop: 24, opacity: 0.5 }}>
        douramento: {fraction.toFixed(3)} (dev)
      </Text>
    </View>
  );
}
