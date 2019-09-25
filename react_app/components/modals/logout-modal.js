import React, { Component } from 'react';
import { AsyncStorage, Dimensions, Text, View } from 'react-native';
import { Button } from 'native-base';

import Modal from 'react-native-modalbox';
import Colors from '../config/colors';

export default class LogOutModal extends Component {
  show = () => {
    this.myModal.open();
  };

  cancel = () => {
    this.myModal.close();
  };

  logOut = async () => {
    try {
      await AsyncStorage.multiRemove(['userName', 'PairedDevices']);
    } catch (error) {
      // Error saving data
    }
  };

  confirmExit = () => {
    this.logOut();
    this.props.navigation.navigate('Login');
  };

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
  modal: {
    justifyContent: 'center',
    shadowRadius: 10,
    borderRadius: 25,
    width: Dimensions.get('screen').width - 30,
    height: 280
  },
  button_view: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center'
  },
  modal_title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30
  },
  modal_subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15
  },
  confirm_button: {
    padding: 18,
    marginTop: 50,
    marginLeft: 15,
    marginRight: 15,
    width: 100,
    height: 60,
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: Colors.success,
    alignSelf: 'center'
  },
  cancel_button: {
    padding: 18,
    marginTop: 50,
    marginLeft: 15,
    marginRight: 15,
    width: 100,
    height: 60,
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: Colors.danger,
    alignSelf: 'center'
  },
  button_text: {
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
    alignSelf: 'center'
  }
};
