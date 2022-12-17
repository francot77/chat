import { useState,useContext } from "react";
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../firebase";
import { TextInput, Button, View,Text } from "react-native"
import Context from "../context/Context";
const ForgotPassword = ({navigation})=>{
const [email, setEmail] = useState("")
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const {
    theme: { colors },
  } = useContext(Context);

  async function resetPassword(email){
    await sendPasswordResetEmail(auth,email).then((res)=>{
        setSuccess("Email de recuperacion enviado con exito \n Revise su correo no deseado/spam")
        setTimeout(() => {
            navigation.navigate("signIn")
        }, 5000);
    }).catch(e=>{console.log(e.message)
        if(e.message==="Firebase: Error (auth/user-not-found)."){
            setError("Usuario erroneo o inexistente")
        setTimeout(() => {
            setError("")
        }, 2500);
        }
        if(e.message==="Firebase: Error (auth/invalid-email)."){
            setError("Email Invalido")
        setTimeout(() => {
            setError("")
        }, 2500);
        }
    
    })
  }
    return <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>

        <Text>Introduce tu email para recuperar tu contraseña</Text>
        {error!==""?<Text style={{fontSize:15,color:"red",margin:10}}>{error}</Text>:null}
        {success!==""?<Text style={{fontSize:15,color:"green",margin:10}}>{success}</Text>:null}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{
            width:200,margin:20,
            borderBottomColor: colors.primary,
            borderBottomWidth: 2}}
        />
        <Button
            title="Enviar Email"
            disabled={!email}
            color={colors.primary}
            onPress={()=>{
                resetPassword(email)
            }}
          />          
    </View>
}

export default ForgotPassword;