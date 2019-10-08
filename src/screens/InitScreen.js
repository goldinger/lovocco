import React from 'react';
import {KeyboardAvoidingView, Picker, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';

class InitScreen extends React.Component {
    static navigationOptions = {
        title: 'Settings',
    };


    state = {
        userToken: null,
        name: null,
        birthDate: null,
        city: null,
        gender: null,
    };


    componentDidMount() {
        let component = this;
        AsyncStorage.getItem('userToken', null).then(
            (userToken) => {
                if (userToken == null) {
                    component.props.navigation.navigate('Auth')
                } else {
                    this.setState({userToken});
                }
            });
    }

    _calculateAge(birthday) {
        let ageDifMs = Date.now() - Date.parse(birthday);
        let ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    _validate() {
        if (this.state.name && this.state.birthDate && this.state.city && this.state.gender && this.state.userToken) {
            let body = {
                name: this.state.name,
                birthDate: this.state.birthDate,
                city: this.state.city,
                gender: this.state.gender,
                targetGender: this.state.gender === 'm' ? 'f' : 'm',
                description: "",
                ageMin: this._calculateAge(this.state.birthDate) - 5,
                ageMax: this._calculateAge(this.state.birthDate) + 5
            };
            let component = this;
            fetch('https://lovocco-api.sghir.me/myProfile?token=' + this.state.userToken, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
                .then(response => response.json())
                .then((responseJson) => {
                    if (responseJson.status === 'OK') {
                        component.props.navigation.navigate('App')
                    } else {
                        console.warn('EROOR')
                    }
                }).catch((error) => console.warn(error))
        }
    }


    render() {
        return (
            <KeyboardAvoidingView style={styles.container}>
                <View>
                    <Text style={styles.label}>Prénom</Text>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(name) => this.setState({name})}/>
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
                        date={this.state.birthDate}
                        mode="date"
                        confirmBtnText="Confirmer"
                        cancelBtnText="Annuler"
                        onDateChange={(birthDate) => {this.setState({birthDate})}}/>
                </View>

                <View>
                    <Text style={styles.label}>Localisation</Text>
                    <Picker
                        style={styles.textInput}
                        selectedValue={this.state.city}
                        onValueChange={(city) => this.setState({city})}
                    >
                        <Picker.Item label="(Ville)" value={null} />
                        <Picker.Item label="Paris" value="paris"/>
                        <Picker.Item label="Lille" value="lille"/>
                    </Picker>
                </View>

                <View>
                    <Text style={styles.label}>Sexe</Text>
                    <Picker
                        style={styles.textInput}
                        selectedValue={this.state.gender}
                        onValueChange={(gender) => this.setState({gender})}
                    >
                        <Picker.Item label="(Sexe)" value={null} />
                        <Picker.Item label="Homme" value="m"/>
                        <Picker.Item label="Femme" value="f"/>
                    </Picker>
                </View>
                <TouchableOpacity style={styles.button} onPress={this._validate.bind(this)}>
                    <Text style={styles.buttonText}>Valider</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        padding: 10,
        fontSize: 16,
    },
    textInput: {
        width: 300,
        borderRadius: 10,
        borderWidth: 1
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

export default InitScreen;
