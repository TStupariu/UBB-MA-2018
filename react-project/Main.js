import React from 'react';
import { StyleSheet, Text, View, Linking, StatusBar, Alert, AsyncStorage, NetInfo } from 'react-native';
import { FormLabel, FormInput, Button, List, ListItem } from 'react-native-elements'
import { Details } from './Details'
import { StackNavigator } from 'react-navigation'
import * as firebase from "firebase";

var config = {
    apiKey: "AIzaSyCDJdA7KFgvMfwpeCAmGfYwTlK9gUh_ZDg",
    authDomain: "ma-react-native.firebaseapp.com",
    databaseURL: "https://ma-react-native.firebaseio.com",
    projectId: "ma-react-native",
    storageBucket: "ma-react-native.appspot.com",
    messagingSenderId: "261668730554"
  };
firebase.initializeApp(config);

export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      emailTo: "",
      list : [],
    };
    this.ref = firebase.database().ref("/employees");
    screen: Main;
  }

  static navigationOptions = {
    title: 'Main',
  };

  sendEmail() {
    if (this.state.emailTo === "") {
      Alert.alert("Can not have empty email!")
    }
    else {
      let emailUrl = "mailto:?to=" + this.state.emailTo
      Linking.openURL(emailUrl)
    }
  }

  handleAdd() {
    const { navigate } = this.props.navigation;
    navigate('AddEmployee')
  }

  componentWillMount() {
    if (this.props.navigation.state.params)
    {
      var name = this.props.navigation.state.params.name;
      var position = this.props.navigation.state.params.position;
      var list = this.state.list;
      for (var i = 0; i < list.length; i++) {
        if (name == list[i].name) {
          list[i].position = position;
        }
      }
      this.setState({list});  
    }
  }

  async componentDidMount() {
    NetInfo.isConnected.fetch().done(async (isConnected) => {
      if ( isConnected )
      {
        let list = this.ref.once('value').then((data) => {
          data = data.val()
          data2 = Object.keys(data).map(function (key) { return {'Person' : data[key], "Key" : key}; });
          this.setState({list: data2})
          AsyncStorage.setItem("list", JSON.stringify(data2))
        })
      }
      else
      {
        let list = JSON.parse(await AsyncStorage.getItem("list"))
        this.setState({list})
      }
    });
  }

  handleListItemPress(name, position, key) {
    const { navigate } = this.props.navigation;
    navigate('Details', {"name" : name, "position" : position, "key" : key})
  }

  setPosition(name,position) {
    list = this.state.list;
    for (var i = 0; i < list.length; i++) {
      if (name == list[i].name) {
        list[i].position = position;
      }
    }
  }

  acceptDelete(l, idx) {
    let deleteUrl = this.ref.child(l.Key)
    deleteUrl.remove()
    let list = this.state.list
    list.splice(idx, 1)
    this.setState({list}) 
  }

  async handleLongPress(l, idx) {
    var value = await AsyncStorage.getItem("list");
    Alert.alert(
      'Delete ' + l.Person.Name,
      'Are you sure you want to delete this person?',
      [
        {text: 'Yes', onPress: () => this.acceptDelete(l, idx)},
        {text: 'No', style: 'cancel'},
      ],
      { cancelable: false }
    )
  }

  render() {
    let list = this.state.list;
    return (
      <View style={styles.container}>
      <StatusBar hidden={true} />
      <FormLabel>Name</FormLabel>
      <FormInput ref= {(el) => { this.emailTo = el; }} onChangeText={(emailTo) => this.setState({emailTo})} value={this.state.emailTo}/>
    <Button title="SEND EMAIL" raised onPress={() => this.sendEmail()}></Button>
    <Button title="Add" raised onPress={() => this.handleAdd()}></Button>

    <List containerStyle={{width: 300}}>
    {
      list === undefined ? "" : list.map((l, i) => (
      <ListItem
      roundAvatar
      avatar={{uri:l.avatar_url}}
      key={l.Key}
      title={l.Person.Name}
      onPress={() => {this.handleListItemPress(l.Person.Name, l.Person.Position, l.Key)}}
      onLongPress={() => {this.handleLongPress(l, i)}}
      />
      ))
    }
    </List>
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
