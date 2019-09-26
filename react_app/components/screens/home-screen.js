import React, { Component } from 'react';
import { Button, Container, Content, Icon, Text, View } from 'native-base';
import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';
import ActionButton from 'react-native-action-button';

import config from '../config/Config';
import Colors from '../config/colors';

import PairModal from '../modals/pair-modal';
import ControlsModal from '../modals/controls-modal';
import LogOutModal from '../modals/logout-modal';

init({
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  size: 10000,
  storageBackend: AsyncStorage,
  sync: {}
});

export default class HomeScreen extends Component {
  // Disable headers for the home screen
  static navigationOptions = {
    header: null
  };

  // Constructor for the home screen
  constructor(props) {
    super(props);

    const client = new Paho.MQTT.Client(config.host, config.port, 'android');
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;
    client.connect({
      onSuccess: this.onConnect,
      useSSL: true,
      userName: config.username,
      password: config.password,
      onFailure: this.failed
    });

    this.state = {
      humidity: '0',
      light: '0',
      paired: false,
      temp: '0',
      username: 'NO-User',
      client
    };
  }
  // To be called when the MQTT connection has failed
  failed = responseObject => {
    console.log('failed');
    console.log(responseObject.errorMessage);
    console.log(responseObject.errorCode);
  };

  // To be called when the MQTT client has lost connection
  onConnectionLost = responseObject => {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  };

  // To be called when the MQTT client has successfully connected to the broker
  onConnect = () => {
    const { client } = this.state;
    client.subscribe('/temp');
    client.subscribe('/light');
    client.subscribe('/humidity');
    console.log('Connected to the broker successfully');
  };

  // to be called when data has been published to the MQTT broker
  onMessageArrived = message => {
    switch (message.destinationName) {
      case '/temp':
        this.setState({ temp: message.payloadString });
        break;

      case '/light':
        this.setState({ light: message.payloadString });
        break;

      case '/humidity':
        this.setState({ humidity: message.payloadString });
        break;
    }
  };

  // Get username from the local storage
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

  // Check if the user has any paired devices
  checkPairing = async () => {
    try {
      const value = await AsyncStorage.getItem('PairedDevices');
      if (value !== null) {
        this.setState({ paired: true });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  // To be rendered when paired devices are found
  renderHome() {
    return (
      <Container>
        <Content contentContainerStyle={styles.home_content}>
          <View style={styles.temp_view}>
            <Text style={styles.temp_text}>{this.state.temp}</Text>
            <Text style={styles.temp_unit}>°C</Text>
          </View>
          <View style={styles.sensor_view}>
            <View style={styles.light_view}>
              <Icon name='light-up' type='Entypo' style={styles.light_icon} />
              <Text style={styles.sensor_text}>{this.state.light}</Text>
              <Text style={styles.unit_text}>%</Text>
            </View>
            <View style={styles.light_view}>
              <Icon name='water' type='Entypo' style={styles.humidity_icon} />
              <Text style={styles.sensor_text}>{this.state.humidity}</Text>
              <Text style={styles.unit_text}>%</Text>
            </View>
          </View>
          <ActionButton
            buttonColor={Colors.white}
            backgroundColor='rgba(255,255,255,0.2)'
            buttonTextStyle={styles.actionButtonIcon}
          >
            <ActionButton.Item
              buttonColor={Colors.primary_light}
              title='Log Out'
              onPress={() => this.logoutModal.show()}
            >
              <Icon name='md-exit' style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor={Colors.primary_light}
              title='Device Options'
              onPress={() => this.controlsModal.show()}
            >
              <Icon name='md-options' style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
          <LogOutModal
            ref={modal => (this.logoutModal = modal)}
            navigation={this.props.navigation}
          />
          <ControlsModal
            ref={modal => (this.controlsModal = modal)}
            parentComponent={this}
          />
        </Content>
      </Container>
    );
  }

  // TO be rendered when the user has no paired devices
  renderNoDevice() {
    return (
      <Container>
        <Content contentContainerStyle={styles.paired_content}>
          <View style={styles.defView}>
            <Text style={styles.message_text}>
              No devices have been paired yet
            </Text>
          </View>
          <Button
            light
            style={styles.button}
            onPress={() => this.pairModal.show()}
          >
            <Text style={styles.button_text}> PAIR NEW DEVICE </Text>
          </Button>
        </Content>
        <PairModal
          ref={modal => (this.pairModal = modal)}
          parentComponent={this}
        />
      </Container>
    );
  }

  // Load variables before rendering the screen
  componentDidMount() {
    this._retrieveData();
    this.checkPairing();
    console.log('MountH');
  }

  // Manages what is rendered on the screen and when
  render() {
    return this.state.paired ? this.renderHome() : this.renderNoDevice();
  }
}

const styles = {
  actionButtonIcon: {
    color: Colors.primary_dark,
    fontSize: 20,
    height: 22
  },
  button: {
    alignSelf: 'center',
    borderRadius: 15,
    height: 50,
    marginTop: 15
  },
  button_text: {
    color: Colors.primary_dark,
    fontSize: 20
  },
  defView: {
    alignContent: 'center',
    backgroundColor: Colors.primary_dark,
    justifyContent: 'center'
  },
  home_content: {
    alignItems: 'center',
    backgroundColor: Colors.primary_dark,
    flex: 1,
    justifyContent: 'space-between'
  },
  humidity_icon: {
    color: Colors.baby_blue,
    fontSize: 35,
    marginLeft: 5,
    marginRight: 10
  },
  light_icon: {
    color: Colors.yellow,
    fontSize: 35,
    marginLeft: 5,
    marginRight: 10
  },
  light_view: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  main_view: {
    backgroundColor: Colors.black,
    flex: 1
  },
  message_text: {
    color: Colors.white,
    fontSize: 20,
    marginBottom: 20
  },
  paired_content: {
    alignItems: 'center',
    backgroundColor: Colors.primary_dark,
    flex: 1,
    justifyContent: 'center'
  },
  sensor_text: {
    alignSelf: 'flex-start',
    color: Colors.white,
    fontSize: 45
  },
  sensor_view: {
    alignContent: 'flex-start',
    alignSelf: 'flex-start',
    bottom: 5,
    justifyContent: 'center',
    marginBottom: 5,
    position: 'absolute'
  },
  temp_text: {
    alignSelf: 'center',
    color: Colors.white,
    fontSize: 90,
    marginBottom: 200,
    marginTop: 50
  },
  temp_unit: {
    alignSelf: 'center',
    color: Colors.primary_light,
    fontSize: 60,
    marginBottom: 200,
    marginTop: 70
  },
  temp_view: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  unit_text: {
    alignSelf: 'flex-start',
    color: Colors.primary_light,
    fontSize: 45,
    marginLeft: 15
  }
};
