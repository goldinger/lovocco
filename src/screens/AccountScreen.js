import React from 'react';
import {
    KeyboardAvoidingView,
    Picker,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';

export default class AccountScreen extends React.Component {
    static navigationOptions = {
        title: 'Account',
    };


    state = {
        userToken: null,
        dataLoaded: false
    };


    componentDidMount() {
        let component = this;
        AsyncStorage.getItem('userToken', null).then(
            (userToken) => {
                if (userToken == null) {
                    component.props.navigation.navigate('Auth')
                } else {
                    component.setState({userToken});
                    fetch('https://lovocco-api.sghir.me/myProfile?token=' + userToken)
                        .then(
                            response => response.json()
                        ).then(
                        profile => {
                            if (profile.status === 'KO') {
                                component._signOutAsync()
                            }
                            if ( !profile.configured ) {
                                component.props.navigation.navigate('Init')
                            }
                            component.setState(profile);
                            component.setState({dataLoaded: true})
                        }
                    )
                }
            });
    }

    _validate() {
        if (this.state.userToken && this.state.name && this.state.birthDate && this.state.city && this.state.gender && this.state.targetGender && this.state.ageMin && this.state.ageMax) {
            let body = {
                name: this.state.name,
                birthDate: this.state.birthDate,
                city: this.state.city,
                gender: this.state.gender,
                targetGender: this.state.targetGender,
                description: this.state.description,
                ageMin: this.state.ageMin,
                ageMax: this.state.ageMax
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
                        component.props.navigation.navigate('Swipe')
                    } else {
                        console.warn('EROOR')
                    }
                }).catch((error) => console.warn(error))
        }
    }

    render() {
        return (
            <View style={{width: '100%', height: '100%'}}>
                { this.state.dataLoaded && <KeyboardAvoidingView style={styles.container}>
                    <ScrollView style={{width: '100%'}} contentContainerStyle={{alignItems: 'center'}}>
                        <View>
                            <Text style={styles.label}>Prénom</Text>
                            <TextInput
                                style={styles.textInput}
                                value={this.state.name}
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
                                <Picker.Item label="Homme" value="m"/>
                                <Picker.Item label="Femme" value="f"/>
                            </Picker>
                        </View>
                        <View>
                            <Text style={styles.label}>Courte description</Text>
                            <TextInput
                                style={styles.textInput}
                                value={this.state.description}
                                onChangeText={(description) => this.setState({description})}/>
                        </View>
                        <View>
                            <Text style={styles.label}>Age minimum recherché</Text>
                            <TextInput
                                style={styles.textInput}
                                value={this.state.ageMin ? this.state.ageMin.toString() : ""}
                                keyboardType="numeric"
                                onChangeText={(age) => this.setState({ageMin: parseInt(age)})}/>
                        </View>
                        <View>
                            <Text style={styles.label}>Age maximum recherché</Text>
                            <TextInput
                                style={styles.textInput}
                                value={this.state.ageMax ? this.state.ageMax.toString(): ""}
                                keyboardType="numeric"
                                onChangeText={(age) => this.setState({ageMax: parseInt(age)})}/>
                        </View>
                        <View>
                            <Text style={styles.label}>Sexe recherché</Text>
                            <Picker
                                style={styles.textInput}
                                selectedValue={this.state.targetGender}
                                onValueChange={(targetGender) => this.setState({targetGender})}
                            >
                                <Picker.Item label="Homme" value="m"/>
                                <Picker.Item label="Femme" value="f"/>
                            </Picker>
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={styles.button} onPress={this._validate.bind(this)}>
                        <Text style={styles.buttonText}>Enregitrer les modifications</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
                }
            </View>
        );
    }

    _signOutAsync = async () => {
        await AsyncStorage.removeItem('userToken');
        this.props.navigation.navigate('Auth');
    };
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
        borderWidth: 1,
        textAlign: 'center'
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
