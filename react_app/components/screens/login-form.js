import React from 'react';
import { Component } from 'react';

import { View, TextInput, TouchableOpacity, Text } from 'react-native';

import Colors from '../../assets/colors';
import { Toast } from 'native-base';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      message: '',
    };
  }

  login = () => {
    console.log(this.state.username);
    return fetch('https://ancient-reaches-30875.herokuapp.com/users/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.message);
        if (responseJson.message == 'LoggedIn') {
          this.props.navigation.navigate('Main');
        } else {
          Toast.show({
            text: responseJson.message,
            buttonText: 'Okay',
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="username"
          placeholderTextColor="rgba(255,255,255,0.8)"
          style={styles.input}
          onSubmitEditing={() => this.passwordInput.focus()}
          autoCapitalize="none"
          autoCorrect={false}
          ref={el => {
            this.username = el;
          }}
          onChangeText={username => this.setState({ username })}
          value={this.state.username}
        />
        <TextInput
          placeholder="password"
          placeholderTextColor="rgba(255,255,255,0.8)"
          secureTextEntry
          style={styles.input}
          ref={input => (this.passwordInput = input)}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.login()}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  container: {
    padding: 20,
  },

  input: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 10,
    color: Colors.white,
    paddingHorizontal: 10,
  },

  buttonContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 15,
    marginTop: 20,
  },

  buttonText: {
    textAlign: 'center',
    color: Colors.primary_text,
    fontWeight: '700',
  },
};
