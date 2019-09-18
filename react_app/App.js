import React, {Component} from 'react';

// Component imports
import DrawerNav from './components/drawer-navigator';
import {Root} from 'native-base';

// Asset imports

export default class App extends Component {
  render() {
    return (
      <Root>
        <DrawerNav />
      </Root>
    );
  }
}
