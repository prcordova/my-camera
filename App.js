import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";
import { useEffect, useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { shareContactAsync } from "expo-contacts";
export default function App() {
  const camRef = useRef();
  const [type, setType] = useState(CameraType.back);
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text> Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        {" "}
        Permission for camera not granted. Please accept it on settings
      </Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };
    let newPhoto = await camRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    setOpen(true);
  };

  if (photo) {
    let sharePhoto = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };
    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };
    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <View style={styles.buttonImageCapturedContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={sharePhoto}>
            <FontAwesome name="share" size={23} color="red"></FontAwesome>
          </TouchableOpacity>

          {hasMediaLibraryPermission ? (
            <TouchableOpacity style={styles.saveButton} onPress={savePhoto}>
              <FontAwesome name="save" size={23} color="red"></FontAwesome>
            </TouchableOpacity>
          ) : undefined}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setPhoto(undefined);
            }}
          >
            <FontAwesome name="close" size={23} color="red"></FontAwesome>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  async function saveToGallery() {
    if (capturedPhoto) {
      try {
        const asset = await MediaLibrary.createAssetAsync(capturedPhoto);
        await MediaLibrary.createAlbumAsync("ExpoCameraExample", asset, false);
        alert("Foto salva na galeria com sucesso!");
      } catch (error) {
        alert("Erro ao salvar a foto na galeria: " + error);
      }
    }
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera ref={camRef} style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonFlip}
            onPress={toggleCameraType}
          >
            <FontAwesome name="exchange" size={23} color="red"></FontAwesome>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnCapture} onPress={takePic}>
            <FontAwesome name="camera" size={23} color="white"></FontAwesome>
          </TouchableOpacity>
        </View>
      </Camera>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: 200,
  },
  buttonContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "space-between",
  },
  buttonImageCapturedContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "space-between",
  },
  btnCapture: {
    position: "absolute",
    bottom: 50,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF0000",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  shareButton: {
    position: "absolute",
    bottom: 50,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  closeButton: {
    position: "absolute",
    bottom: 50,
    left: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  saveButton: {
    position: "absolute",
    bottom: 50,

    right: 130,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  buttonFlip: {
    position: "absolute",
    bottom: 50,
    left: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },

  imgPhoto: {
    width: "100%",
    borderRadius: 20,
    height: 400,
  },

  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
