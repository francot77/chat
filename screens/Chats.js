import { collection, onSnapshot, query, where } from "@firebase/firestore";
import React, { useContext, useEffect,useState } from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";
import GlobalContext from "../context/Context";
import { auth, db } from "../firebase";
import { doc, setDoc } from "@firebase/firestore";
import ListItem from "../components/ListItem";

export default function Chats(props) {
  let token = props.expoPushToken
  const { currentUser } = auth;
  const [isAccepted, setisAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { rooms, setRooms, setUnfilteredRooms,theme:{colors} } = useContext(GlobalContext);
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

useEffect(()=>{
  let token = props.expoPushToken
  if(token!=""){
    console.log("Chats.js: "+ token)
    updateExpoToken(token)
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
      
      setUnfilteredRooms(parsedChats);
      setRooms(parsedChats.filter((doc) => doc.lastMessage));      
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
     const parsedUser = querySnapshot.docs.map((e)=>({
      ...e.data()
     }))
    if(parsedUser[0] !== undefined){
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

  function getUserB(user, contacts) {
    const userContact = contacts.find((c) => c.email === user.email);
        if (userContact && userContact.contactName) {
      return { ...user, contactName: userContact.contactName };
    }
    return user;
  }

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
      {!isAccepted && <View style={{ flex: 1, padding: 5, paddingRight: 10,alignItems:"center",justifyContent:"center" }}><Text style={{fontSize:25,fontWeight:"500"}}>Usted no ha sido verificado por el admistrador por favor contactese de inmediato</Text></View>}
      <View style={{ marginTop: "auto", width: 80,alignSelf:"center"}}>
          <Button
            title="Logout"
            color={colors.primary}
            onPress={ async ()=>{
              try {
                await auth.signOut()
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
