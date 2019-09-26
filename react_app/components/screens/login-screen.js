import React from 'react';
import { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import Colors from '../config/colors';

import LoginForm from '../forms/login-form';

export default class Login extends Component {
  // Disable headers for the LogIn screen
  static navigationOptions = {
    header: null
  };

  // Render the LogIn screen
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo_container}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo_white.png')}
          />
          <Text style={styles.button_text}>
            {' '}
            Don't have an account yet? Sign Up
          </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SignUp')}
            style={styles.button}
          >
            <Text style={styles.button_text}> HERE </Text>
          </TouchableOpacity>

          <Text style={styles.title}>LOGIN</Text>
        </View>
        <View style={styles.formContainer}>
          <LoginForm navigation={this.props.navigation} />
        </View>
      </View>
    );
  }
}

const styles = {
  button: {
    borderRadius: 15
  },
  button_text: {
    color: Colors.primary_text,
    fontWeight: '700',
    marginTop: 15,
    textAlign: 'center'
  },
  container: {
    backgroundColor: Colors.primary_dark,
    flex: 1
  },
  logo: {
    height: 100,
    opacity: 0.8,
    width: 100
  },
  logo_container: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center'
  },
  title: {
    bottom: 0,
    color: Colors.white,
    fontSize: 25,
    marginTop: 15,
    opacity: 0.8,
    position: 'absolute'
  }
};
