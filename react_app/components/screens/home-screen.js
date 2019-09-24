import React, { Component } from 'react';
import { Icon, Container, Content, View, Text, Button } from 'native-base';
import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';
import ActionButton from 'react-native-action-button';

import config from '../config/Config';
import Colors from '../config/colors';

import PairModal from '../modals/pair-modal';
import ControlsModal from '../modals/controls-modal';
import LogOutModal from '../modals/logout-modal';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {}
});

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  };

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
  // MQTT functions
  failed = responseObject => {
    console.log('failed');
    console.log(responseObject.errorMessage);
    console.log(responseObject.errorCode);
  };

  onConnectionLost = responseObject => {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  };

  onConnect = () => {
    const { client } = this.state;
    client.subscribe('/temp');
    client.subscribe('/light');
    client.subscribe('/humidity');
    console.log('Connected to the broker successfully');
  };

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

  // AsyncStorage functions
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

  // Component functions
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
            rounded
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

  componentDidMount() {
    this._retrieveData();
    this.checkPairing();
    console.log('MountH');
  }

  render() {
    return this.state.paired ? this.renderHome() : this.renderNoDevice();
  }
}

const styles = {
  home_content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary_dark
  },

  paired_content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary_dark
  },

  light_icon: {
    fontSize: 35,
    marginRight: 10,
    marginLeft: 5,
    color: Colors.yellow
  },

  humidity_icon: {
    fontSize: 35,
    marginRight: 10,
    marginLeft: 5,
    color: Colors.baby_blue
  },

  light_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },

  temp_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },

  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: Colors.primary_dark
  },

  sensor_view: {
    alignContent: 'flex-start',
    justifyContent: 'center',
    marginBottom: 5,
    alignSelf: 'flex-start',
    position: 'absolute',
    bottom: 5
  },

  temp_text: {
    color: Colors.white,
    fontSize: 90,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 200
  },

  temp_unit: {
    color: Colors.primary_light,
    fontSize: 60,
    marginTop: 70,
    alignSelf: 'center',
    marginBottom: 200
  },

  sensor_text: {
    color: Colors.white,
    fontSize: 45,
    alignSelf: 'flex-start'
  },

  unit_text: {
    color: Colors.primary_light,
    fontSize: 45,
    alignSelf: 'flex-start',
    marginLeft: 15
  },

  message_text: {
    color: Colors.white,
    fontSize: 20,
    marginBottom: 20
  },
  main_view: {
    flex: 1,
    backgroundColor: '#000000'
  },

  button: {
    alignSelf: 'center',
    marginTop: 15
  },

  button_text: {
    fontSize: 20,
    color: Colors.primary_dark
  },

  defView: {
    backgroundColor: Colors.primary_dark,
    alignContent: 'center',
    justifyContent: 'center'
  }
};
