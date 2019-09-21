import React, { Component } from 'react';
import { Icon, Container, Content, View, Text, Button } from 'native-base';
import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';

import config from '../../assets/Config';
import Colors from '../../assets/colors';

import PairModal from './modal';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    // eslint-disable-next-line no-undef
    const client = new Paho.MQTT.Client(config.host, config.port, 'android');
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;
    client.connect({
      onSuccess: this.onConnect,
      useSSL: true,
      userName: config.username,
      password: config.password,
      onFailure: this.failed,
    });

    this.state = {
      temp: '0',
      light: '0',
      humidity: '0',
      username: 'NO-User',
      paired: false,
      client,
    };
  }

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
    //this.setState({message: message.payloadString});
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

  renderHome() {
    return (
      <Container>
        <Content contentContainerStyle={styles.home_content}>
          <View style={styles.temp_view}>
            <Text style={styles.temp_text}>{this.state.temp}</Text>
            <Text style={styles.temp_unit}>°C</Text>
          </View>
          <View>
            <Text>{this.state.username}</Text>
          </View>
          <View style={styles.sensor_view}>
            <View style={styles.light_view}>
              <Icon name="light-up" type="Entypo" style={styles.light_icon} />
              <Text style={styles.sensor_text}>{this.state.light}</Text>
              <Text style={styles.unit_text}>%</Text>
            </View>
            <View style={styles.light_view}>
              <Icon name="water" type="Entypo" style={styles.humidity_icon} />
              <Text style={styles.sensor_text}>{this.state.humidity}</Text>
              <Text style={styles.unit_text}>%</Text>
            </View>
          </View>
        </Content>
      </Container>
    );
  }

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
            onPress={() => this.pairModal.show()}>
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
    console.log('MountHome');
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
    backgroundColor: Colors.primary_dark,
  },

  paired_content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary_dark,
  },

  light_icon: {
    fontSize: 35,
    marginRight: 10,
    marginLeft: 5,
    color: Colors.yellow,
  },

  humidity_icon: {
    fontSize: 35,
    marginRight: 10,
    marginLeft: 5,
    color: Colors.baby_blue,
  },

  light_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  temp_view: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },

  sensor_view: {
    alignContent: 'flex-start',
    justifyContent: 'center',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },

  temp_text: {
    color: Colors.white,
    fontSize: 90,
    alignSelf: 'center',
    marginTop: 50,
    marginBottom: 200,
  },

  temp_unit: {
    color: Colors.primary_light,
    fontSize: 60,
    marginTop: 70,
    alignSelf: 'center',
    marginBottom: 200,
  },

  sensor_text: {
    color: Colors.white,
    fontSize: 45,
    alignSelf: 'flex-start',
  },

  unit_text: {
    color: Colors.primary_light,
    fontSize: 45,
    alignSelf: 'flex-start',
    marginLeft: 15,
  },

  message_text: {
    color: Colors.white,
    fontSize: 20,
    marginBottom: 20,
  },
  main_view: {
    flex: 1,
    backgroundColor: '#000000',
  },

  button: {
    alignSelf: 'center',
    marginTop: 15,
  },

  button_text: {
    fontSize: 20,
    color: Colors.primary_dark,
  },

  defView: {
    backgroundColor: Colors.primary_dark,
    alignContent: 'center',
    justifyContent: 'center',
  },
};
