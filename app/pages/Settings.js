import React, { Component } from "react";
import { View, SafeAreaView, Text, StyleSheet } from 'react-native';

export default class Settings extends Component {
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Settings</Text>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})