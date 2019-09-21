import React, { Component } from 'react';
import { Text, Dimensions, TextInput, AsyncStorage } from 'react-native';

import Modal from 'react-native-modalbox';
import Button from 'react-native-button';

import Colors from '../../assets/colors';
import { colors } from 'react-native-elements';

export default class PairModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pairNumber: '',
      username: '',
      isPaired: false,
      PairedDevices: null,
    };
  }

  show = () => {
    this.myModal.open();
  };

  _storeData = async () => {
    try {
      await AsyncStorage.setItem(
        'PairedDevices',
        JSON.stringify(this.state.PairedDevices),
      );
    } catch (error) {
      // Error saving data
    }
  };

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

  pair = () => {
    console.log(this.state.pairNumber);
    console.log('username');
    console.log(this.state.username);
    console.log('got it?');
    return fetch('https://ancient-reaches-30875.herokuapp.com/devices/pair', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        unitNumber: this.state.pairNumber,
        owner: this.state.username,
      }),
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

  getPairedDevices = () => {
    return fetch('https://ancient-reaches-30875.herokuapp.com/users/roofs', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        unitNumber: this.state.pairNumber,
        username: this.state.username,
      }),
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

  componentDidMount() {
    this._retrieveData();
    console.log(this.state.username);
  }

  render() {
    return (
      <Modal
        ref={modal => (this.myModal = modal)}
        style={styles.modal}
        position="center"
        backdrop={true}
        onClosed={() => {
          //alert('Modal closed');
        }}>
        <Text style={styles.modal_title}>PAIRING</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ pairNumber: text })}
          placeholder="Model Number"
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
          }}>
          PAIR
        </Button>
      </Modal>
    );
  }
}

const styles = {
  modal: {
    justifyContent: 'center',
    shadowRadius: 10,
    width: Dimensions.get('screen').width - 30,
    height: 280,
  },
  modal_title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
  input: {
    height: 40,
    borderBottomColor: Colors.primary_dark,
    borderBottomWidth: 1,
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 40,
    color: Colors.primary_dark,
    paddingHorizontal: 10,
  },
  modal_button: {
    padding: 18,
    marginLeft: 70,
    marginRight: 70,
    height: 50,
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: Colors.primary_dark,
  },
  button_text: {
    fontSize: 18,
    color: Colors.white,
  },
};
