import React, { useContext, useState } from "react";
import { Alert,View, Text, Image, TextInput, Button, Modal,TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import Context from "../context/Context";

import { signIn, signUp } from "../firebase";
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signIn");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const {
    theme: { colors },
  } = useContext(Context);

  async function handlePress() {
    
    if (mode === "signUp") {
      signUp(email,password).then((res)=>{
        
        switch (res) {
          case "invalid email!":
            setModalVisible(true)
            setModalText("Invalid email!")
            break;
          case "Email already in use !":
          setModalVisible(true)  
          setModalText("Email already in use !")
          case "auth/weak-password":
          setModalVisible(true)  
          setModalText("Password must have more than 6 characters")
            default:
            break;
        }
      })
    }
    if (mode === "signIn") {
      signIn(email,password).then((res)=>{
      
        switch (res) {
          case "auth/invalid-email":
            setModalVisible(true)
            setModalText("Email invalido!")
            break;
          case "auth/wrong-password":
          setModalVisible(true)  
          setModalText("Usuario inexistente o password incorrecto")
          case "auth/user-not-found":
          setModalVisible(true)  
          setModalText("Usuario inexistente o password incorrecto")
            default:
            break;
        }
      })
  }
}
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.white,
      }}
    >
      <Text
        style={{ color: colors.foreground, fontSize: 24, marginBottom: 20 }}
      >
        Bienvenido a Online English MBG
      </Text>
      <Image
        source={require("../assets/welcome-img.png")}
        style={{ width: 180, height: 180 }}
        resizeMode="cover"
      />
      <View style={{ marginTop: 20 }}>
      <View style={{alignItems:"center"}}>
        
        {mode === "signUp"
              ? <Text style={{fontSize:25,fontWeight:"400",marginBottom:7}}>Registrarse</Text>
              : <Text style={{fontSize:25,fontWeight:"400",marginBottom:7}}>Iniciar sesion</Text>}
        </View>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{
            borderBottomColor: colors.primary,
            borderBottomWidth: 2}}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={{
            borderBottomColor: colors.primary,
            borderBottomWidth: 2,
            marginTop: 20
          }}
        />
        <View style={{ marginTop: 20 }}>
          <Button
            title={mode === "signUp" ? "Registrarse" : "Iniciar sesion"}
            disabled={!password || !email}
            color={colors.primary}
            onPress={handlePress}
          />
        </View>
        <TouchableOpacity
          style={{ marginTop: 15, flexDirection:"row" }}
          onPress={() =>
            mode === "signUp" ? setMode("signIn") : setMode("signUp")
          }
        >
          <Text style={{ color: colors.secondaryText }}>
            {mode === "signUp"
              ? "Ya tienes una cuenta? "
              : "No tienes cuenta? "}
          </Text>
          <Text style={{ color: colors.primary }}>
            {mode === "signUp"
              ? "Inicia sesion"
              : "Registrate"}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
      transparent={true}
      visible={modalVisible}
      ><View style={{flex:1,justifyContent:"center",alignItems:"center"}}>

        <View style={{
          justifyContent:"center",
          alignItems:"center",paddingHorizontal:55,margin:15,width:"75%",
          borderRadius:55,
          borderWidth:5,
          borderColor:colors.primary,
          backgroundColor:"whitesmoke"
        }}>
          <Text style={{fontSize:25,fontWeight:"400",marginTop:15}}>{modalText}</Text>
          <TouchableOpacity
          style={{
            justifyContent:"center",
            alignItems:"center",
            padding:15,marginTop:25,marginBottom:15,
            borderRadius:25,
            borderWidth:3,
            borderColor:"black",
            backgroundColor:colors.primary
          }}
          onPress={()=>{
            setModalVisible(false)
          }}
          >
            <Ionicons name="thumbs-up" size={24} color="white" />
          </TouchableOpacity>
          </View>
       </View>
      </Modal>
    </View>
  );
}
