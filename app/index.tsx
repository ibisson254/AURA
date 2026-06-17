import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AURA</Text>
      <Text style={styles.subtitle}>Estúdio de Empratamento Inteligente</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/capture")}
      >
        <Text style={styles.buttonText}>Fotografar prato</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 8,
    marginBottom: 48,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
