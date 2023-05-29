import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import Cast from "./../models/Cast";
import CastItem from "../components/CastItem";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableWithoutFeedback } from "react-native";
class CastViewAll extends Component {
  baseUrl = "http://api.themoviedb.org/3/movie/";
  apiKey = "802b2c4b88ea1183e50e6b285a27696e";
  state = {
    castList: [],
    isLoading: true,
  };
  constructor(props) {
    super(props);
  }

  fetchCasts = () => {
    return fetch(
      this.baseUrl +
        this.props.route.params.movieid +
        "/credits?api_key=" +
        this.apiKey
    )
      .then((response) => response.json())
      .then((responseJson) => {
        var casts = [];
        responseJson.cast.map((cast) => {
          casts.push(
            new Cast({
              id: cast.id,
              name: cast.name,
              profile_path: cast.profile_path,
              character: cast.character,
            })
          );
        });
        this.setState({ castList: casts, isLoading: false });
      })
      .catch((error) => console.error(error));
  };

  componentDidMount() {
    this.fetchCasts();
  }

  render() {
    if (this.state.isLoading) {
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator animating={true} size={"large"} />
      </View>;
    }
    return (
            <View
              style={[
                styles.container,
              ]}
            >
              <StatusBar />
              <TouchableWithoutFeedback
                onPress={() => this.props.navigation.pop()}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                    paddingLeft: 20,
                  }}
                >
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={26}
                  />
                  <Text
                    style={[
                      styles.title,
                    ]}
                  >
                    Casts
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <ScrollView style={{ paddingHorizontal: 20 }}>
                {this.state.castList.map((cast) => {
                  return (
                    <CastItem key={cast.id} cast={cast} />
                  );
                })}
              </ScrollView>
            </View>
          );
        }}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 10,
  },
  title: {
    fontSize: 22,
    fontFamily: "poppins-sb",
  },
});

export default CastViewAll;