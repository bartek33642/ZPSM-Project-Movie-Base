import React, { Component } from "react";
import Constants from "expo-constants";
import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default class Settings extends Component {
    render() {
        const onPressButton = () => {
            Linking.openURL('https://pwsztaredupl-my.sharepoint.com/:w:/g/personal/33642_student_pwsztar_edu_pl/EZ35UmObjylPk-V56uNJaVcBFzJd7vjVgINNyNBf6D7S7g?e=at05K0');
        };

        return (
            <SafeAreaView style={styles.container}>
                <Text style={[
                    styles.title
                ]}>Settings</Text>
                <View style={[styles.settingsItem, { paddingTop: 20 }]}>
                    <MaterialCommunityIcons
                        name="book-information-variant"
                        size={35} />
                    <Text style={styles.leftInfo}>Privacy Policy</Text>
                    <TouchableOpacity onPress={onPressButton}>
                        <Text style={styles.rightInfo}>         Info</Text>
                    </TouchableOpacity>


                    <Text></Text>
                </View>
                <View style={styles.settingsItem}>
                    <MaterialCommunityIcons
                        name="information"
                        size={35} />
                    <Text style={styles.leftInfo}>Version application</Text>
                    <Text style={styles.rightInfo}>V.0.0.1</Text>

                </View>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
    title: {
        paddingLeft: 20,
        fontSize: 22,
        fontFamily: "poppins-sb",
        marginTop: 10,
    },
    settingsItem: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    leftInfo: {
        textAlign: "left",

    },

    rightInfo: {
        paddingLeft: 120


    },

})