import React from 'react';
import {AsyncStorage, Button, Text, View} from 'react-native';

class AccountScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  render() {
    return (
        <View>
          <Button title="Show me more of the app" onPress={this._showMoreApp} />
          <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
        </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Swipe');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}


export default AccountScreen;
