import React, { Component } from 'react';
import { View, Text } from 'react-native';
import {
  Button,
  Container,
  Content,
  CheckBox,
  ListItem,
  Body,
} from 'native-base';

import Colors from '../../assets/colors';

import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';

import config from '../../assets/Config';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {},
});

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);

    // eslint-disable-next-line no-undef
    const client = new Paho.MQTT.Client(config.host, config.port, 'android2');
    client.onConnectionLost = this.onConnectionLost;
    client.connect({
      onSuccess: this.onConnect,
      useSSL: true,
      userName: config.username,
      password: config.password,
      onFailure: this.failed,
    });

    this.state = {
      deployer_auto: false,
      descender_auto: false,
      client,
      paired: null,
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

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('PairedDevices');
      if (value !== null) {
        this.setState({ paired: JSON.parse(value) });
        console.log(value);
      } else {
        console.log('value is null');
      }
    } catch (error) {
      console.log(error);
    }
  };

  toggleDeployerMode = () => {
    if (this.state.deployer_auto) {
      this.setState({ deployer_auto: false });
      this.state.client.publish('/modes', '02');
    } else {
      this.setState({ deployer_auto: true });
      this.state.client.publish('/modes', '12');
    }
  };

  toggleDescenderMode = () => {
    if (this.state.descender_auto) {
      this.setState({ descender_auto: false });
      this.state.client.publish('/modes', '21');
    } else {
      this.setState({ descender_auto: true });
      this.state.client.publish('/modes', '20');
    }
  };

  activateDeployer = () => {
    this.state.client.publish('/actions', '10');
  };

  activateDescender = () => {
    this.state.client.publish('/actions', '01');
  };

  componentDidMount() {
    console.log('mount Settings');
    this._retrieveData();
    console.log(this.state.paired);
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.content}>
          <View style={styles.main_view}>
            <Text style={styles.title_text}>DEPLOYER</Text>
            <ListItem>
              <CheckBox
                checked={this.state.deployer_auto}
                onPress={() => this.toggleDeployerMode()}
              />
              <Body>
                <Text style={styles.option_text}>Enable Automatic Mode</Text>
              </Body>
            </ListItem>
            <Button
              light
              rounded
              block
              style={styles.button}
              onPress={() => console.log(this.state.paired)}>
              <Text style={styles.button_text}> ACTIVATE ROOF </Text>
            </Button>
          </View>
          <View style={styles.main_view}>
            <Text style={styles.title_text}>DESCENDER</Text>
            <ListItem>
              <CheckBox
                checked={this.state.descender_auto}
                onPress={() => this.toggleDescenderMode()}
              />
              <Body>
                <Text style={styles.option_text}>Enable Automatic Mode</Text>
              </Body>
            </ListItem>
            <Button
              light
              rounded
              block
              style={styles.button}
              onPress={() => this.activateDescender()}>
              <Text style={styles.button_text}> ACTIVATE ROOF </Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = {
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.primary_dark,
  },

  main_view: {
    alignSelf: 'flex-start',
    marginBottom: 50,
  },

  auto_view: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  title_text: {
    fontSize: 30,
    color: Colors.primary_light,
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 10,
  },

  option_text: {
    fontSize: 20,
    color: Colors.white,
    marginLeft: 15,
    alignSelf: 'flex-end',
  },

  button: {
    alignSelf: 'center',
    marginTop: 15,
  },

  button_text: {
    fontSize: 20,
    color: Colors.primary_dark,
  },
};
