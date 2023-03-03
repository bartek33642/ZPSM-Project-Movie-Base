import React, { Component } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Constants from 'expo-constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "./../pages/Home";
import Favourite from "./../pages/Favourite";
import Settings from "./../pages/Settings";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

class MainRoot extends Component {
    render() {
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
                component={Home}
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