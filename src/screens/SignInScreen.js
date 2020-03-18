import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Input} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import {X_API_URL} from 'react-native-dotenv';

class SignInScreen extends React.Component {
    static navigationOptions = {
        title: 'Connexion',
    };

    state = {
        username: null,
        password: null,
        usernameError: null,
        passwordError: null,
        generalError: null,
        loading: false
    };

    clearErrors() {
        this.setState({
            usernameError: null,
            passwordError: null,
            generalError: null
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Input
                    label="Nom d'utilisateur"
                    inputStyle={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    selectionColor="#fff"
                    // keyboardType=""
                    onChangeText={(username) => this.setState({username})}
                    errorMessage={this.state.usernameError}
                    errorStyle={{color: 'red'}}
                    onSubmitEditing={()=> this.password.focus()}/>
                <Input
                    label="Mot de passe"
                    inputStyle={styles.inputBox}
                    onChangeText={(password) => this.setState({password})}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    secureTextEntry={true}
                    ref={(input) => this.password = input}
                    errorMessage={this.state.passwordError}
                    errorStyle={{color: 'red'}}
                    onSubmitEditing={this._signInAsync}
                />
                { this.state.generalError && <Text style={{color:"red"}}>{this.state.generalError}</Text>}
                <TouchableOpacity style={styles.button} onPress={this._signInAsync} disabled={this.state.loading}>
                    <Text style={styles.buttonText} >Se connecter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}
                                  onPress={() => this.props.navigation.navigate('SignUp')}
                                  disabled={this.state.loading}>
                    <Text style={styles.buttonText} >S'enregistrer</Text>
                </TouchableOpacity>
            </View>)
    }

    _signInAsync = async () => {
        this.clearErrors();
        let component = this;
        this.setState({loading: true});
        fetch(X_API_URL + 'authenticate', {
                method: 'POST',
                mode: 'no-cors',
                headers: new Headers({
                    "Content-Type": "application/json"
                }),
                body: JSON.stringify({
                    username: component.state.username,
                    password: component.state.password
                })
            }
        ).then(response => {
            if (response.status === 200) {
                response.json().then(
                    responseJson => {
                        AsyncStorage.setItem('userToken', responseJson.token).then( () =>
                            component.props.navigation.navigate('App')
                    )
                    }
                )
            }
            else {
                response.json().then(
                    responseJson => {
                        component.setState({
                            usernameError: responseJson.username,
                            passwordError: responseJson.password,
                            generalError: responseJson.non_field_errors
                        })}
                );
            }
        })
            .catch((error) => {
                component.setState({generalError: error})
            });
        this.setState({loading: false})
    };
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    inputBox: {
        width: "100%",
        backgroundColor: '#eeeeee',
        borderRadius: 15,
        // paddingHorizontal: 16,
        fontSize: 16,
        color: '#002f6c',
        marginVertical: 10
    },
    button: {
        width: "100%",
        backgroundColor: '#4f83cc',
        borderRadius: 15,
        marginVertical: 10,
        paddingVertical: 12,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
    }
});
export default SignInScreen;
