import {createStackNavigator} from 'react-navigation-stack';
import AccountScreen from './screens/Account/AccountScreen';
import PhotoScreen from './screens/Account/PhotoScreen';


const AccountStack = createStackNavigator({Account: AccountScreen, Photo: PhotoScreen});

export default AccountStack;
