import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Root } from 'native-base';

import Login from './components/screens/login-screen';
import SignupScreen from './components/screens/signup-screen';
import HomeScreen from './components/screens/home-screen';

// Basic navigation implementation to include a login&signup screen
const RootStack = createStackNavigator(
  {
    Login: Login,
    Main: HomeScreen,
    SignUp: SignupScreen
  },
  { initialRouteName: 'Main' }
);

// Main App Navigation
const LoginStack = createStackNavigator(
  {
    Login: Login,
    Main: HomeScreen,
    SignUp: SignupScreen
  },
  { initialRouteName: 'Login' }
);

// Contains the navigation system and prepares it for rendering
const AppContainer = createAppContainer(RootStack);
const LoginContainer = createAppContainer(LoginStack);

export default class App extends Component {
  // Constructor for the app
  constructor(props) {
    super(props);

    this._retrieveData();
    console.disableYellowBox = true; // Disables warnings

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

  // Render Main App Content
  render() {
    return (
      <Root>{this.state.isLogged ? <AppContainer /> : <LoginContainer />}</Root>
    );
  }
}
