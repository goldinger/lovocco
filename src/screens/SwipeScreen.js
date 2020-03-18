import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder } from 'react-native';
import { X_API_URL, X_MEDIA_URL } from 'react-native-dotenv'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-root-toast';

export default class SwipeScreen extends React.Component {

    constructor() {
        super();
        this.position = new Animated.ValueXY();
        this.state = {
            currentIndex: 0,
            dataLoaded: false,
            users: [],
        };

        this.rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH /2 ,0, SCREEN_WIDTH /2],
            outputRange: ['-30deg', '0deg', '10deg'],
            extrapolate: 'clamp'
        });

        this.rotateAndTranslate = {
            transform: [{
                rotate: this.rotate
            },
                ...this.position.getTranslateTransform()
            ]
        };

        this.likeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp'
        });

        this.dislikeOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0, 0],
            extrapolate: 'clamp'
        });

        this.nextCardOpacity = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0, 1],
            extrapolate: 'clamp'
        });

        this.nextCardScale = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: [1, 0.8, 1],
            extrapolate: 'clamp'
        });

    }

    like() {
        let lover = this.state.users[this.state.currentIndex];
        fetch( X_API_URL + 'lovers/' + lover.id + '/like', {
            method: 'POST',
            headers: {
                Authorization: 'Token ' + this.state.userToken
            }
        }).then(response => {
            if (response.status === 200) {
                Toast.show('LIKE')
            }
            else {
                console.warn(response)
            }
        }).catch(error => console.warn(error))
    }

    dislike() {
        let lover = this.state.users[this.state.currentIndex];
        fetch( X_API_URL + 'lovers/' + lover.id + '/dislike', {
            method: 'POST',
            headers: {
                Authorization: 'Token ' + this.state.userToken
            }
        }).then(response => {
            if (response.status === 200) {
                Toast.show('DISLIKE')
            }
            else {
                console.warn(response)
            }
        }).catch(error => console.warn(error))
    }

    componentDidMount() {
        let component = this;
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderMove: (evt, gestureState) => {

                this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
            },
            onPanResponderRelease: (evt, gestureState) => {

                if (gestureState.dx > 120) {
                    Animated.spring(this.position, {
                        toValue: { x: SCREEN_WIDTH + 200, y: gestureState.dy }
                    }).start(() => {
                        component.like();
                        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                            this.position.setValue({ x: 0, y: 0 });
                        });

                    })
                }
                else if (gestureState.dx < -120) {
                    Animated.spring(this.position, {
                        toValue: { x: -SCREEN_WIDTH - 200, y: gestureState.dy }
                    }).start(() => {
                        component.dislike();
                        this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
                            this.position.setValue({ x: 0, y: 0 });
                        });

                    })
                }
                else {
                    Animated.spring(this.position, {
                        toValue: { x: 0, y: 0 },
                        friction: 4
                    }).start()
                }
            }
        });

        AsyncStorage.getItem('userToken', null).then(
            (userToken) => {
                if (userToken == null) {
                    component.props.navigation.navigate('Auth')
                } else {
                    component.setState({userToken});
                    fetch(X_API_URL + 'lovers/candidates', {
                        method: 'GET',
                        headers: {
                            Authorization: 'Token ' + userToken
                        }
                    })
                        .then(
                            response => response.json()
                        ).then(

                        lovers => {
                            component.setState({users: lovers, dataLoaded: true});
                        }
                    ).catch(error => console.warn(error))
                }
            });
    }

    renderUsers = () => {
        return this.state.users.map((item, i) => {
            let photoUrl;
            if (item.photos.length > 0) {
                photoUrl = X_MEDIA_URL + item.photos[0]
            }
            else {
                photoUrl = "https://images-na.ssl-images-amazon.com/images/G/01/author-pages/no-profile-image-placeholder-na._CB484118601_.png"
            }

            if (i < this.state.currentIndex) {
                return null
            }
            else if (i === this.state.currentIndex) {

                return (
                    <Animated.View
                        {...this.PanResponder.panHandlers}
                        key={item.id} style={[this.rotateAndTranslate, { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>

                        <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                            <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
                        </Animated.View>

                        <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                            <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
                        </Animated.View>

                        <View style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}>
                            <Image
                                style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                                source={{uri: photoUrl}} />
                            <Text style={{position: "absolute", bottom: 20, left: 20, fontSize: 25, color: "white", fontWeight: "bold"}}>{item.name}</Text>
                            <Text style={{position: "absolute", bottom: 20, right: 20, fontSize: 25, color: "white", fontWeight: "bold"}}>{item.age}</Text>
                        </View>


                    </Animated.View>
                )
            }
            else {
                return (
                    <Animated.View
                        {...this.PanResponder.panHandlers}
                        key={item.id} style={[{
                        opacity: this.nextCardOpacity,
                        transform: [{ scale: this.nextCardScale }],
                        height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute'
                    }]}>

                        <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                            <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>
                        </Animated.View>

                        <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                            <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>
                        </Animated.View>

                        <View style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}>
                            <Image
                                style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
                                source={{uri: photoUrl}} />
                            <Text style={{position: "absolute", bottom: 20, left: 20, fontSize: 25, color: "white", fontWeight: "bold"}}>{item.name}</Text>
                            <Text style={{position: "absolute", bottom: 20, right: 20, fontSize: 25, color: "white", fontWeight: "bold"}}>{item.age}</Text>
                        </View>

                    </Animated.View>
                )
            }
        }).reverse()
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 60 }}>

                </View>
                <View style={{ flex: 1 }}>
                    {this.state.dataLoaded && this.renderUsers()}
                </View>
                <View style={{ height: 60 }}>

                </View>


            </View>

        );
    }
}
