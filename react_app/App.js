import React, { Component } from 'react';
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
  render() {
    return (
      <Root>
        <AppContainer />
      </Root>
    );
  }
}
