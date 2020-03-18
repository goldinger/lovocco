import React from 'react';
import {Picker, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Input} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';
import {X_API_URL} from 'react-native-dotenv';

class SignUpScreen extends React.Component {
    static navigationOptions = {
        title: "Inscription",
    };

    state = {
        genderList : [],
        cityList: [],
        // inputs
        name: null,
        city: null,
        gender: null,
        birthdate: '1994-12-10',
        email: null,
        password1: null,
        password2: null,
        // error messages
        emailError: null,
        nameError: null,
        cityError: null,
        birthdateError: null,
        genderError: null,
        password1Error: null,
        password2Error: null,
        generalError: null,
    };

    componentDidMount() {
        let component = this;
        fetch(X_API_URL + 'genders').then(
            response => response.json()
        ).then(
            genderList => component.setState({genderList})
        );
        fetch(X_API_URL + 'citys').then(
            response => response.json()
        ).then(
            cityList => component.setState({cityList})
        )
    };

    clearErrors() {
        this.setState({
            emailError: null,
            usernameError: null,
            nameError: null,
            cityError: null,
            birthdateError: null,
            genderError: null,
            password1Error: null,
            password2Error: null,
            generalError: null,
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{width: '100%'}}>
                    <Input
                        label="Identifiant de connexion"
                        inputStyle={styles.inputBox}
                        selectionColor="#fff"
                        onChangeText={(username) => this.setState({username})}
                        errorMessage={this.state.usernameError}
                        errorStyle={{color: 'red'}}/>
                    <Input
                        label="Prénom"
                        inputStyle={styles.inputBox}
                        selectionColor="#fff"
                        onChangeText={(name) => this.setState({name})}
                        errorMessage={this.state.nameError}
                        errorStyle={{color: 'red'}}/>
                    <View>
                        <Text style={styles.label}>Sexe</Text>
                        <Picker
                            style={styles.textInput}
                            selectedValue={this.state.gender}
                            onValueChange={(gender) => this.setState({gender})}
                        >
                            {
                                this.state.genderList.map(item => <Picker.Item key={item.id} label={item.label} value={item}/>)
                            }
                        </Picker>
                        { this.state.genderError && <Text style={{color: "red"}}>{this.state.genderError}</Text> }
                    </View>

                    <View>
                        <Text style={styles.label}>Localisation</Text>
                        <Picker
                            style={styles.textInput}
                            selectedValue={this.state.city}
                            onValueChange={(city) => this.setState({city})}
                        >
                            {
                                this.state.cityList.map(item => <Picker.Item key={item.id} label={item.name} value={item}/>)
                            }
                        </Picker>
                        { this.state.cityError && <Text style={{color: "red"}}>{this.state.cityError}</Text> }
                    </View>
                    <View>
                        <Text style={styles.label}>Date de naissance</Text>
                        <DatePicker
                            style={{width: 300}}
                            customStyles={{
                                dateInput: {
                                    borderRadius: 10,
                                    borderColor: 'black'
                                }
                            }}
                            date={this.state.birthdate}
                            mode="date"
                            confirmBtnText="Confirmer"
                            cancelBtnText="Annuler"
                            onDateChange={(birthdate) => {this.setState({birthdate})}}/>
                        { this.state.birthdateError && <Text style={{color: "red"}}>{this.state.birthdateError}</Text> }
                    </View>
                    <Input
                        label="Adresse email"
                        inputStyle={styles.inputBox}
                        selectionColor="#fff"
                        keyboardType="email-address"
                        onChangeText={(email) => this.setState({email})}
                        errorMessage={this.state.emailError}
                        errorStyle={{color: 'red'}}/>
                    <Input
                        label="Mot de passe"
                        inputStyle={styles.inputBox}
                        onChangeText={(password1) => this.setState({password1})}
                        secureTextEntry={true}
                        errorMessage={this.state.password1Error}
                        errorStyle={{color: 'red'}}/>
                    <Input
                        label="Confirmation du mot de passe"
                        inputStyle={styles.inputBox}
                        onChangeText={(password2) => this.setState({password2})}
                        secureTextEntry={true}
                        errorMessage={this.state.password2Error}
                        errorStyle={{color: 'red'}}/>
                </ScrollView>
                { this.state.generalError && <Text style={{color: "red"}}>{this.state.generalError}</Text> }
                <TouchableOpacity style={styles.button} onPress={this._signUpAsync}>
                    <Text style={styles.buttonText} >Valider</Text>
                </TouchableOpacity>
            </View>)
    }

    _signUpAsync = async () => {
        this.clearErrors();
        let component = this;
        if (this.state.password1 === this.state.password2) {
            fetch(X_API_URL + 'register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: component.state.username,
                        name: component.state.name,
                        city: component.state.city.id,
                        gender: component.state.gender.id,
                        birthdate: component.state.birthdate,
                        email: component.state.email,
                        password: component.state.password1,
                    })
                }
            ).then((response) => {
                if (response.status === 200) {
                    response.json().then(
                        responseJson => {
                            AsyncStorage.setItem('userToken', responseJson.token).then(
                                () => {
                                    component.props.navigation.navigate('App')
                                }
                            );

                        }
                    )
                }
                else if (response.status === 400) {
                    response.json().then(
                        responseJson => component.setState({
                            usernameError: responseJson.username,
                            nameError: responseJson.name,
                            emailError: responseJson.email,
                            birthdateError: responseJson.birthdate,
                            cityError: responseJson.city,
                            genderError: responseJson.gender,
                            password1Error: responseJson.password,
                            generalError: responseJson.message,
                        })
                    )
                }
                else {
                    response.json().then( responseJson => {
                        component.setState({generalError: responseJson.message})
                    })
                }
            }).catch(generalError => component.setState({generalError}))
        } else {
            this.setState({password2Error: "Les mots de passes ne sont pas identiques"})
        }

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
    label: {
        // padding: 10,
        fontSize: 16,
    },
    textInput: {
        width: 300,
        borderRadius: 15,
        borderWidth: 1,
        textAlign: 'center'
    },
    inputBox: {
        width: "100%",
        backgroundColor: '#eeeeee',
        borderRadius: 15,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#002f6c',
        marginVertical: 10
    },
    button: {
        width: "100%",
        backgroundColor: '#4f83cc',
        borderRadius: 15,
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
