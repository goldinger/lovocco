import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet
} from 'react-native';
import { Input } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { Base64 } from 'js-base64';

class SignUpScreen extends React.Component {
    static navigationOptions = {
        title: "Inscription",
    };

    state = {
        email: null,
        password1: null,
        password2: null,
        emailError: null,
        password1Error: null,
        password2Error: null,
    };

    render() {
        return (
            <View style={styles.container}>
                <Input
                    label="Adresse email"
                    inputStyle={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    selectionColor="#fff"
                    keyboardType="email-address"
                    onChangeText={(email) => this.setState({email})}
                    errorMessage={this.state.emailError}
                    errorStyle={{color: 'red'}}
                    onSubmitEditing={()=> this.password1.focus()}/>
                <Input
                    label="Mot de passe"
                    inputStyle={styles.inputBox}
                    onChangeText={(password1) => this.setState({password1})}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    secureTextEntry={true}
                    ref={(input) => this.password1 = input}
                    errorMessage={this.state.password1Error}
                    errorStyle={{color: 'red'}}
                    onSubmitEditing={() => this.password2.focus()}
                />
                <Input
                    label="Mot de passe"
                    inputStyle={styles.inputBox}
                    onChangeText={(password2) => this.setState({password2})}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    secureTextEntry={true}
                    ref={(input) => this.password2 = input}
                    errorMessage={this.state.password2Error}
                    errorStyle={{color: 'red'}}
                    onSubmitEditing={this._signUpAsync}
                />
                <TouchableOpacity style={styles.button} onPress={this._signUpAsync}>
                    <Text style={styles.buttonText} >Valider</Text>
                </TouchableOpacity>
            </View>)
    }

    _signUpAsync = async () => {
        let component = this;
        let password = this.state.password1;
        if (password === this.state.password2) {
            fetch('https://lovocco-api.sghir.me/register', {
                    method: 'PUT',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email: component.state.email, password: Base64.encode(password)})
                }
            ).then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.token) {
                        AsyncStorage.setItem('userToken', responseJson.token).then(
                            () => {component.props.navigation.navigate('App')}
                        );
                    }
                });
        } else {
            this.setState({password2error: "Les mots de passes ne sont pas identiques"})
        }

    };
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 60,
        paddingRight: 60
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
export default SignUpScreen;
