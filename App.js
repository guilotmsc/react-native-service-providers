import React, {Component} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { createRootNavigator, SignedOut, SignedIn } from './router.js';

import Backendless from 'backendless';
import firebase from 'firebase';

Backendless.initApp("1AB220F7-C73C-1C5D-FFEA-66C66D537000", "E96D68AE-4509-A025-FF8B-60CADA3F7700");
var config = {
  apiKey: "AIzaSyCtQ-jt_kmfA3yoN67E3WO6YneWo7_FYHg",
  authDomain: "mega-1ac5a.firebaseapp.com",
  databaseURL: "https://mega-1ac5a.firebaseio.com",
  projectId: "mega-1ac5a",
  storageBucket: "mega-1ac5a.appspot.com",
  messagingSenderId: "161147202829"
};

firebase.initializeApp(config);

export default class App extends Component {
  // state = {
  //   signedIn: false,
  //   checkedSignIn: false
  // }

  componentDidMount() {
    
  }

  render() {
    const Layout = createRootNavigator(false);
    return (<Layout />);
  }

  configureScene(route) { 
    if (route.giftedForm == true) { 
      return route.configureScene(); 
    } 
  }

  renderScene(route, navigator) { 
    if (route.giftedForm == true) { 
      return route.renderScene(); 
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});