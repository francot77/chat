import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import GlobalContext from "../context/Context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { pickImage, askForPermission, uploadImage } from "../utils";
import { auth, db } from "../firebase";
import { updateProfile } from "@firebase/auth";
import { doc,query,where,onSnapshot,collection, setDoc } from "@firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function UserProfile() {
  const [displayName, setDisplayName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatsToUpdate, setChatsToUpdate] = useState(null);
  const navigation = useNavigation();
  const { currentUser } = auth;

  useEffect(() => {
    (async () => {
      const status = await askForPermission();
      setPermissionStatus(status);
      
      if(currentUser.photoURL) setSelectedImage(currentUser.photoURL)
    })();
  }, []);

  const {rooms,
    theme: { colors },
  } = useContext(GlobalContext);

  //console.log(currentUser.photoURL)
  async function handlePress() {
    setIsLoading(true)
    const user = auth.currentUser;
    let photoURL;   
    if (selectedImage) {
      const { url } = await uploadImage(
        selectedImage,
        `images/${user.uid}`,
        "profilePicture"
      );
      photoURL = url;
    }
    const userData = {
      displayName,
    };
    if (photoURL) {
      userData.photoURL = photoURL;
    }
    if(photoURL){
    rooms.map(async(e)=>{
        let newdata;
        newdata = e.participants;
        newdata.map(e=>{
            if(e.email==currentUser.email){
                e.displayName = displayName
                e.photoURL = photoURL;
            }
        })
        await setDoc(doc(db,"rooms",e.id),{participants:newdata},{merge:true})
        
    })}

    await Promise.all([
      updateProfile(user, userData),
      setDoc(doc(db, "users", user.uid), { ...userData, uid: user.uid },{merge:true}),
    ]).then(()=>{
        setIsLoading(false)
    }).catch((error)=>{
      console.log(error)});
  }

  const handleChange = () =>{
    navigation.navigate("teacher");
  }
  async function handleProfilePicture() {
    const result = await pickImage();
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  if (!permissionStatus) {
    return <Text>Loading</Text>;
  }
  if (permissionStatus !== "granted") {
    return <Text>You need to allow this permission</Text>;
  }
  if (isLoading) return (<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
    <ActivityIndicator size={55} color={colors.primary}/>
  </View>)
  return (
    <React.Fragment>
      <StatusBar style="auto" />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          paddingTop: Constants.statusBarHeight + 20,
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 22, color: colors.foreground }}>
          Profile Info
        </Text>
        <Text style={{ fontSize: 14, color: colors.text, marginTop: 20 }}>
          Aqui puedes cambiar tu nombre o foto de perfil
        </Text>
        <TouchableOpacity
          onPress={handleProfilePicture}
          style={{
            marginTop: 30,
            borderRadius: 120,
            width: 120,
            height: 120,
            backgroundColor: colors.background,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!selectedImage ? (
            <MaterialCommunityIcons
              name="camera-plus"
              color={colors.iconGray}
              size={45}
            />
          ) : (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "100%", height: "100%", borderRadius: 120 }}
            />
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Escribe tu nuevo nombre"
          value={displayName}
          onChangeText={setDisplayName}
          style={{
            borderBottomColor: colors.primary,
            marginTop: 40,
            borderBottomWidth: 2,
            width: "100%",
          }}
        />
        <View style={{ marginTop: "auto" }}>
            <Button
            title="Cambiar Profesora"
            color={colors.primary}
            onPress={handleChange}
            />
            </View>
        <View style={{ marginTop: "auto" }}>
          <Button
            title="Actualizar perfil"
            color={colors.secondary}
            onPress={(handlePress)}
            disabled={!displayName}
          />
        </View>
      </View>
    </React.Fragment>
  );
}
