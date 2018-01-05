import React from 'react'
import { StyleSheet, Text, View, Linking, StatusBar } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation'
import Main from "./Main"
import Details from "./Details"
import AddEmployee from "./AddEmployee"
import LoginForm from "./LoginForm"
import * as firebase from 'firebase';
import { AppRegistry } from 'react-native';

AppRegistry.registerComponent('RNFirebaseStarter', () => LoginForm);

export default class App extends React.Component {
  
  static navigationOptions = {
    title: 'Details',
  }

  render() {
    console.disableYellowBox = true;
    return (
      <View style={{ flex: 1 }}>
        <MainScreenNavigator/>
      </View>
    )
  }
}

const MainScreenNavigator = StackNavigator({
  LoginForm: { screen: LoginForm },
  Main: { screen: Main },
  Details: { screen: Details },
  AddEmployee: {screen: AddEmployee},
});