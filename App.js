import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AccountScreen from './src/screens/AccountScreen';
import ChatScreen from './src/screens/ChatScreen';
import SwipeScreen from './src/screens/SwipeScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import AuthLoadingScreen from './src/screens/AuthLoadingScreen';
import InitScreen from './src/screens/InitScreen';



const AppStack = createBottomTabNavigator({
        Account: AccountScreen,
        Swipe: SwipeScreen,
        Chat: ChatScreen
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let IconComponent = Ionicons;
                let iconName;
                if (routeName === 'Account') {
                    iconName = `ios-people`;
                } else if (routeName === 'Swipe') {
                    iconName = `ios-heart`;
                } else if (routeName === 'Chat') {
                    iconName = `ios-chatbubbles`;
                }

                // You can return any component that you like here!
                return <IconComponent name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarOptions: {
            activeTintColor: '#006233',
            inactiveTintColor: 'gray',
        },
    });

const AuthStack = createStackNavigator({SignIn: SignInScreen, SignUp: SignUpScreen});

export default createAppContainer(
    createSwitchNavigator(
        {
            Init: InitScreen,
            AuthLoading: AuthLoadingScreen,
            App: AppStack,
            Auth: AuthStack,
        },
        {
            initialRouteName: 'AuthLoading',
        }
    )
);
