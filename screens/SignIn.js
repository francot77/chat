import React, { useContext, useState,useEffect } from "react";
import { Alert,View, Text, Image, TextInput, Button, Modal,TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 
import Context from "../context/Context";
import { signIn, signUp } from "../firebase";
import { save,getValueFor,STORAGE_EMAIL,STORAGE_PW} from "../utils";
export default function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [mode, setMode] = useState("signIn");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [check, setCheck] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {
    theme: { colors },
  } = useContext(Context);




  async function handlePress(e,pw) {
    
    if (mode === "signUp") {
      if(repeatPassword !== password) {
        setModalText("Las contaseñas no coinciden")
        setModalVisible(true)
        return
      }
      signUp(e,pw).then((res)=>{
        
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
      signIn(e,pw).then((res)=>{
      
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

  if(check){
    save(STORAGE_EMAIL,String(email))
    save(STORAGE_PW,String(password))
  }
}

useEffect(() => {
  const fetchData = async ()=>{
    const rest = await Promise.all([getValueFor(STORAGE_EMAIL),getValueFor(STORAGE_PW)]) 
    
    if(rest[0]!==null&&rest[1]!==null){
      handlePress(rest[0],rest[1])
    }else setIsLoading(false)
    
  }
  fetchData()
}, []);

  if(isLoading) return(
    <View style={{justifyContent:"center",alignItems:"center",flex:1}}>
      <ActivityIndicator size={50} color="blue"/>
    </View>
  )
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
      <View style={{ marginTop: 20,width:"65%" }}>
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
        {mode ==="signUp"?<TextInput
        placeholder="Repeat Password"
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        secureTextEntry={true}
        style={{
          borderBottomColor: colors.primary,
          borderBottomWidth: 2,
          marginTop: 20
        }}
      />:null}
      {mode ==="signIn"?
      <View style={{flexDirection:"row",justifyContent:"space-between"}}>
<TouchableOpacity
        style={{ marginTop: 15, flexDirection:"column",alignItems:"center"}}
        onPress={()=>{
         setCheck(!check)
        }}
      >
        <Text style={{ color: colors.secondaryText }}>
         Recordar usuario
        </Text>
        {check?<Ionicons name="checkbox-sharp" size={24} color="black" />:<Ionicons name="square-outline" size={24} color="black" />}
      </TouchableOpacity>
        <TouchableOpacity
        style={{ marginTop: 15, flexDirection:"column",alignItems:"center"}}
        onPress={()=>{
          props.navigation.navigate('forgotpassword');
        }}
      >
        <Text style={{ color: colors.secondaryText }}>
         Olvidaste tu Contraseña?
        </Text>
        <Text style={{ color: colors.primary }}>
          Recuperar
        </Text>
      </TouchableOpacity>
          </View>
        :null}
        <View style={{ marginTop: 20 }}>
          
          <Button
            title={mode === "signUp" ? "Registrarse" : "Iniciar sesion"}
            disabled={!password || !email}
            color={colors.primary}
            onPress={()=>handlePress(email,password)}
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
