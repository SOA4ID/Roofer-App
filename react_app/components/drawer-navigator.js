/* eslint-disable react-native/no-inline-styles */

import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
// Navigation Imports
import { createAppContainer } from 'react-navigation';
import {
  createDrawerNavigator,
  DrawerNavigatorItems,
} from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { Container, Content } from 'native-base';
// Screen Imports
import HomeScreen from './screens/home-screen';
import SettingsScreen from './screens/settings-screen';
// Asset Imports
import Colors from '../assets/colors';

class NavigationDrawerStructure extends Component {
  //Structure for the navigation Drawer
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          {/*Donute Button Image */}
          <Image
            source={require('../assets/images/menu.png')}
            style={{ width: 25, height: 25, marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const Home_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  First: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Home',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Colors.primary_dark,
      },
      headerTintColor: '#fff',
    }),
  },
});

const Settings_StackNavigator = createStackNavigator({
  //All the screen from the Screen1 will be indexed here
  First: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => ({
      title: 'Settings  ',
      headerLeft: <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        backgroundColor: Colors.primary_dark,
      },
      headerTintColor: '#fff',
    }),
  },
});

const CustomDrawerComponent = props => (
  <Container style={styles.container}>
    <Content>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />

      <DrawerNavigatorItems {...props} />
    </Content>
  </Container>
);

const DrawerNav = createDrawerNavigator(
  
  {
    Home: {
      screen: Home_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Home',
      },
    },
    Controls: {
      screen: Settings_StackNavigator,
      navigationOptions: {
        drawerLabel: 'Controls',
      },
    },
  },
  {
    initialRouteName: 'Home',
    contentComponent: CustomDrawerComponent,
    drawerOpenRoute: 'Drawer-open',
    DrawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
  },
);

const styles = {
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 75,
    marginBottom: 25,
    marginTop: 10,
  },
  container: {
    backgroundColor: Colors.white,
  },
  content: {
    backgroundColor: Colors.white,
  },
};

export default createAppContainer(DrawerNav);
