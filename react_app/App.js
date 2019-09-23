import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Root } from 'native-base';

// Component imports
import DrawerNav from './components/navs/drawer-navigator';
import Login from './components/screens/login-screen';
import SignupScreen from './components/screens/signup-screen';

// Represents the main content of the App, which has its own navigation system
class MainScreen extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return <DrawerNav />;
  }
}
// Basic navigation implementation to include a login&signup screen
const RootStack = createStackNavigator(
  {
    Login: Login,
    Main: MainScreen,
    SignUp: SignupScreen
  },
  { initialRouteName: 'Login' }
);

// Contains the navigation system and prepares it for rendering
const AppContainer = createAppContainer(RootStack);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogged: false // Keeps track of the login state of the user
    };
  }

  // Lets the app know the user has logged in during initialization
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userName');
      if (value !== null) {
        this.setState({ isLogged: true });
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  // Navigates to the login screen if the user is new, and to the main screen if the user has
  // logged in the past
  render() {
    return (
      <Root>{this.state.isLogged ? <AppContainer /> : <DrawerNav />}</Root>
    );
  }
}
