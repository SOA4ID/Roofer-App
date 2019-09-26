import React, { Component } from 'react';
import { AsyncStorage, Dimensions, Text, TextInput } from 'react-native';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';

import Colors from '../config/colors';

export default class PairModal extends Component {
  // Constructor fot the modal
  constructor(props) {
    super(props);

    this.state = {
      pairNumber: '',
      username: '',
      isPaired: false,
      PairedDevices: null
    };
  }

  // Show the modal on screen
  show = () => {
    this.myModal.open();
  };

  // Save paired devices to local storage
  _storeData = async () => {
    try {
      await AsyncStorage.setItem(
        'PairedDevices',
        JSON.stringify(this.state.PairedDevices)
      );
    } catch (error) {
      // Error saving data
    }
  };

  // Retrieve username from local storage
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('userName');
      if (value !== null) {
        this.setState({ username: value });
        console.log(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  // Pair device within the database
  pair = () => {
    console.log(this.state.pairNumber);
    console.log('username');
    console.log(this.state.username);
    console.log('got it?');
    return fetch('https://ancient-reaches-30875.herokuapp.com/devices/pair', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        unitNumber: this.state.pairNumber,
        owner: this.state.username
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('got response');
        console.log(responseJson.message);
        if (responseJson.message == 'paired') {
          this.setState({ isPaired: true });
          this.getPairedDevices();
        } else {
          console.log('failed');
          alert('Failed to pair roof');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Get paired devices from the database
  getPairedDevices = () => {
    return fetch('https://ancient-reaches-30875.herokuapp.com/users/roofs', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        unitNumber: this.state.pairNumber,
        username: this.state.username
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson.message);
        if (responseJson.status == 'success') {
          this.setState({ PairedDevices: responseJson.message });
          console.log(this.state.PairedDevices);
          this._storeData();
          this.props.parentComponent.setState({ paired: true });
          this.myModal.close();
        } else {
          alert('Failed to pair roof');
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Load variables before rendering the modal
  componentDidMount() {
    this._retrieveData();
    console.log(this.state.username);
  }

  // Render modal contents
  render() {
    return (
      <Modal
        ref={modal => (this.myModal = modal)}
        style={styles.modal}
        position='center'
        backdrop={true}
        onClosed={() => {
          //alert('Modal closed');
        }}
      >
        <Text style={styles.modal_title}>PAIRING</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ pairNumber: text })}
          placeholder='Model Number'
          value={this.state.pairNumber}
        />
        <Button
          style={styles.button_text}
          containerStyle={styles.modal_button}
          onPress={() => {
            if (this.state.pairNumber.length == 0) {
              alert('You must enter a model number before pairing');
              return;
            } else {
              this.pair();
            }
          }}
        >
          PAIR
        </Button>
      </Modal>
    );
  }
}

const styles = {
  button_text: {
    color: Colors.white,
    fontSize: 18
  },
  modal: {
    borderRadius: 25,
    height: 280,
    justifyContent: 'center',
    shadowRadius: 10,
    width: Dimensions.get('screen').width - 30
  },
  modal_button: {
    backgroundColor: Colors.primary_dark,
    borderRadius: 6,
    height: 50,
    justifyContent: 'center',
    marginLeft: 70,
    marginRight: 70,
    padding: 18
  },
  modal_title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 40,
    textAlign: 'center'
  },
  input: {
    borderBottomColor: Colors.primary_dark,
    borderBottomWidth: 1,
    color: Colors.primary_dark,
    height: 40,
    marginBottom: 40,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    paddingHorizontal: 10
  }
};
