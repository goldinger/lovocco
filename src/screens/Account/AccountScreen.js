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
import ImagePicker from 'react-native-image-picker';
import { X_API_URL, X_MEDIA_URL } from 'react-native-dotenv';
import Toast from 'react-native-root-toast';
import Icon from 'react-native-vector-icons/Ionicons';
import PhotoGallery from '../../components/PhotoGalery';


export default class AccountScreen extends React.Component {

    static navigationOptions = ({navigation}) => ({
        headerLeft: <View style={{flexDirection: "row",justifyContent: "flex-end",paddingLeft:15}}>
            <TouchableOpacity onPress={navigation.getParam('_signOut')}>
                <Icon type="font-awesome" name="ios-power" size={30} color="gray" />
            </TouchableOpacity>
        </View>,
        headerRight: <View style={{flexDirection: "row",justifyContent: "flex-end",paddingRight:15}}>
            <TouchableOpacity onPress={navigation.getParam('_validate')}>
                <Icon type="font-awesome" name="ios-save" size={30} color="gray" />
            </TouchableOpacity>
        </View>
    });


    state = {
        userToken: null,
        photos : null,
        user: null,
        error: null,
        genderList: [],
        cityList: []
    };


    refresh() {
        let component = this;
        let userToken = this.state.userToken;
        fetch(X_API_URL + 'lovers/me', {
            method: 'GET',
            headers: {
                Authorization: 'Token ' + userToken
            }
        }).then(
            response => {
                if (response.status === 200) {
                    response.json().then( responseJson => {
                            component.setState({user: responseJson});
                        }
                    )
                }
                else {
                    response.json().then(j => component.setState({error: j.message}))
                }
            }
        ).catch(error => component.setState({error}));

        fetch(X_API_URL + 'photos', {
            method: 'GET',
            headers: {
                Authorization: 'Token ' + userToken
            }
        })
            .then(
                response => {
                    if (response.status === 200) {
                        response.json().then( photos => {
                                component.setState({photos});
                            }
                        )
                    }
                    else {
                        response.json().then(j => component.setState({error: j.message}))
                    }
                })
            .catch(error => component.setState({error}))
    }

    componentDidMount() {
        let component = this;
        AsyncStorage.getItem('userToken', null).then(
            (userToken) => {
                if (userToken == null) {
                    component.props.navigation.navigate('Auth')
                } else {
                    component.setState({userToken}, () => component.refresh());
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
        this.props.navigation.setParams({_validate: this._validate.bind(this), _signOut: this._signOutAsync.bind(this)})
    }

    componentWillUnmount() {
        this._validate()
    }

    _validate() {
        if (this.state.userToken) {
            let body = {
                name: this.state.user.name,
                birth_date: this.state.user.birth_date,
                city: this.state.user.city,
                gender: this.state.user.gender,
                target_gender: this.state.user.target_gender,
                description: this.state.user.description,
                age_min: this.state.user.age_min,
                age_max: this.state.user.age_max
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
                        Toast.show('Profile updated');
                        component.refresh()
                    }
                    else {
                        response.json().then(responseJson => component.setState({error: responseJson}))
                    }
                })
                .catch((error) => component.setState({error}));
        }
    }

    static createFormData(photo) {
        const data = new FormData();

        data.append('image', {
            name: photo.fileName,
            type: photo.type,
            uri:
                Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
        });
        return data;
    }

    _add_photo() {
        let component = this;
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
        ImagePicker.launchImageLibrary(options, photo => {
            if (photo.uri) {
                fetch(X_API_URL + 'photos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Token ' + component.state.userToken
                    },
                    body: AccountScreen.createFormData(photo)
                })
                    .then(response => {
                        if (response.status === 200) {
                            component.refresh();

                        } else {
                            Toast.show('Photo update failed')
                        }
                    })
                    .catch((error) => component.setState({error}));

            }
        });
    }


    set_user(key, value){
        let user = this.state.user;
        user[key] = value;
        this.setState({user})
    }


    render() {
        return (
            <View style={{width: '100%', height: '100%'}}>
                { this.state.error && <Text style={{color: 'red'}}>{this.state.error}</Text>}
                { this.state.user && <KeyboardAvoidingView style={styles.container}>
                    <ScrollView style={{width: '100%'}} contentContainerStyle={{alignItems: 'center'}}>
                        {this.state.photos && <PhotoGallery
                            refresh={this.refresh.bind(this)}
                            navigation={this.props.navigation}
                            photos={this.state.photos}
                            onPressAdd={this._add_photo.bind(this)}/>}
                        <View>
                            <Text style={styles.label}>Prénom</Text>
                            <TextInput
                                style={styles.textInput}
                                value={this.state.user.name}
                                onChangeText={(name) => this.set_user('name', name)}/>
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
                                date={this.state.user.birth_date}
                                mode="date"
                                confirmBtnText="Confirmer"
                                cancelBtnText="Annuler"
                                onDateChange={birth_date => this.set_user('birth_date', birth_date)}/>
                        </View>

                        <View>
                            <Text style={styles.label}>Sexe</Text>
                            <Picker
                                style={styles.textInput}
                                selectedValue={this.state.user.gender}
                                onValueChange={(gender) => this.set_user('gender', gender)}
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
                                selectedValue={this.state.user.city}
                                onValueChange={(city) => this.set_user('city', city)}
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
                                value={this.state.user.description}
                                multiline
                                onChangeText={(description) => this.set_user('description', description)}/>
                        </View>
                        <View>
                            <Text style={styles.label}>Age minimum recherché</Text>
                            <TextInput
                                style={styles.textInput}
                                value={this.state.user.age_min ? this.state.user.age_min.toString() : ""}
                                keyboardType="numeric"
                                onChangeText={(age) => this.set_user('age', age)}/>
                        </View>
                        <View>
                            <Text style={styles.label}>Age maximum recherché</Text>
                            <TextInput
                                style={styles.textInput}
                                value={this.state.user.age_max ? this.state.user.age_max.toString(): ""}
                                keyboardType="numeric"
                                onChangeText={(age) => this.set_user('age_max', parseInt(age))}/>
                        </View>
                        <View>
                            <Text style={styles.label}>Sexe recherché</Text>
                            <Picker
                                style={styles.textInput}
                                selectedValue={this.state.user.target_gender}
                                onValueChange={(target_gender) => this.set_user('target_gender', target_gender)}
                            >
                                {
                                    this.state.genderList.map(item => <Picker.Item key={item.id} label={item.label} value={item.id}/>)
                                }
                            </Picker>
                            { this.state.target_genderError && <Text style={{color: "red"}}>{this.state.target_genderError}</Text> }
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>}
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
