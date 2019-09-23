import React, { Component } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import {
  Body,
  Button,
  CheckBox,
  Container,
  Content,
  ListItem
} from 'native-base';

import Colors from '../config/colors';

import init from 'react_native_mqtt';
import { AsyncStorage } from 'react-native';

import config from '../config/Config';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  reconnect: true,
  sync: {}
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
      onFailure: this.failed
    });

    this.state = {
      client,
      deployer_auto: false,
      descender_auto: false,
      isPaired: false,
      paired: null
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
        this.setState({ isPaired: true });
        console.log(this.state.isPaired);
      } else {
        console.log('value is null');
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
        this.state.client.publish('/modes', offCmd);
      } else {
        this.setState({ deployer_auto: true });
        this.state.client.publish('/modes', onCmd);
      }
    } else {
      if (this.state.descender_auto) {
        this.setState({ descender_auto: false });
        this.state.client.publish('/modes', offCmd);
      } else {
        this.setState({ descender_auto: true });
        this.state.client.publish('/modes', onCmd);
      }
    }
  };

  activate = cmd => {
    this.state.client.publish('/actions', cmd);
  };

  componentDidMount() {
    console.log('mount Settings');
    this._retrieveData();
  }

  renderLoading() {
    return (
      <Container>
        <Content contentContainerStyle={styles.loading_content}>
          <ActivityIndicator size='large' color={Colors.white} />
        </Content>
      </Container>
    );
  }

  renderTest() {
    return (
      <Container>
        <Content contentContainerStyle={styles.content}>
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
        </Content>
      </Container>
    );
  }

  render() {
    return this.state.isPaired ? this.renderTest() : this.renderLoading();
  }
}

const styles = {
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.primary_dark
  },

  loading_content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary_dark
  },

  main_view: {
    alignSelf: 'flex-start',
    marginBottom: 50
  },

  auto_view: {
    flexDirection: 'row',
    justifyContent: 'center'
  },

  title_text: {
    fontSize: 30,
    color: Colors.primary_light,
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginTop: 20,
    marginBottom: 10
  },

  option_text: {
    fontSize: 20,
    color: Colors.white,
    marginLeft: 15,
    alignSelf: 'flex-end'
  },

  button: {
    alignSelf: 'center',
    marginTop: 15
  },

  button_text: {
    fontSize: 20,
    color: Colors.primary_dark
  },
  custom_view: {
    alignSelf: 'center'
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
  <View style={styles.main_view}>
    <Text style={styles.title_text}>{name}</Text>
    <ListItem>
      <CheckBox
        checked={parentComponent.stateManager(unitN)}
        onPress={() => parentComponent.toggle(onCmd, offCmd, unitN)}
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
      onPress={() => parentComponent.activate(actionCmd)}
    >
      <Text style={styles.button_text}> ACTIVATE ROOF </Text>
    </Button>
  </View>
);
