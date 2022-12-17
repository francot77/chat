import { collection, onSnapshot, query, where,updateDoc } from "@firebase/firestore";
import React, { useContext, useEffect,useState } from "react";
import { View, Text, ActivityIndicator, Button,TouchableOpacity } from "react-native";
import GlobalContext from "../context/Context";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, setDoc,getDocs } from "@firebase/firestore";
import ListItem from "../components/ListItem";
import { nanoid } from "nanoid";
import { uploadImage,deleteItem,STORAGE_EMAIL,STORAGE_PW } from "../utils";

export default function Chats(props) {
  let token = props.expoPushToken
  const { currentUser } = auth;
  const [userData, setUserData] = useState({});
  const [isAccepted, setisAccepted] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [chats, setChats] = useState([]);
  const [roomHash, setRoomHash] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { rooms, setRooms, setUnfilteredRooms,theme:{colors} } = useContext(GlobalContext);
  
  const randomId = nanoid();
  const roomId = randomId;
  const roomRef = doc(db, "rooms", roomId);
  const chatsQuery = query(
    collection(db, "rooms"),
    where("participantsArray", "array-contains", currentUser.email)
  );
  const userQuery = query(
    collection(db, "users"),
    where("email", "==", currentUser.email)
  );

async function updateExpoToken(token){
const user = auth.currentUser;
const data = {
  expoToken:token
}
setDoc(doc(db,"users",user.uid),data,{merge:true})
}

const senderUser = currentUser.photoURL
? {
    name: currentUser.displayName,
    _id: currentUser.uid,
    avatar: currentUser.photoURL,
  }
: { name: currentUser.displayName, _id: currentUser.uid };


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
        displayName: teacherData.displayName || "",
        email: teacherData.email,
      };
      if (teacherData.photoURL) {
        userBData.photoURL = teacherData.photoURL;          
      }
      const roomData = {
        participants: [currUserData, userBData],
        participantsArray: [currentUser.email, teacherData.email],
      };
      try {
        await setDoc(roomRef, roomData)
      } catch (error) {
        console.log(error);
      }
    
      const emailHash = `${currentUser.email}:${teacherData.email}`;
      setRoomHash(emailHash);
    if (teacherData.photoURL ) {
      await sendImage(teacherData.photoURL, emailHash);
    }
    setIsLoading(false)
}

useEffect(()=>{
  if(!isAccepted){
    let token = props.expoPushToken
    if(token!=""){
      console.log("Chats.js: "+ token)
      updateExpoToken(token)
    }
  }
},[token])
  useEffect(() => {
    
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
      const parsedChats = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userB: doc
          .data()
          .participants.find((p) => p.email !== currentUser.email),
      }));
      //console.log(parsedChats)      
      setChats(parsedChats)
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    //console.log(userData)
    if(userData.userType === "alumn"){
      
      let filteredChats = chats.find(e=>e.userB.displayName == userData.teacher)
      if(filteredChats!==undefined){
        console.log("Cargando Chats a roomscontext")
        let chatarray = [filteredChats]
        setUnfilteredRooms(chatarray)
        setRooms(chatarray.filter((doc) => doc.lastMessage));
      }else{
        setUnfilteredRooms([])
        setRooms([])
      }
    }else if(userData.userType === "teacher"){
      setUnfilteredRooms(chats)
      setRooms(chats.filter((doc) => doc.lastMessage));
    }
  }, [chats,userData]);

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
  const getTeacher = async(tchr)=>{
    const q = query(collection(db, "users"), where("displayName", "==", tchr));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
    let data = doc.data()
    setTeacherData(data)
  })}

  useEffect(() => {
    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
     const parsedUser = querySnapshot.docs.map((e)=>({
      ...e.data()
     }))
    if(parsedUser[0] !== undefined){
      setUserData(parsedUser[0])
      if(parsedUser[0].isAccepted){
        setisAccepted(true)
        setIsLoading(false);
      }else{
        setisAccepted(false)
        setIsLoading(false);
      }
    }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async ()=>{
      if(userData.isAccepted!==undefined){
        await getTeacher(userData.teacher)
      }
    }
    fetchData()
  }, [userData]);

  if(isLoading) return <View style={{ flex: 1, padding: 5, paddingRight: 10,alignItems:"center",justifyContent:"center" }}><ActivityIndicator size={55} color={colors.primary}/></View>  
  return (
    <View style={{ flex: 1, padding: 5, paddingRight: 10 }}>
      {isAccepted && rooms.map((room) => (
        <ListItem
          type="chat"
          description={room.lastMessage.text}
          key={room.id}
          room={room}
          time={room.lastMessage.createdAt}
          user={room.userB}
        />
      ))}
      {rooms.length<1&&isAccepted?<View style={{justifyContent:"center",alignItems:"center"}}><Text style={{fontSize:25,fontWeight:"bold"}}>Tu Profesora es: {userData.teacher}</Text>
      <TouchableOpacity
      onPress={async()=>{
        
        console.log(teacherData)
        await newhandlePress()
      }}
      style={{borderRadius:20,borderWidth:2,elevation:5,padding:15,backgroundColor:"whitesmoke"}}>
        <Text style={{fontSize:25,fontWeight:"bold"}}>Iniciar Chat</Text>
      </TouchableOpacity>
      </View>:<View></View>}
      {!isAccepted && <View style={{ flex: 1, padding: 5, paddingRight: 10,alignItems:"center",justifyContent:"center" }}><Text style={{fontSize:25,fontWeight:"500"}}>Usted no ha sido verificado por el admistrador por favor contactese de inmediato</Text></View>}
      <View style={{ marginTop: "auto", width: 80,alignSelf:"center"}}>
          <Button
            title="Cerrar sesion"
            color={colors.primary}
            onPress={ async ()=>{
              try {
                
                await Promise.all([deleteItem(STORAGE_EMAIL),deleteItem(STORAGE_PW),signOut(auth),])

              } catch (error) {
                console.log(error)
              }
            }}
            disabled={false}
          />
        </View>
    </View>
  );
}
