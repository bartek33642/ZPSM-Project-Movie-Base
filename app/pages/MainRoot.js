import React, { Component } from "react";
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import Constants from 'expo-constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Favourite from "./../pages/Favourite";
import Settings from "./../pages/Settings";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from "./Home";

const Tab = createBottomTabNavigator();

class MainRoot extends Component {

    state={
        isLoading: true,
        genres:[],
    };


    componentDidMount(){
        return fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=802b2c4b88ea1183e50e6b285a27696e')
        .then(response => response.json())
        .then(responseJson => {
            this.setState({
                isLoading: false,
                genres: responseJson.genres,
            })

        })
        .catch(error => console.error(error));
    }

    render() {
    const HomeComponent = (props) => <Home genres={this.state.genres} />;

    if (this.state.isLoading) {
        return (
          <SafeAreaView style={{flex: 1, justifyContent:"center", alignItems: "center"}}>
            <ActivityIndicator />
          </SafeAreaView>
        );
      
    }
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#333",
                tabBarInactiveTintColor: "#999",
              }}
        >
            <Tab.Screen
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={22} />
                    ),
                }}
                name="Home"
                component={HomeComponent}
            />
            <Tab.Screen
                options={{
                    tabBarLabel: "Favourite",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="heart" color={color} size={22} />
                    ),
                }}
                name="Favourite"
                component={Favourite}
            />
            <Tab.Screen
                options={{
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="cog" color={color} size={22} />
                    ),
                }}
                name="Settings"
                component={Settings}
            />
        </Tab.Navigator>
        );
    }

    }

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    }
})

export default MainRoot