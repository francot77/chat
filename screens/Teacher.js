import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { nanoid } from "nanoid";
import { uploadImage } from "../utils";
import {
  View,
  Text,
  Image,
  Button,
  ActivityIndicator
} from "react-native";
import Constants from "expo-constants";
import GlobalContext from "../context/Context";
import { auth, db } from "../firebase";

import { doc, setDoc,updateDoc, query, where,collection,onSnapshot } from "@firebase/firestore";
import { useNavigation } from "@react-navigation/native";
let data = []
let images = []

const randomId = nanoid();
const userIcon = "https://firebasestorage.googleapis.com/v0/b/englishchat-8f15f.appspot.com/o/images%2Fuser-icon.png?alt=media&token=9e46037b-0bbd-48ed-b806-0fd14010eca4"

export default function Teacher() {
const { unfilteredRooms, rooms ,theme: { colors } } = useContext(GlobalContext);
 const [selected, setSelected] = useState("");
 const [teacherName, setTeacherName] = useState("");
 const [users, setUsers] = useState([]);
 const [user, setUser] = useState(null);
 const [disable, setDisable] = useState(true);
 const [isLoading, setIsLoading] = useState(false);
 const [image, setImage] = useState("");
 const [roomHash, setRoomHash] = useState("");
 const { currentUser } = auth;
 //room asing id nd ref
 const roomId = randomId;
 const roomRef = doc(db, "rooms", roomId);
 //const roomMessagesRef = collection(db, "rooms", roomId, "messages");
 
 const senderUser = currentUser.photoURL
 ? {
     name: currentUser.displayName,
     _id: currentUser.uid,
     avatar: currentUser.photoURL,
   }
 : { name: currentUser.displayName, _id: currentUser.uid };

  //console.log(users)
  const navigation = useNavigation();
  
  const userQuery = query(
    collection(db, "users"),
    where("userType", "==", "teacher")
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
     const parsedUser = querySnapshot.docs.map((e)=>({
      ...e.data()
     }))
    if(parsedUser !== undefined){
      data=[]
      parsedUser.map((e)=>{
        data.push({key:e.uid,value:e.displayName})
        images.push({key:e.uid,url:e.photoURL})
      })
      setUsers(parsedUser)
  }});
    return () => unsubscribe();
  }, []);

  async function sendImage(uri, roomPath) {
    const { url, fileName } = await uploadImage(
      uri,
      `images/rooms/${roomPath || roomHash}`
    );
    const message = {
      _id: fileName,
      text: "",
      createdAt: new Date(),
      user: senderUser,
      image: url,
    };
    const lastMessage = { ...message, text: "New Chat" };
    await Promise.all([
      updateDoc(roomRef, { lastMessage }),
    ]);
  }

  async function newhandlePress(){      
    setIsLoading(true)        
        const currUserData = {
          displayName: currentUser.displayName,
          email: currentUser.email,
        };
        if (currentUser.photoURL) {
          currUserData.photoURL = currentUser.photoURL;
        }
        const userBData = {
          displayName: user.contactName || user.displayName || "",
          email: user.email,
        };
        if (user.photoURL) {
          userBData.photoURL = user.photoURL;          
        }
        const roomData = {
          participants: [currUserData, userBData],
          participantsArray: [currentUser.email, user.email],
        };
        try {          
          await setDoc(roomRef, roomData).then(
            await setDoc(doc(db, "users", currentUser.uid), { teacher:teacherName },{merge:true})
          )
        } catch (error) {
          setIsLoading(false)
          console.log(error);
        }
      
      const emailHash = `${currentUser.email}:${user.email}`;
      setRoomHash(emailHash);
      if (user.photoURL) {
        await sendImage(user.photoURL, emailHash);
      }else sendImage(userIcon,emailHash)
      navigation.replace("home")
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

        <Text style={{ fontSize: 25,fontWeight:"bold", color: colors.text, marginTop: 20,marginBottom:25}}>
          Selecciona tu profesora:
        </Text>
        <View style={{width:"90%"}}>
        <SelectList data={data} setSelected={setSelected}
          onSelect={()=>{
            setDisable(false)
            let name = data.find(e => e.key == selected)
            let image = images.find(e=>e.key == selected)
            let user = users.find(e=>e.uid == selected)
            setUser(user)
            setTeacherName(name.value)
            setImage(image.url)
          }}
         dropdownTextStyles={{fontSize:25,color:colors.text}}
         dropdownStyles={{padding:10,borderWidth:3,borderColor:"black",backgroundColor:"whitesmoke"}}
         inputStyles={{fontSize:25}}
         boxStyles={{borderWidth:3,borderColor:colors.primary}} searchPlaceholder=""/>
        {selected && image !=""?
        <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:25,fontWeight:"bold",marginBottom:20}}>Nombre: {teacherName}</Text>
        <Image style={{width: '70%', height: '65%',resizeMode:"stretch",borderRadius:250}} source={{uri:image}}/>
        </View>:<View></View>}
        </View>
        <View style={{ marginTop: "auto", width: 80 }}>
          <Button
            title="Next"
            color={colors.secondary}
            onPress={newhandlePress}
            disabled={disable}
          />
        </View>
      </View>
    </React.Fragment>
  );
}
