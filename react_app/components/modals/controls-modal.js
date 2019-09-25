import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
  FlatList,
  Text,
  View
} from 'react-native';
import { Body, CheckBox, ListItem, Button, Col } from 'native-base';

import Modal from 'react-native-modalbox';

import Colors from '../config/colors';

export default class ControlsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deployer_auto: false,
      descender_auto: false,
      isPaired: true,
      isLoading: true,
      paired: []
    };
  }

  show = () => {
    this.myModal.open();
  };

  getDevices = async () => {
    try {
      const value = await AsyncStorage.getItem('PairedDevices');
      if (value !== null) {
        this.setState({ paired: JSON.parse(value) });
        console.log(value);
        this.setState({ isLoading: false });
      } else {
        console.log('value is null');
        this.setState({ isPaired: false });
      }
    } catch (error) {
      console.log(error);
    }
  };

  stateManager = key => {
    console.log(key);
    if (key == 'DP-01') {
      return this.state.deployer_auto;
    } else {
      return this.state.descender_auto;
    }
  };
  toggle = (onCmd, offCmd, key) => {
    if (key == 'DP-01') {
      if (this.state.deployer_auto) {
        this.setState({ deployer_auto: false });
        this.props.parentComponent.state.client.publish('/modes', offCmd);
      } else {
        this.setState({ deployer_auto: true });
        this.props.parentComponent.state.client.publish('/modes', onCmd);
      }
    } else {
      if (this.state.descender_auto) {
        this.setState({ descender_auto: false });
        this.props.parentComponent.state.client.publish('/modes', offCmd);
      } else {
        this.setState({ descender_auto: true });
        this.props.parentComponent.state.client.publish('/modes', onCmd);
      }
    }
  };

  activate = cmd => {
    this.props.parentComponent.state.client.publish('/actions', cmd);
  };

  componentDidMount = () => {
    this.getDevices();
  };

  renderLoading() {
    return (
      <View>
        {this.state.isPaired ? (
          <ActivityIndicator size='large' color={Colors.primary_dark} />
        ) : (
          <Text> NO PAIRED DEVICES </Text>
        )}
      </View>
    );
  }

  renderList() {
    return (
      <View>
        <Text style={styles.modal_title}> DEVICES </Text>
        <FlatList
          data={this.state.paired}
          keyExtractor={item => item.unitNumber}
          extraData={this.state}
          renderItem={({ item }) => (
            <CustomRow
              name={item.name}
              parentComponent={this}
              onCmd={item.autoOnCmd}
              offCmd={item.autoOffCmd}
              actionCmd={item.actionCmd}
              unitN={item.unitNumber}
            />
          )}
        />
        <Button
          style={styles.modal_cancel_button}
          onPress={() => this.myModal.close()}
        >
          <Text style={styles.button_text}> X </Text>
        </Button>
      </View>
    );
  }

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
        {this.state.isLoading ? this.renderLoading() : this.renderList()}
      </Modal>
    );
  }
}

const styles = {
  modal: {
    justifyContent: 'flex-start',
    shadowRadius: 10,
    borderRadius: 25,
    width: Dimensions.get('screen').width - 30,
    height: 500
  },
  modal_title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    color: Colors.primary_dark
  },
  modal_subtitle: {
    fontSize: 16,
    color: Colors.primary_dark,
    marginLeft: 17
  },

  modal_content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    marginTop: 15,
    marginBottom: 5
  },
  modal_button: {
    padding: 18,
    marginLeft: 70,
    marginRight: 70,
    marginTop: 20,
    height: 50,
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: Colors.primary_dark
  },
  modal_cancel_button: {
    padding: 18,
    marginTop: 40,
    width: 60,
    height: 60,
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: Colors.primary_text,
    alignSelf: 'center'
  },
  button_text: {
    fontSize: 18,
    color: Colors.white,
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  checkbox_text: {
    marginLeft: 10
  }
};

const CustomRow = ({
  name,
  parentComponent,
  onCmd,
  offCmd,
  actionCmd,
  unitN
}) => (
  <View style={styles.modal_content}>
    <Text style={styles.modal_subtitle}>{name}</Text>
    <ListItem>
      <CheckBox
        checked={parentComponent.stateManager(unitN)}
        onPress={() => parentComponent.toggle(onCmd, offCmd, unitN)}
      />
      <Body>
        <Text style={styles.checkbox_text}>Enable Automatic Mode</Text>
      </Body>
    </ListItem>
    <Button
      style={styles.modal_button}
      onPress={() => parentComponent.activate(actionCmd)}
    >
      <Text style={styles.button_text}> ACTIVATE ROOF </Text>
    </Button>
  </View>
);
