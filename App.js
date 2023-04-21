// import { StatusBar } from 'expo-status-bar';
// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import 'react-native-gesture-handler';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import MainRoot from './app/pages/MainRoot';
// import MovieDetail from './app/pages/MovieDetail';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{ headerShown: false }}>
//         <Stack.Screen
//           name="MainRoot"
//           component={MainRoot}
//           options={{ title: "MainRoot" }}
//         />
//         <Stack.Screen
//           name="MovieDetail"
//           component={MovieDetail}
//           options={{ title: "MovieDetail" }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainRoot from './app/pages/MainRoot';
import MovieDetail from './app/pages/MovieDetail';
import * as Font from "expo-font";
// import MovieItem from './app/components/MovieItem'; //importujemy komponent MovieItem
// import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontLoaded] = React.useState(false);

  React.useEffect(() => {
    async function loadResourcesAndDataAsync(){
      try {
        // Load fonts
        await Font.loadAsync({
          "poppins-r": require("./app/assets/fonts/Poppins-Regular.ttf"),
          "poppins-l": require("./app/assets/fonts/Poppins-Light.ttf"),
          "poppins-sb": require("./app/assets/fonts/Poppins-SemiBold.ttf"),
          "poppins-b": require("./app/assets/fonts/Poppins-Bold.ttf"),
          Poppins: require('./app/assets/fonts/Poppins-Regular.ttf'),
          PoppinsLight: require('./app/assets/fonts/Poppins-Light.ttf'),
          PoppinsSBold: require('./app/assets/fonts/Poppins-SemiBold.ttf'),
          PoppinsBold: require('./app/assets/fonts/Poppins-Bold.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setFontLoaded(true);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  // let [fontsLoaded] = useFonts({
  //   Poppins: require('./app/assets/fonts/Poppins-Regular.ttf'),
  //   PoppinsLight: require('./app/assets/fonts/Poppins-Light.ttf'),
  //   PoppinsSBold: require('./app/assets/fonts/Poppins-SemiBold.ttf'),
  //   PoppinsBold: require('./app/assets/fonts/Poppins-Bold.ttf'),
  // });
  // if (!fontsLoaded) {
  //   <View></View>;
  // } else {

    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="MainRoot"
            component={MainRoot}
            options={{ title: "MainRoot" }}
          />
          <Stack.Screen
            name="MovieDetail"
            component={MovieDetail}
            options={{ title: "MovieDetail" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

