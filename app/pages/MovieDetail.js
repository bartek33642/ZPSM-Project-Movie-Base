import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableWithoutFeedback, Modal, Dimensions, } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import Constants from 'expo-constants';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ScrollView } from "react-native-gesture-handler";
import ChipGroup from "./../components/ChipGroup";
import TeaserTrailer from '../models/TeaserTrailer';
import TrailerItem from '../components/TrailerItem';
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import Cast from '../models/Cast';
import CastItem from '../components/CastItem';

const db = SQLite.openDatabase("movie.db");
class MovieDetail extends Component {
    movieItem = null;
    baseUrl = "http://api.themoviedb.org/3/movie/";
    apiKey = "802b2c4b88ea1183e50e6b285a27696e";
    scrollHeight = 0;
    constructor(props) {
        super(props);
        this.movieItem = props.route.params.item;
        this.readMovieData(this.movieItem);
        let topSpace = Constants.statusBarHeight + 10 + 48;
        this.scrollHeight = Dimensions.get("screen").height - topSpace - 70;
    }

    state = {
        teaserTrailers: [],
        activeTrailerKey: "",
        modalVisible: false,
        isFavorite: false,
        castResults: [],
    };

    readMovieData(data) {
        db.transaction((tx) => {
            // sending 4 arguments in executeSql
            tx.executeSql(
                "SELECT * FROM Favorites WHERE movie_id = ?",
                [data.id],
                (txObj, { rows: { _array } }) => {
                    if (_array.length != 0) {
                        this.setState({ isFavorite: true });
                    }
                    else {
                        //console.log("data yok");
                    }
                },
                (txObj, error) => console.error(error)
            ); // end executeSQL
        }); //end transaction
    }

    downloadFile = async (data, process) => {
        const movieDir = FileSystem.documentDirectory + "/" + data.id + "/";
        const dirInfo = await FileSystem.getInfoAsync(movieDir);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(movieDir, { intermediates: true });
        }
        const fileUri =
            movieDir + (process == 1 ? "poster_path.jpg" : "backdrop_path.jpg");

        const uri = process == 1 ? data.poster_path : data.backdrop_path;
        let downloadObject = FileSystem.createDownloadResumable(uri, fileUri);
        let response = await downloadObject.downloadAsync();
        return response;
    };

    deleteItem = async (data) => {
        const movieDir = FileSystem.documentDirectory + "/" + data.id + "/";
        await FileSystem.deleteAsync(movieDir);
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM Favorites WHERE movie_id = ?",
                [data.id],
                (txObj, resultSet) => {
                    if (resultSet.rowsAffected > 0) {
                        //Delete operation
                        this.setState({ isFavorite: false });
                    }
                }
            );
        });
    };

    addItem = async (data) => {
        await this.downloadFile(data, 1).then(response => { // TODO: poster_path download
            if (response.status == 200) {
                this.downloadFile(data, 2).then(response => { // TODO: backdrop_path download
                    if (response.status == 200) {
                        data.genresString = "";
                        data.genresString += data.genres.map((item, index) => item);
                        db.transaction((tx) => {
                            tx.executeSql(
                                "INSERT INTO Favorites (movie_id, title, genres, overview, popularity, release_date, vote_average, vote_count) values (?, ?, ?, ?, ?, ?, ?, ?)",
                                [
                                    data.id,
                                    data.title,
                                    data.genresString,
                                    data.overview,
                                    data.popularity,
                                    data.release_date,
                                    data.vote_average,
                                    data.vote_count,
                                ],
                                (txObj, resultSet) => {
                                    this.setState({ isFavorite: true });

                                },
                                (txObj, error) => console.log("Error", error)
                            );
                        });
                    }
                });
            }
        });

    };

    favoriteProcess(data) {
        if (this.state.isFavorite) {
            // TODO: delete
            this.deleteItem(data);
        }
        else {
            // TODO: insert
            this.addItem(data)
        }
    }

    componentDidMount() {
        return fetch(
            this.baseUrl + this.movieItem.id + "/videos?api_key=" + this.apiKey
            )
            .then((response) => response.json())
            .then((responseJson) => {
                let items = [];
                responseJson.results.map((movie) => {
                    items.push(new TeaserTrailer({
                        key: movie.key,
                        name: movie.name,
                        type: movie.type,
                    })
                    );
                });
                this.setState({ teaserTrailers: items });

                fetch(
                    this.baseUrl + this.movieItem.id + "/credits?api_key=" + this.apiKey
                )
                .then((response) => response.json())
                .then((responseJson) => {
                let casts = [];
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
            this.setState({ castResults: casts });
        })
            .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
}



    render() {
        return (
            <View style={styles.container}>
                <Modal
                    style={{ position: "absolute", top: 0 }}
                    animationType="slide"
                    transparent={true}
                    statusBarTranslucent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false });
                    }}
                >
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#000" }}>
                        <TouchableWithoutFeedback onPress={() => this.setState({ modalVisible: false })}>
                            <View style={{
                                backgroundColor: "#222",
                                width: 48,
                                height: 48,
                                position: "absolute",
                                top: Constants.statusBarHeight + 10,
                                justifyContent: "center",
                                alignItems: "center",
                                left: 20,
                                borderRadius: 10,
                            }}>
                                <MaterialCommunityIcons name="close" size={20} color={"white"} />
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={{ width: "100%" }}>
                            <YoutubePlayer
                                play={true}
                                height={270}
                                videoId={this.state.activeTrailerKey}
                            />
                        </View>
                    </View>
                </Modal>
                <ScrollView>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.props.navigation.setParams({
                                querry: "someText",
                            });
                            this.props.navigation.pop();
                        }}
                    >
                        <MaterialCommunityIcons
                            style={{
                                position: "absolute",
                                top: Constants.statusBarHeight + 10,
                                left: 10,
                                zIndex: 1,
                                paddingRight: 20,
                                paddingBottom: 20,
                            }}
                            name="chevron-left"
                            size={24}
                            color={"#fff"}
                        />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={() => this.favoriteProcess(this.movieItem)}
                    >
                        <MaterialCommunityIcons
                            style={{
                                position: "absolute",
                                top: Constants.statusBarHeight + 10,
                                right: 10,
                                zIndex: 1,
                                paddingLeft: 20,
                                paddingBottom: 20,
                            }}
                            name={this.state.isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={"#fff"}
                        />
                    </TouchableWithoutFeedback>
                    <Image
                        style={styles.poster}
                        resizeMode={"cover"}
                        source={{
                            uri: this.movieItem.backdrop_path,
                        }}
                    />

                    <View style={{ flex: 1, padding: 20 }}>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 10,
                            }}
                        >
                            <View style={{ flexWrap: "wrap", flexDirection: "column" }}>
                                <Text style={styles.title}>{this.movieItem.title}</Text>
                                <Text style={styles.subtitle}>
                                    {this.movieItem.release_date}
                                </Text>
                            </View>
                            <View style={styles.ratingBadge}>
                                <Text style={styles.rating}>{this.movieItem.vote_average}</Text>
                            </View>
                        </View>

                        <ChipGroup datas={this.movieItem.genres} />

                        <Text style={styles.header}>Overview</Text>
                        <Text style={{ fontFamily: "PoppinsLight" }}>
                            {this.movieItem.overview}
                        </Text>
                        <Text style={styles.header}>Teasers & Trailers</Text>
                        <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
                            {
                                this.state.teaserTrailers.map((item, index) => {
                                    return (
                                        <TrailerItem
                                            poster={this.movieItem.backdrop_path}
                                            key={item.key}
                                            onPressFunction={() => {
                                                this.setState({
                                                    modalVisible: true,
                                                    activeTrailerKey: item.key,
                                                });
                                            }}
                                            data={item}
                                            modalVisible={this.state.modalVisible}
                                            itemIndex={index}
                                        />
                                    );
                                })}
                        </View>
                        <View
                        style={{
                          justifyContent: "space-between",
                          flexDirection: "row",
                          flex: 1,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={[
                            styles.header,
                          ]}
                        >
                          Casts
                        </Text>
                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.props.navigation.navigate("CastViewAll", {
                              movieid: this.movieItem.id,
                            })
                          }
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              flexWrap: "wrap",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "poppins-sb",
                              }}
                            >
                              View All
                            </Text>
                            <MaterialCommunityIcons
                              name="chevron-right"
                              size={20}
                            />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                      <ScrollView>
                        {this.state.castResults.map((cast, index) => {
                          return index < 4 ? (
                            <CastItem
                              cast={cast}
                              key={cast.id}
                            />
                          ) : (
                            <View key={cast.id} />
                          );
                        })}
                      </ScrollView>
                    </View>
                  </ScrollView>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    rating: {
        fontFamily: "PoppinsSBold",
    },
    ratingBadge: {
        width: 48,
        height: 48,
        backgroundColor: "#999",
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    subtitle: {
        fontSize: 14,
        fontFamily: "PoppinsLight",
    },
    poster: {
        height: 281,
    },
    title: {
        fontSize: 17,
        fontFamily: "Poppins",
    },
    header: {
        fontSize: 20,
        fontFamily: "PoppinsSBold",
        marginTop: 10,
    },
});

export default MovieDetail;