import React from 'react';
import { Component } from 'react';

import { View, Image, Text } from 'react-native';

import Colors from '../../assets/colors';

import LoginForm from './login-form';

export default class Login extends Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo_white.png')}
          />

          <Text style={styles.title}>Life, made simpler with Roofer.</Text>
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
    backgroundColor: Colors.primary_dark,
  },

  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    opacity: 0.8,
  },
  title: {
    color: Colors.white,
    marginTop: 15,
    opacity: 0.8,
  },
};
