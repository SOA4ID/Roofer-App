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

export default class SignupForm extends Component {
  // Constructor for the SignUp page
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      confirm: '',
      email: ''
    };
  }

  // Store credential in the database
  signup = () => {
    if (this.state.password !== this.state.confirm) {
      Toast.show({
        text: 'Passwords do not match',
        buttonText: 'Okay'
      });
    } else {
      console.log(this.state.username);
      return fetch('https://ancient-reaches-30875.herokuapp.com/users/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        })
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson.message);
          if (responseJson.message == 'Accepted') {
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
    }
  };

  // Save username to local storage
  _storeData = async () => {
    try {
      await AsyncStorage.setItem('userName', this.state.username);
    } catch (error) {
      // Error saving data
    }
  };

  // Render the SignUp page
  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder='username'
          placeholderTextColor='rgba(255,255,255,0.8)'
          style={styles.input}
          onSubmitEditing={() => this.emailInput.focus()}
          autoCapitalize='none'
          autoCorrect={false}
          ref={input => (this.usernameInput = input)}
          onChangeText={username => this.setState({ username })}
          value={this.state.username}
        />
        <TextInput
          placeholder='email'
          placeholderTextColor='rgba(255,255,255,0.8)'
          style={styles.input}
          onSubmitEditing={() => this.passwordInput.focus()}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          ref={input => (this.emailInput = input)}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          placeholder='password'
          placeholderTextColor='rgba(255,255,255,0.8)'
          secureTextEntry
          style={styles.input}
          onSubmitEditing={() => this.confirmPasswordInput.focus()}
          ref={input => (this.passwordInput = input)}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />

        <TextInput
          placeholder='confirm password'
          placeholderTextColor='rgba(255,255,255,0.8)'
          secureTextEntry
          style={styles.input}
          ref={input => (this.confirmPasswordInput = input)}
          onChangeText={confirm => this.setState({ confirm })}
          value={this.state.confirm}
        />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.signup()}
        >
          <Text style={styles.buttonText}>SIGN UP</Text>
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
