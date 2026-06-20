import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Accelerometer } from "expo-sensors";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { useRouter } from "expo-router";
import { newPhotoId } from "../storage/ids";
import { savePhoto, saveThumbnail } from "../storage/photos";

export default function CaptureScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Ativar acelerômetro
  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const subscription = Accelerometer.addListener((data) => {
      setAccelerometerData(data);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  if (!permission) {
    // Permissão ainda carregando
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!permission.granted) {
    // Permissão não concedida
    return (
      <View style={[styles.container, styles.center, { padding: 20 }]}>
        <Text style={styles.permissionText}>
          A AURA precisa de acesso à câmara para analisar os seus pratos.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { x, y, z } = accelerometerData;

  // Celular na horizontal, virado para baixo (z dominante e positivo)
  // Tolerância de inclinação em X e Y: <= 0.25G
  const isHorizontal = z > 0.85 && Math.abs(x) < 0.25 && Math.abs(y) < 0.25;

  const handleCapture = async () => {
    if (isCapturing || !isHorizontal || !cameraRef.current) return;

    try {
      setIsCapturing(true);

      // 1. Capturar foto temporária
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1.0,
      });

      if (!photo?.uri) {
        throw new Error("Não foi possível obter a URI da imagem capturada.");
      }

      // 2. Gerar ID (UUID)
      const id = newPhotoId();

      // 3. Salvar foto original permanentemente no filesystem
      const savedPhotoUri = await savePhoto(photo.uri, id);
      console.log("[Capture] Foto original salva:", savedPhotoUri);

      // 4. Gerar Thumbnail de ~200px e aguardar escrita antes de navegar
      const thumbResult = await manipulateAsync(
        savedPhotoUri,
        [{ resize: { width: 200 } }],
        { compress: 0.8, format: SaveFormat.JPEG }
      );
      await saveThumbnail(thumbResult.uri, id);

      // 5. Navegar para o ecrã de resultado com o id da foto
      router.push({ pathname: "/result", params: { id } });
    } catch (error) {
      console.error("[Capture] Erro durante a captura:", error);
      setIsCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFillObject} ref={cameraRef} />

      {/* Overlay da moldura guia */}
      <View style={styles.overlayContainer} pointerEvents="box-none">
        {/* Moldura circular/quadrada guia para o prato */}
        <View style={[styles.guideFrame, isHorizontal ? styles.guideActive : styles.guideInactive]}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>
      </View>

      {/* Informações de Status e Controles */}
      <View style={styles.controlsContainer}>
        {/* Status do Acelerômetro */}
        <View style={[styles.statusBadge, isHorizontal ? styles.badgeActive : styles.badgeInactive]}>
          <Text style={styles.statusText}>
            {isHorizontal ? "Alinhamento Correto ✓" : "Posicione o telemóvel na horizontal"}
          </Text>
          {!isHorizontal && (
            <Text style={styles.subStatusText}>
              Mantenha o ecrã virado para cima (z: {z.toFixed(2)})
            </Text>
          )}
        </View>

        {/* Botão de Disparo */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.captureButton, (!isHorizontal || isCapturing) && styles.captureButtonDisabled]}
            onPress={handleCapture}
            disabled={!isHorizontal || isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator color="#000000" size="small" />
            ) : (
              <View style={[styles.captureInner, isHorizontal ? styles.innerActive : styles.innerInactive]} />
            )}
          </TouchableOpacity>
        </View>

        {/* Botão Cancelar */}
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "System",
  },
  permissionButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 14,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  guideFrame: {
    width: 280,
    height: 280,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 140, // Formato circular sugerindo o prato
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  guideActive: {
    borderColor: "#10B981",
    borderWidth: 2,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
  },
  guideInactive: {
    borderColor: "#EF4444",
  },
  cornerTL: {
    position: "absolute",
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "transparent",
  },
  cornerTR: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "transparent",
  },
  cornerBL: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "transparent",
  },
  cornerBR: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "transparent",
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  statusBadge: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  badgeActive: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  badgeInactive: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  statusText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  subStatusText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  actionRow: {
    marginVertical: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  captureButtonDisabled: {
    borderColor: "rgba(255, 255, 255, 0.3)",
    opacity: 0.6,
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  innerActive: {
    backgroundColor: "#10B981",
  },
  innerInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
