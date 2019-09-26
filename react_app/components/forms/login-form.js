import React from 'react';
import { Component } from 'react';

import {
  AsyncStorage,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Toast } from 'native-base';

import Colors from '../config/colors';

export default class LoginForm extends Component {
  // Constructor for the LogIn page
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      message: ''
    };
  }

  // Check credentials with the database
  login = () => {
    console.log(this.state.username);
    return fetch('https://ancient-reaches-30875.herokuapp.com/users/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.message);
        if (responseJson.message == 'LoggedIn') {
          this._storeData();
          this.props.navigation.navigate('Main');
        } else {
          Toast.show({
            text: responseJson.message,
            buttonText: 'Okay'
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Save username to local storage
  _storeData = async () => {
    try {
      await AsyncStorage.setItem('userName', this.state.username);
    } catch (error) {
      // Error saving data
    }
  };

  // Render the LogIn page
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder='username'
          placeholderTextColor='rgba(255,255,255,0.8)'
          style={styles.input}
          onSubmitEditing={() => this.passwordInput.focus()}
          autoCapitalize='none'
          autoCorrect={false}
          ref={el => {
            this.username = el;
          }}
          onChangeText={username => this.setState({ username })}
          value={this.state.username}
        />
        <TextInput
          placeholder='password'
          placeholderTextColor='rgba(255,255,255,0.8)'
          secureTextEntry
          style={styles.input}
          ref={input => (this.passwordInput = input)}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.login()}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  buttonContainer: {
    backgroundColor: Colors.white,
    marginTop: 20,
    paddingVertical: 15
  },
  buttonText: {
    color: Colors.primary_text,
    fontWeight: '700',
    textAlign: 'center'
  },
  container: {
    padding: 20
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: Colors.white,
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10
  }
};
