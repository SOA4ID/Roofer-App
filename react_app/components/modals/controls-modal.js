import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
  FlatList,
  Text,
  View
} from 'react-native';
import { Body, Button, CheckBox, ListItem } from 'native-base';
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

  // Function used to show the modal
  show = () => {
    this.myModal.open();
  };

  // Retrieve list of paired devices from the local storage
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

  // Manages the automatic states for each individual roof
  stateManager = key => {
    console.log(key);
    if (key == 'DP-01') {
      return this.state.deployer_auto;
    } else {
      return this.state.descender_auto;
    }
  };

  // Controls the automatic state of each individual roof
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

  // Tells the MQTT Broker to activate a particular roof
  activate = cmd => {
    this.props.parentComponent.state.client.publish('/actions', cmd);
  };

  // Load components before rendering the page
  componentDidMount = () => {
    this.getDevices();
  };

  // To be rendered when the device is still loading elements
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

  // To be rendered when everything is ready to be shown
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

  // Manages what is rendered on the screen an when
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
  button_text: {
    alignSelf: 'center',
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  checkbox_text: {
    marginLeft: 10
  },
  modal: {
    borderRadius: 25,
    height: 500,
    justifyContent: 'flex-start',
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
    marginTop: 20,
    padding: 18
  },
  modal_cancel_button: {
    alignSelf: 'center',
    backgroundColor: Colors.primary_text,
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    marginTop: 40,
    padding: 18,
    width: 60
  },
  modal_content: {
    alignContent: 'flex-start',
    flex: 1,
    justifyContent: 'flex-start',
    marginBottom: 5,
    marginTop: 15
  },
  modal_title: {
    color: Colors.primary_dark,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center'
  },
  modal_subtitle: {
    color: Colors.primary_dark,
    fontSize: 16,
    marginLeft: 17
  }
};

// Custom UI element to render the controls for each individual roof
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
