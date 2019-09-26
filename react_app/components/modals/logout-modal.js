import React, { Component } from 'react';
import { AsyncStorage, Dimensions, Text, View } from 'react-native';
import { Button } from 'native-base';
import Modal from 'react-native-modalbox';

import Colors from '../config/colors';

export default class LogOutModal extends Component {
  // Used to show the modal on screen
  show = () => {
    this.myModal.open();
  };

  // Leave without doing any changes
  cancel = () => {
    this.myModal.close();
  };

  // Delete user data from local storage
  logOut = async () => {
    try {
      await AsyncStorage.multiRemove(['userName', 'PairedDevices']);
    } catch (error) {
      // Error saving data
    }
  };

  // Navigate to login screen after user has logged out
  confirmExit = () => {
    this.logOut();
    this.props.navigation.navigate('Login');
  };

  // Render components on screen
  render() {
    return (
      <Modal
        ref={modal => (this.myModal = modal)}
        style={styles.modal}
        position='center'
        backdrop={true}
      >
        <Text style={styles.modal_title}>LOG OUT</Text>
        <Text style={styles.modal_subtitle}>
          Are you sure you want to Log Out?
        </Text>
        <View style={styles.button_view}>
          <Button
            style={styles.cancel_button}
            onPress={() => this.myModal.close()}
          >
            <Text style={styles.button_text}> NO</Text>
          </Button>
          <Button
            style={styles.confirm_button}
            onPress={() => this.confirmExit()}
          >
            <Text style={styles.button_text}> YES</Text>
          </Button>
        </View>
      </Modal>
    );
  }
}

const styles = {
  button_text: {
    alignSelf: 'center',
    color: Colors.white,
    fontSize: 18,
    textAlign: 'center'
  },
  button_view: {
    alignContent: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  cancel_button: {
    alignSelf: 'center',
    backgroundColor: Colors.danger,
    borderRadius: 15,
    height: 60,
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 50,
    padding: 18,
    width: 100
  },
  confirm_button: {
    alignSelf: 'center',
    backgroundColor: Colors.success,
    borderRadius: 15,
    height: 60,
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 50,
    padding: 18,
    width: 100
  },
  modal: {
    borderRadius: 25,
    height: 280,
    justifyContent: 'center',
    shadowRadius: 10,
    width: Dimensions.get('screen').width - 30
  },
  modal_title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 10,
    textAlign: 'center'
  },
  modal_subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 5,
    textAlign: 'center'
  }
};
