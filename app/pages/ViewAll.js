import React, { Component } from "react";
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import RecentMovieItem from "../components/RecentMovieItem";
import Movie from "../models/Movie";
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Constants from "expo-constants";
import { TouchableWithoutFeedback } from "react-native";
class ViewAll extends Component {
    baseUrl = "http://api.themoviedb.org/3/movie/";
    apiKey = "802b2c4b88ea1183e50e6b285a27696e";

    state = {
        data: null,
        isLoading: false,
        total_pages: 1,
    };

    constructor(props) {
        super(props);
        this.genres = props.route.params.genres;
    }

    fetchData = (page) => {
        this.setState({ isLoading: true });
        if (this.state.total_pages >= page) {
            return fetch(
                this.baseUrl +
                (this.props.route.params.isPopular ? "popular" : "now_playing") +
                "?api_key=" +
                this.apiKey +
                "&page=" +
                page
            )
                .then((response) => response.json())
                .then((responseJson) => {
                    const moviedata = page == 1 ? [] : this.state.data;
                    var allgenres = this.genres;
                    responseJson.results.forEach((movie) => {
                        movie.genres = [];
                        movie.genre_ids.forEach((genreid) => {
                            var genreData = allgenres.filter((x) => x.id == genreid);
                            if (genreData.length != 0) {
                                movie.genres.push(genreData[0].name);
                            }
                        });

                        var item = moviedata.filter((x) => x.id == movie.id);
                        if (item.length == 0) {
                            moviedata.push(
                                new Movie({
                                    id: movie.id,
                                    title: movie.title,
                                    poster_path:
                                        movie.poster_path == null
                                            ? "https://lightning.od-cdn.com/25.2.6-build-2536-master/public/img/no-cover_en_US.jpg"
                                            : "http://image.tmdb.org/t/p/w342/" + movie.poster_path,
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
                        }
                    });

                    if (this.state.total_pages == 1) {
                        this.setState({ total_pages: responseJson.total_pages });
                    }

                    this.setState({
                        data: moviedata,
                        page: page,
                        isLoading: false,
                    });
                })
                .catch((error) => console.error(error));
        }
    };

    updatePage = () => {
        this.fetchData(this.state.page + 1);
    };

    componentDidMount() {
        this.fetchData(1);
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ paddingVertical: 20 }}>
                    <ActivityIndicator animating={true} size={"large"} />
                </View>
            );
        }

        if (this.state.data == null) {
            return <View></View>;
        } else {
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
                                paddingLeft: 10,
                            }}
                        >
                            <MaterialCommunityIcons
                                name="chevron-left"
                                size={30}
                            />
                            <Text
                                style={[
                                    styles.title,
                                ]}
                            >
                                {this.props.route.params.isPopular
                                    ? "Popular Movies"
                                    : "Recent Movies"}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <FlatList
                        style={{ paddingHorizontal: 20 }}
                        data={this.state.data}
                        keyExtractor={(item) =>
                            item.id.toString() + this.state.page.toString()
                        }
                        onEndReached={this.updatePage}
                        renderItem={({ item }) => {
                            return <RecentMovieItem item={item} navigation={this.props.navigation} />;
                        }}
                    />
                </View>
            );
        }
        return <View></View>;
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight + 10,
    },
    header: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontFamily: "poppins-sb",
        marginBottom: 20,
    },
    nodata: {
        fontFamily: "poppins-r",
        fontSize: 16,
    },
});
export default ViewAll;