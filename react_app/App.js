import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Root } from 'native-base';

// Component imports
import DrawerNav from './components/drawer-navigator';
import Login from './components/screens/login-screen';
import SignupScreen from './components/screens/signup-screen';

class MainScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    return <DrawerNav />;
  }
}
// Asset imports

const RootStack = createStackNavigator(
  {
    Login: Login,
    Main: MainScreen,
    SignUp: SignupScreen,
  },
  { initialRouteName: 'Login' },
);

const AppContainer = createAppContainer(RootStack);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogged: false,
    };
  }
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userName');
      if (value !== null) {
        // We have data!!
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  render() {
    return (
      <Root>
        <DrawerNav />
      </Root>
    );
  }
}
