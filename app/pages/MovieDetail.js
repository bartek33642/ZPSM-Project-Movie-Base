import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Constants from 'expo-constants';

function MovieDetail({navigation, route}) {
    return (
        <View style={styles.container}>
            <Text>{route.params.item.title}</Text>
        </View>
    );
}

const styles = StyleSheet({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
})

export default MovieDetail;