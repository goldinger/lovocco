import React from 'react';
import {
    KeyboardAvoidingView,
    Picker,
    ScrollView,
    StyleSheet,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-picker';
import { X_API_URL } from 'react-native-dotenv';
import Toast from 'react-native-root-toast';

export default class AccountScreen extends React.Component {
    static navigationOptions = {
        title: 'Account',
    };


    state = {
        userToken: null,
        dataLoaded: false,
        error: null,
        genderList: [],
        cityList: []
    };


    componentDidMount() {
        let component = this;
        AsyncStorage.getItem('userToken', null).then(
            (userToken) => {
                if (userToken == null) {
                    component.props.navigation.navigate('Auth')
                } else {
                    component.setState({userToken});
                    fetch(X_API_URL + 'lovers/me', {
                        method: 'GET',
                        headers: {
                            Authorization: 'Token ' + userToken
                        }
                    }).then(
                        response => {
                            if (response.status === 200) {
                                response.json().then( responseJson => {
                                        component.setState(responseJson);
                                        component.setState({dataLoaded: true});
                                    }
                                )
                            }
                            else {
                                response.json().then(j => component.setState({error: j.message}))
                            }
                        }
                    ).catch(error => component.setState({error}))
                }
            })
            .catch(error => component.setState({error}));
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
    }

    _validate() {
        if (this.state.userToken) {
            let body = {
                name: this.state.name,
                birth_date: this.state.birth_date,
                city: this.state.city,
                gender: this.state.gender,
                target_gender: this.state.target_gender,
                description: this.state.description,
                age_min: this.state.age_min,
                age_max: this.state.age_max
            };
            let component = this;
            // send user data
            fetch(X_API_URL + 'lovers/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + this.state.userToken
                },
                // body: component.createFormData(component.photo, body)
                body: JSON.stringify(body)
            })
                .then(response => {
                    if (response.status === 200) {
                        Toast.show('Profile updated')
                    }
                    else {
                        response.json().then(responseJson => component.setState({error: responseJson}))
                    }
                })
                .catch((error) => component.setState({error}));
            // send photo
            if (this.state.photo) {
                fetch(X_API_URL + 'photos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Token ' + this.state.userToken
                    },
                    body: this.createFormData(this.state.photo)
                })
                    .then(response => {
                        if (response.status === 200) {
                            Toast.show('Photo updated')
                        } else {
                            console.warn(response);
                            // response.json().then(responseJson => component.setState({error: responseJson}))
                        }
                    })
                    .catch((error) => component.setState({error}));
            }
        }
    }

    createFormData(photo) {
        const data = new FormData();

        data.append('image', {
            name: photo.fileName,
            type: photo.type,
            uri:
                Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
        });
        return data;
    }

    _chose_photo() {
        const options = {
            title: 'Select Picture',
            storageOptions: {
                skipBackup: true,
                path: 'images',

            },
            maxWidth: 500,
            maxHeight: 500,
            quality: 0.5
        };
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
                this.setState({ photo: response });
            }
        });
    }

    render() {
        return (
            <View style={{width: '100%', height: '100%'}}>
                { this.state.dataLoaded && <KeyboardAvoidingView style={styles.container}>
                    <ScrollView style={{width: '100%'}} contentContainerStyle={{alignItems: 'center'}}>
                        { this.state.photo && <Image source={{ uri: this.state.photo.uri }} style={{width: 220, height: 300}} /> }
                        <TouchableOpacity style={styles.button} onPress={this._chose_photo.bind(this)}>
                            <Text style={styles.buttonText}>Choisir une photo</Text>
                        </TouchableOpacity>
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
                                date={this.state.birth_date}
                                mode="date"
                                confirmBtnText="Confirmer"
                                cancelBtnText="Annuler"
                                onDateChange={(birth_date) => {this.setState({birth_date})}}/>
                        </View>

                        <View>
                            <Text style={styles.label}>Sexe</Text>
                            <Picker
                                style={styles.textInput}
                                selectedValue={this.state.gender}
                                onValueChange={(gender) => this.setState({gender})}
                            >
                                {
                                    this.state.genderList.map(item => <Picker.Item key={item.id} label={item.label} value={item.id}/>)
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
                                    this.state.cityList.map(item => <Picker.Item key={item.id} label={item.name} value={item.id}/>)
                                }
                            </Picker>
                            { this.state.cityError && <Text style={{color: "red"}}>{this.state.cityError}</Text> }
                        </View>
                        <View>
                            <Text style={styles.label}>Courte description</Text>
                            <TextInput
                                style={styles.textInput}
                                value={this.state.description}
                                multiline
                                onChangeText={(description) => this.setState({description})}/>
                        </View>
                        <View>
                            <Text style={styles.label}>Age minimum recherché</Text>
                            <TextInput
                                style={styles.textInput}
                                value={this.state.age_min ? this.state.age_min.toString() : ""}
                                keyboardType="numeric"
                                onChangeText={(age) => this.setState({age_min: parseInt(age)})}/>
                        </View>
                        <View>
                            <Text style={styles.label}>Age maximum recherché</Text>
                            <TextInput
                                style={styles.textInput}
                                value={this.state.age_max ? this.state.age_max.toString(): ""}
                                keyboardType="numeric"
                                onChangeText={(age) => this.setState({age_max: parseInt(age)})}/>
                        </View>
                        <View>
                            <Text style={styles.label}>Sexe recherché</Text>
                            <Picker
                                style={styles.textInput}
                                selectedValue={this.state.target_gender}
                                onValueChange={(target_gender) => this.setState({target_gender})}
                            >
                                {
                                    this.state.genderList.map(item => <Picker.Item key={item.id} label={item.label} value={item.id}/>)
                                }
                            </Picker>
                            { this.state.target_genderError && <Text style={{color: "red"}}>{this.state.target_genderError}</Text> }
                        </View>
                    </ScrollView>
                    { this.state.error && <Text style={{color: 'red'}}>{this.state.error}</Text>}
                    <TouchableOpacity style={styles.button} onPress={this._validate.bind(this)}>
                        <Text style={styles.buttonText}>Enregitrer les modifications</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={this._signOutAsync.bind(this)}>
                        <Text style={styles.buttonText}>Se deconnecter</Text>
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
