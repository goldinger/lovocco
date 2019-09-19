import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    AsyncStorage,
    TextInput,
    StyleSheet
} from 'react-native';
import { Base64 } from 'js-base64';

class SignInScreen extends React.Component {
    static navigationOptions = {
        title: 'Connexion',
    };

    state = {
        email: null,
        password: null,
    };

    render() {
        return (
            <View style={styles.container}>
                <TextInput style={styles.inputBox}
                           onChangeText={(email) => this.setState({email})}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder="Email"
                           placeholderTextColor = "#002f6c"
                           selectionColor="#fff"
                           keyboardType="email-address"
                           onSubmitEditing={()=> this.password.focus()}/>

                <TextInput style={styles.inputBox}
                           onChangeText={(password) => this.setState({password})}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           placeholder="Password"
                           secureTextEntry={true}
                           placeholderTextColor = "#002f6c"
                           ref={(input) => this.password = input}
                />

                <TouchableOpacity style={styles.button} onPress={this._signInAsync}>
                    <Text style={styles.buttonText} >Se connecter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('SignUp')}>
                    <Text style={styles.buttonText} >S'enregistrer</Text>
                </TouchableOpacity>
            </View>)
    }

    _signInAsync = async () => {
        let component = this;
        fetch('https://lovocco-api.sghir.me/authenticate', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: component.state.email, password: Base64.encode(component.state.password)})
            }
        ).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.token) {
                    AsyncStorage.setItem('userToken', responseJson.token);
                    component.props.navigation.navigate('App');
                }
            });
    };
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputBox: {
        width: 300,
        backgroundColor: '#eeeeee',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#002f6c',
        marginVertical: 10
    },
    button: {
        width: 300,
        backgroundColor: '#4f83cc',
        borderRadius: 25,
        marginVertical: 10,
        paddingVertical: 12
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
    }
});
export default SignInScreen;
