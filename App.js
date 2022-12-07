import React, { useState, useEffect, useContext,useRef } from "react";
import { Text, View, LogBox,ActivityIndicator } from "react-native";
import { useAssets } from "expo-asset";
import * as Device from 'expo-device';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SignIn from "./screens/SignIn";
import * as TaskManager from 'expo-task-manager'
const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK'
import ContextWrapper from "./context/ContextWrapper";
import Context from "./context/Context";
import Profile from "./screens/Profile";
import Chats from "./screens/Chats";
import Teacher from "./screens/Teacher"
import { Ionicons } from "@expo/vector-icons";
import Contacts from "./screens/Contacts";
import UserProfile from "./screens/UserProfile";
import Chat from './screens/Chat'
import ChatHeader from './components/ChatHeader'
import * as Notifications from 'expo-notifications';
import GlobalContext from "./context/Context";
LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage has been extracted from react-native core and will be removed in a future release.",
  "Method has been deprecated. Please instead use"
]);

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

Notifications.setNotificationHandler(null);

function App() {
  const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [expoToken, setExpoToken] = useState("");
  const {
    theme: { colors }, } = useContext(Context);  
  useEffect(() => {    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrUser(user);
      }else(setCurrUser(null))
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  

  if (loading) {
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
    <ActivityIndicator size={55} color={colors.primary}/>
  </View>
  }

  return (
    <NavigationContainer>
      {!currUser && !loading ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="signIn" component={SignIn} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.foreground,
              shadowOpacity: 0,
              elevation: 0,
            },
            headerTintColor: colors.white,
          }}
        >
          {!currUser.displayName && (
            <Stack.Screen
              name="profile"
              component={Profile}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen
            name="home"
            options={{ title: "Online English MBG" }}
            component={Home}
          />
          <Stack.Screen
          name="teacher"
          options={{ title: "Selecciona profesora",headerLeft:null}}
          component={Teacher}
        />
          <Stack.Screen
            name="contacts"
            options={{ title: "Select Contacts" }}
            component={Contacts}
          />
          <Stack.Screen name="chat" component={Chat} options={{headerTitle: (props) => <ChatHeader {...props} />}}/>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
function Home() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);  
  const [pncount, setPncount] = useState(0);
  //const notificationListener = useRef();
  //const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token)
      //Storage.save(EXPO_TOKEN,String(token))
    });
    // This listener is fired whenever a notification is received while the app is foregrounded
    /* notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    
    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      if (response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        Notifications.dismissNotificationAsync(response.notification.request.identifier);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    }; */
  }, []);

// defines how device should handle a notification when the app is running (foreground notifications)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
})

const handleNewNotification = async notificationObject => {
  try {
    const newNotification = {
      id: notificationObject.messageId,
      date: notificationObject.sentTime,
      title: notificationObject.data.title,
      body: notificationObject.data.message,
      data: JSON.parse(notificationObject.data.body),
    }
    // add the code to do what you need with the received notification  and, e.g., set badge number on app icon
    //console.log(newNotification)
    await Notifications.setBadgeCountAsync(1)
  } catch (error) {
    console.error(error)
  }
}

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => handleNewNotification(data.notification)
)

useEffect(() => {
  // register task to run whenever is received while the app is in the background
  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)

  // listener triggered whenever a notification is received while the app is in the foreground
  const foregroundReceivedNotificationSubscription = Notifications.addNotificationReceivedListener(
    notification => {
      handleNewNotification(notification.request.trigger.remoteMessage)
    }
  )

  return () => {
    // cleanup the listener and task registry
    foregroundReceivedNotificationSubscription.remove()
    Notifications.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK)
  }
}, [])



  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;     
      console.log("APP.js: "+token);
      setExpoPushToken(token)
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }
  const {
    theme: { colors },
  } = useContext(Context);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarLabel: () => {
            if (route.name === "photo") {
              return <Ionicons name="camera" size={20} color={colors.white} />;
            } else {
              return (
                <Text style={{ color: colors.white }}>
                  {route.name.toLocaleUpperCase()}
                </Text>
              );
            }
          },
          tabBarShowIcon: true,
          tabBarLabelStyle: {
            color: colors.white,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.white,
          },
          tabBarStyle: {
            backgroundColor: colors.foreground,
          },
        };
      }}
      initialRouteName="chats"
    >
      <Tab.Screen name="chats">
      {(navigation) => <Chats {...navigation} expoPushToken={expoPushToken} />}
      </Tab.Screen>
      <Tab.Screen name="mi perfil" component={UserProfile}/>
    </Tab.Navigator>
  );
}

function Main() {
const {theme:{colors}} = useContext(GlobalContext)
  
  const [assets] = useAssets(
    require("./assets/icon-square.png"),
    require("./assets/chatbg.png"),
    require("./assets/user-icon.png"),
    require("./assets/welcome-img.png")
  );
  if (!assets) {
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
    <ActivityIndicator size={55} color={colors.primary}/>
  </View>
  }
  return (
    <ContextWrapper>
      <App />
    </ContextWrapper>
  );
}


export default Main;
