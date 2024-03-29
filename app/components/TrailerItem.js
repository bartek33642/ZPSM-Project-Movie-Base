import React from "react";
import { View, Text, Image, Dimensions, TouchableWithoutFeedback } from "react-native";
function TrailerItem(props) {
    const deviceWidth = Dimensions.get('window').width;
    const posterWidth = (deviceWidth - 50) / 2;
    const leftPosition = (posterWidth - 24) / 2;
    const marginValue = props.itemIndex % 2 == 0 ? 10 : 0;

    return (
        <TouchableWithoutFeedback onPress={props.onPressFunction}>
            <View style={{ marginRight: marginValue, marginTop: 10 }}>
                <Image
                    style={{
                        position: "absolute",
                        top: 38,
                        left: leftPosition,
                        zIndex: 1,
                        width: 24,
                        height: 24,
                    }}
                    source={require("../assets/play-button.png")} />
                <Image
                    resizeMode={"cover"}
                    style={{
                        width: posterWidth,
                        height: 100,
                        borderRadius: 20,
                        marginBottom: 5,
                    }}
                    source={{ uri: props.poster }}
                />
                <Text
                    style={{
                        flexWrap: "wrap",
                        width: posterWidth,
                        fontSize: 12,
                        fontFamily: "Poppins",
                    }}
                >
                    {props.data.name}
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );
}
export default TrailerItem;