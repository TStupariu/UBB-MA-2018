import React from 'react';
import { StyleSheet, Text, Button, View, Linking, StatusBar, Picker, AsyncStorage, TextInput, List, ListItem } from 'react-native';
// import { FormLabel, FormInput, List, ListItem } from 'react-native-elements'
import { StackNavigator } from 'react-navigation'
import * as firebase from "firebase"

export default class AddEmployee extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      Name: "",
      Position: "CEO"
    };
    screen: AddEmployee
    this.ref = firebase.database().ref("/employees");
  }

  componentWillMount() {
  }

  static navigationOptions = {
    title: 'Add Employee',
  };

  handleAdd() {
    this.ref.push(this.state)
    const { navigate } = this.props.navigation
    navigate('Main', {"entityAdd" : this.state})
  }

  render() {    
    return (
      <View style={styles.container}>
      <StatusBar hidden={true} />
      <Text>Name</Text>
      <TextInput ref= {(el) => { this.Name = el; }} onChangeText={(Name) => this.setState({Name})} value={this.state.Name}/>
      <Text>Position</Text>
      <Picker style={{width: 100}} selectedValue={this.state.Position} onValueChange={(itemValue, itemIndex) => this.setState({Position: itemValue})}>
        <Picker.Item label="CTO" value="CTO" />
        <Picker.Item label="CFO" value="CFO" />
        <Picker.Item label="CEO" value="CEO" />
      </Picker>
      <Button title="Add" onPress={() => {this.handleAdd()}}></Button>
      </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
  },
});
