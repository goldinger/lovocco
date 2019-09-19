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

class SignUpScreen extends React.Component {
  static navigationOptions = {
    title: "Inscription",
  };

  state = {
    email: null,
    password1: null,
    password2: null,
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
                     onSubmitEditing={()=> this.password1.focus()}/>

          <TextInput style={styles.inputBox}
                     onChangeText={(password1) => this.setState({password1})}
                     underlineColorAndroid='rgba(0,0,0,0)'
                     placeholder="Password"
                     secureTextEntry={true}
                     placeholderTextColor = "#002f6c"
                     ref={(input) => this.password1 = input}
                     onSubmitEditing={()=> this.password2.focus()}
          />
          <TextInput style={styles.inputBox}
                     onChangeText={(password2) => this.setState({password2})}
                     underlineColorAndroid='rgba(0,0,0,0)'
                     placeholder="Password"
                     secureTextEntry={true}
                     placeholderTextColor = "#002f6c"
                     ref={(input) => this.password2 = input}
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
              AsyncStorage.setItem('userToken', responseJson.token);
              component.props.navigation.navigate('App');
            }
          });
    }
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
export default SignUpScreen;
