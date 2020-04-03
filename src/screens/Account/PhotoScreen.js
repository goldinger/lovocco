import React from 'react';
import {
    Image,
    TouchableOpacity,
    View,
} from 'react-native';
import { X_MEDIA_URL, X_API_URL } from 'react-native-dotenv';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';


export default class PhotoScreen extends React.Component {

    componentDidMount() {
        let component = this;
        AsyncStorage.getItem('userToken').then(userToken => component.setState({userToken}))
    }

    onPressDelete() {
        if (this.state.userToken) {
            let component = this;
            fetch(X_API_URL + 'photos/' + this.props.navigation.state.params.photo.id, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Token ' + this.state.userToken
                }
            }).then(response => {
                if (response.status === 200) {
                    component.props.navigation.state.params.refresh();
                    component.props.navigation.navigate('Account');
                } else {
                    console.warn(response)
                }
            }).catch(error => console.warn(error))
        }
    }

    render() {
        const {photo} = this.props.navigation.state.params;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Image
                        source={{uri: X_MEDIA_URL + photo.image}}
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    />
                </View>
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', padding: 30}}>
                    <TouchableOpacity onPress={this.onPressDelete.bind(this)}>
                        <Icon type="font-awesome" name="ios-close" size={50} color="gray" />
                    </TouchableOpacity>
                    {/*<TouchableOpacity>*/}
                    {/*    <Icon type="font-awesome" name="power-off" size={50} color="gray" />*/}
                    {/*</TouchableOpacity>*/}
                </View>
            </View>
        );
    }
}
