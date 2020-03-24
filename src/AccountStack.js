import {createStackNavigator} from 'react-navigation-stack';
import AccountScreen from './screens/Account/AccountScreen';


const AccountStack = createStackNavigator({Account: AccountScreen});

export default AccountStack;
