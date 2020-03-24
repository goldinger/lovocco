import {createStackNavigator} from 'react-navigation-stack';
import AccountScreen from './screens/AccountScreen';


const AccountStack = createStackNavigator({Account: AccountScreen});

export default AccountStack;
