import React from 'react'
import { StyleSheet, Text, View, Linking, StatusBar } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation'
import Main from "./Main"
import Details from "./Details"

export default class App extends React.Component {
 
  static navigationOptions = {
    title: 'Details',
  };
  
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MainScreenNavigator/>
      </View>
    );
  }
}

const MainScreenNavigator = StackNavigator({
  Main: { screen: Main },
  Details: { screen: Details },
});