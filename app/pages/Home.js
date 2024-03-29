import React, { Component } from "react";
import { View, SafeAreaView, Text, StyleSheet, ScrollView } from 'react-native';
import Movie from "../models/Movie";
import MovieItem from "../components/MovieItem";
import RecentMovieItem from "../components/RecentMovieItem";
import Constants from "expo-constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ViewAll from "./ViewAll";
import { TouchableWithoutFeedback } from 'react-native';


export default class Home extends Component {
    _isMount = false;
    baseUrl = "http://api.themoviedb.org/3/movie/";
    apiKey = "802b2c4b88ea1183e50e6b285a27696e";
    genres = [];
    state = {
        isLoading: false,
        recentMovies: [],
        popularMovies: [],
        recentMovies: [],
    };

    constructor(props) {
        super(props);
        this.genres = props.genres
    }


    componentDidMount() {
        this._isMount = true;

        return fetch(
            this.baseUrl + "popular?api_key=" + this.apiKey)
            .then(response => response.json())
            .then(responseJson => {
                const data = [];
                var allgenres = this.genres;
                responseJson.results.forEach((movie) => {
                    movie.genres = [];
                    movie.genre_ids.forEach((genreid) => {
                        var genreData = allgenres.filter((x) => x.id == genreid);
                        if (genreData.length != 0) {
                            movie.genres.push(genreData[0].name);
                        }
                    });

                    data.push(
                        new Movie({
                            id: movie.id,
                            title: movie.title,
                            poster_path:
                                "http://image.tmdb.org/t/p/w342/" + movie.poster_path,
                            backdrop_path:
                                "http://image.tmdb.org/t/p/w500/" + movie.backdrop_path,
                            genre_ids: movie.genre_ids,
                            overview: movie.overview,
                            popularity: movie.popularity,
                            release_date: movie.release_date,
                            vote_average: movie.vote_average,
                            vote_count: movie.vote_count,
                            genres: movie.genres,
                        })
                    );
                });

                if (this._isMount) {
                    this.setState({
                        popularMovies: data,
                    });
                }

                fetch(this.baseUrl + "now_playing?api_key=" + this.apiKey)
                    .then(response => response.json())
                    .then(responseJson => {
                        const data = [];
                        var allgenres = this.genres;
                        responseJson.results.forEach((movie) => {
                            movie.genres = [];
                            movie.genre_ids.forEach((genreid) => {
                                var genreData = allgenres.filter((x) => x.id == genreid);
                                if (genreData.length != 0) {
                                    movie.genres.push(genreData[0].name);
                                }
                            });

                            data.push(
                                new Movie({
                                    id: movie.id,
                                    title: movie.title,
                                    poster_path:
                                        "http://image.tmdb.org/t/p/w342/" + movie.poster_path,
                                    backdrop_path:
                                        "http://image.tmdb.org/t/p/w500/" + movie.backdrop_path,
                                    genre_ids: movie.genre_ids,
                                    overview: movie.overview,
                                    popularity: movie.popularity,
                                    release_date: movie.release_date,
                                    vote_average: movie.vote_average,
                                    vote_count: movie.vote_count,
                                    genres: movie.genres,
                                })
                            );
                        });

                        if (this._isMount) {
                            this.setState({
                                recentMovies: data,
                            });
                        }
                    })
                    .catch(error => console.error(error))
            })
            .catch(error => console.error(error));
    }

    componentWillUnmount() {
        this._isMount = false;
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Movie Catch</Text>
                    {/* <MaterialCommunityIcons name="magnify" size={24} /> */}
                </View>
                <ScrollView>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: 20,
                            marginVertical: 15,
                        }}
                    >
                        <Text style={{ fontFamily: "Poppins" }}>Popular Movies</Text>
                        <TouchableWithoutFeedback
                            onPress={() =>
                                this.props.navigation.navigate('ViewAll', {
                                    genres: this.genres,
                                    isPopular: true,
                                })
                            }
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    alignItems: "center"
                                }}
                            >
                                <Text style={{ fontFamily: "poppins-sb" }}>View All</Text>
                                <MaterialCommunityIcons name="chevron-right" size={20} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: "row", flex: 1, paddingLeft: 20 }}>
                            {
                                this.state.popularMovies.map((item, index) => {
                                    return index < 4 ? (
                                        <MovieItem
                                            key={item.id}
                                            item={item}
                                        />
                                    ) : (
                                        <View key={index} />
                                    );
                                })}
                        </View>
                    </ScrollView>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: 20,
                            marginVertical: 15,
                        }}
                    >
                        <Text style={{ fontFamily: "Poppins" }}>Recent Movies</Text>
                        <TouchableWithoutFeedback
                            onPress={() =>
                                this.props.navigation.navigate('ViewAll', {
                                    genres: this.genres,
                                    isPopular: false,
                                })
                            }
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    alignItems: "center"
                                }}
                            >
                                <Text style={{ fontFamily: "poppins-sb" }}>View All</Text>
                                <MaterialCommunityIcons name="chevron-right" size={20} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{ paddingHorizontal: 20 }}>
                        {this.state.recentMovies.map((item, index) => {
                            return index < 4 ? (
                                <RecentMovieItem key={item.id} item={item} />
                            ) : (
                                <View key={item.id} />
                            )
                        })}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        paddingTop: 20,
    },
    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontFamily: "PoppinsSBold",
    },
})