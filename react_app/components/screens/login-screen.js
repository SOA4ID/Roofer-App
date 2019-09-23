import React from 'react';
import { Component } from 'react';

import { Image, Text, TouchableOpacity, View } from 'react-native';

import Colors from '../config/colors';

import LoginForm from '../forms/login-form';

export default class Login extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo_white.png')}
          />
          <Text style={styles.buttonText}>
            {' '}
            Don't have an account yet? Sign Up
          </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SignUp')}
          >
            <Text style={styles.buttonText}> HERE </Text>
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
  container: {
    flex: 1,
    backgroundColor: Colors.primary_dark
  },

  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center'
  },
  logo: {
    width: 100,
    height: 100,
    opacity: 0.8
  },
  title: {
    color: Colors.white,
    fontSize: 25,
    marginTop: 15,
    opacity: 0.8,
    position: 'absolute',
    bottom: 0
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.primary_text,
    fontWeight: '700',
    marginTop: 15
  }
};
