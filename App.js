import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChatScreen from './src/screens/Chat/ChatScreen';
import SwipeScreen from './src/screens/Swipe/SwipeScreen';
import SignInScreen from './src/screens/Authentication/SignInScreen';
import SignUpScreen from './src/screens/Authentication/SignUpScreen';
import AuthLoadingScreen from './src/screens/Authentication/AuthLoadingScreen';
import AccountStack from './src/AccountStack';


const AppStack = createBottomTabNavigator({
        Account: AccountStack,
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
            AuthLoading: AuthLoadingScreen, // verify if user token exists and redirect to the right stack
            App: AppStack,
            Auth: AuthStack,
        },
        {
            initialRouteName: 'AuthLoading',
        }
    )
);
