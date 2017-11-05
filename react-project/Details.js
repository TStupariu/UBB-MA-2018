import React from 'react';
import { StyleSheet, Text, View, Linking, StatusBar } from 'react-native';
import { FormLabel, FormInput, Button, List, ListItem } from 'react-native-elements'
import { StackNavigator } from 'react-navigation'

export default class Details extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      position: ""
    };
    screen: Details
  }

  componentWillMount() {
    this.setState({name: this.props.navigation.state.params.name, position: this.props.navigation.state.params.position })
  }

  static navigationOptions = {
    title: 'Details',
  };

  render() {    
    return (
      <View style={styles.container}>
      <StatusBar hidden={true} />
      <FormLabel>Name</FormLabel>
      <FormInput value={this.state.name}/>
      <FormLabel>Position</FormLabel>
      <FormInput value={this.state.position}/>
      <Button raised title="SAVE"></Button>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fa3',
    alignItems: 'center',
  },
});
