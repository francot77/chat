[33mcommit 928a57047b85058b1c23a3ce8365c1bb3a65f466[m[33m ([m[1;36mHEAD -> [m[1;32mmain[m[33m)[m
Author: Franco <francotreboux@gmail.com>
Date:   Fri Nov 18 00:56:15 2022 -0300

    first commit

[1mdiff --git a/asd.json b/asd.json[m
[1mnew file mode 100644[m
[1mindex 0000000..e69de29[m
[1mdiff --git a/firebase.js b/firebase.js[m
[1mindex 99f7e59..94b3df0 100644[m
[1m--- a/firebase.js[m
[1m+++ b/firebase.js[m
[36m@@ -7,9 +7,15 @@[m [mimport {[m
 import { getStorage } from "firebase/storage";[m
 import { initializeFirestore } from "firebase/firestore";[m
 const firebaseConfig = {[m
[31m- // your config goes here[m
[32m+[m[32m  apiKey: "AIzaSyC3W-N99udYjOUvzk4ipvFVrAAhvHlUPY4",[m
[32m+[m[32m  authDomain: "englishchat-8f15f.firebaseapp.com",[m
[32m+[m[32m  projectId: "englishchat-8f15f",[m
[32m+[m[32m  storageBucket: "englishchat-8f15f.appspot.com",[m
[32m+[m[32m  messagingSenderId: "871080819587",[m
[32m+[m[32m  appId: "1:871080819587:web:8a599ebd87b13562c8d4b6"[m
 };[m
 [m
[32m+[m
 export const app = initializeApp(firebaseConfig);[m
 export const auth = getAuth(app);[m
 export const storage = getStorage(app);[m
[1mdiff --git a/package.json b/package.json[m
[1mindex 1115660..dc0055b 100644[m
[1m--- a/package.json[m
[1m+++ b/package.json[m
[36m@@ -1,4 +1,5 @@[m
 {[m
[32m+[m[32m  "name": "qrapp",[m
   "main": "node_modules/expo/AppEntry.js",[m
   "scripts": {[m
     "start": "expo start",[m
[36m@@ -8,31 +9,31 @@[m
     "eject": "expo eject"[m
   },[m
   "dependencies": {[m
[31m-    "@react-native-masked-view/masked-view": "0.2.5",[m
[32m+[m[32m    "@react-native-masked-view/masked-view": "0.2.8",[m
     "@react-navigation/material-top-tabs": "^6.0.6",[m
     "@react-navigation/native": "^6.0.6",[m
     "@react-navigation/stack": "^6.0.11",[m
[31m-    "expo": "~43.0.0",[m
[31m-    "expo-asset": "~8.4.3",[m
[31m-    "expo-constants": "~12.1.3",[m
[31m-    "expo-contacts": "~10.0.3",[m
[31m-    "expo-image-picker": "~11.0.3",[m
[31m-    "expo-status-bar": "~1.1.0",[m
[32m+[m[32m    "expo": "~47.0.0",[m
[32m+[m[32m    "expo-asset": "~8.6.2",[m
[32m+[m[32m    "expo-constants": "~14.0.2",[m
[32m+[m[32m    "expo-contacts": "~11.0.1",[m
[32m+[m[32m    "expo-image-picker": "~14.0.1",[m
[32m+[m[32m    "expo-status-bar": "~1.4.2",[m
     "firebase": "^9.1.3",[m
     "nanoid": "^3.1.30",[m
[31m-    "react": "17.0.1",[m
[31m-    "react-dom": "17.0.1",[m
[31m-    "react-native": "0.64.2",[m
[32m+[m[32m    "react": "18.1.0",[m
[32m+[m[32m    "react-dom": "18.1.0",[m
[32m+[m[32m    "react-native": "0.70.5",[m
     "react-native-easy-grid": "^0.2.2",[m
[31m-    "react-native-gesture-handler": "~1.10.2",[m
[31m-    "react-native-get-random-values": "~1.7.0",[m
[32m+[m[32m    "react-native-gesture-handler": "~2.8.0",[m
[32m+[m[32m    "react-native-get-random-values": "~1.8.0",[m
     "react-native-gifted-chat": "^0.16.3",[m
     "react-native-image-viewing": "^0.2.1",[m
[31m-    "react-native-pager-view": "5.4.6",[m
[31m-    "react-native-safe-area-context": "3.3.2",[m
[31m-    "react-native-screens": "~3.8.0",[m
[32m+[m[32m    "react-native-pager-view": "6.0.1",[m
[32m+[m[32m    "react-native-safe-area-context": "4.4.1",[m
[32m+[m[32m    "react-native-screens": "~3.18.0",[m
     "react-native-tab-view": "^3.1.1",[m
[31m-    "react-native-web": "0.17.1"[m
[32m+[m[32m    "react-native-web": "~0.18.9"[m
   },[m
   "devDependencies": {[m
     "@babel/core": "^7.12.9"[m
[1mdiff --git a/screens/Photo.js b/screens/Photo.js[m
[1mindex 93ff62d..c57761a 100644[m
[1m--- a/screens/Photo.js[m
[1m+++ b/screens/Photo.js[m
[36m@@ -10,7 +10,7 @@[m [mexport default function Photo() {[m
     const unsubscribe = navigation.addListener("focus", async () => {[m
       const result = await pickImage();[m
       navigation.navigate("contacts", { image: result });[m
[31m-      if (result.cancelled) {[m
[32m+[m[32m      if (result.canceled) {[m
         setCancelled(true);[m
         setTimeout(() => navigation.navigate("chats"), 100);[m
       }[m
