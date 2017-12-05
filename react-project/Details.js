import React from 'react';
import { StyleSheet, Text, View, Linking, StatusBar, Picker } from 'react-native';
import { FormLabel, FormInput, Button, List, ListItem } from 'react-native-elements'
import { StackNavigator } from 'react-navigation'
import * as firebase from "firebase"
import { VictoryAxis, VictoryBar, VictoryChart } from "victory-native";

export default class Details extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      key: "",
      name: "",
      position: "",
      data: [{"position" : "CEO", "number" : 0}, {"position" : "CFO", "number" : 0}, {"position" : "CTO", "number" : 0}]
    };
    screen: Details
  }

  componentWillMount() {
    this.setState({name: this.props.navigation.state.params.name, position: this.props.navigation.state.params.position, key: this.props.navigation.state.params.key })
  }

  componentDidMount() {
    this.computeStats()
  }  

  static navigationOptions = {
    title: 'Details',
  };

  handlePress() {
    let ref = firebase.database().ref("/employees/" + this.state.key);
    ref.set({"Name" : this.state.name, "Position" : this.state.position})
    const { navigate } = this.props.navigation;
    navigate('Main', {"name" : this.state.name, "position" : this.state.position})
  }

  async computeStats() {
    const data = {"CEO" : 0, "CFO" : 0, "CTO" : 0}
    let ref = await firebase.database().ref("/employees").once('value')
    let ref2 = ref.val()     
    for (let x in ref2)
    {
      data[ref2[x].Position]++
    }
    let result = Object.keys(data).map(function (key) { return {'position' : key, "number" : data[key]}; });
    this.setState({data: result})
    console.log(this.state.data)
  }

  render() {
    return (
      <View style={styles.container}>
      <StatusBar hidden={true} />
      <FormLabel>Name</FormLabel>
      <FormInput value={this.state.name}/>
      <FormLabel>Position</FormLabel>
      <Picker style={{width: 100}} selectedValue={this.state.position} onValueChange={(itemValue, itemIndex) => this.setState({position: itemValue})}>
        <Picker.Item label="CTO" value="CTO" />
        <Picker.Item label="CFO" value="CFO" />
        <Picker.Item label="CEO" value="CEO" />
      </Picker>
      <Button raised title="SAVE" onPress={() => {this.handlePress();}}></Button>
      <VictoryChart
        domainPadding={40}
      >
        <VictoryAxis
          tickValues={[1, 2, 3]}
          tickFormat={["CEO", "CFO", "CTO"]}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(x) => x}
        />
        <VictoryBar
          style={{
            data: {fill: "white"}
          }}
          data={this.state.data}
          x="position"
          y="number"
        />
      </VictoryChart>
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
