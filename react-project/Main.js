import React from 'react';
import { StyleSheet, Text, View, Button, Linking, StatusBar, Alert, AsyncStorage, NetInfo, TextInput, FlatList, ListItem } from 'react-native';
// import { FormLabel, FormInput, List, ListItem } from 'react-native-elements'
import { Details } from './Details'
import { StackNavigator } from 'react-navigation'
import * as firebase from "firebase";
import LoginForm from './LoginForm';

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
      authUser : {
        email: '',
        role: 'user', 
      },
    };
    this.ref = firebase.database().ref("/employees");
    screen: Main;
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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

      let userEmail = this.props.navigation.state.params.user_email  
      let userRole = 'user'
      firebase.database().ref("/users").once('value').then((data) => {
        let users = data.val()
        console.log(users)
        for(let x in users) {
          if (users[x].email === userEmail) {
            userRole = users[x].role
            this.setState({authUser: {
              'email' : userEmail,
              'role' : userRole,
            }})
          }
        }
      })
    }
  }

  async componentDidMount() {
    NetInfo.isConnected.fetch().done(async (isConnected) => {
      if ( isConnected )
      {
        console.log("ON")
        const offAdd = JSON.parse(await AsyncStorage.getItem("offlineAdd"))
        if (offAdd) {
          for (var x in offAdd) {
            this.ref.child(offAdd[x]['Key']).set(offAdd[x]['Person']) 
          }
          AsyncStorage.removeItem("offlineAdd")
        }

        const offRem = JSON.parse(await AsyncStorage.getItem("offlineRemove"))
        if (offRem) {
          for (var x in offRem) {
            this.ref.child(offRem[x]["Key"]).remove()
          }
          AsyncStorage.removeItem("offlineRemove")
        }

        let list = this.ref.once('value').then((data) => {
          data = data.val()
          data2 = Object.keys(data).map(function (key) { return {'Person' : data[key], "Key" : key}; });
          this.setState({list: data2})
          AsyncStorage.setItem("list", JSON.stringify(data2))
        })
      }
      else
      {
        console.log("OFF")
        let list = JSON.parse(await AsyncStorage.getItem("list"))
        this.setState({list})
        if (this.props.navigation.state.params !== undefined && this.props.navigation.state.params.entityAdd !== undefined) {
          let currentToAdd = JSON.parse(await AsyncStorage.getItem("offlineAdd"))
          if (!currentToAdd) {
            currentToAdd = []
          }
          const genKey = this.generateKey()
          currentToAdd.push({"Key" : genKey, "Person" : this.props.navigation.state.params.entityAdd})
          await AsyncStorage.setItem("offlineAdd", JSON.stringify(currentToAdd))
          currentList = this.state.list
          currentList.push({"Key" : genKey, 'Person' : this.props.navigation.state.params.entityAdd })
          this.setState({"list" : currentList})
        }
      }
    });
  }

  handleListItemPress(name, position, key) {
    var PushNotification = require('react-native-push-notification');

    PushNotification.configure({
      onNotification: (notification) => {
        console.log( 'NOTIFICATION:', notification );
        const { navigate } = this.props.navigation;
        navigate('Details', {"name" : name, "position" : position, "key" : key, "userRole" : this.state.authUser.role})
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
    PushNotification.localNotificationSchedule({
      message: "See recent checked profile!", // (required)
      date: new Date(Date.now() + (10 * 1000)) // in 10 secs
    });

    const { navigate } = this.props.navigation;
    navigate('Details', {"name" : name, "position" : position, "key" : key, "userRole" : this.state.authUser.role})
  }

  setPosition(name,position) {
    list = this.state.list;
    for (var i = 0; i < list.length; i++) {
      if (name == list[i].name) {
        list[i].position = position;
      }
    }
  }

  async acceptDelete(l) {
    var idx = this.state.list.findIndex(i => i.Person.Name === l.Person.Name)
    NetInfo.isConnected.fetch().done(async (isConnected) => {
      if ( isConnected )
      {
        let deleteUrl = this.ref.child(l.Key)
        deleteUrl.remove()
        let list = this.state.list
        list.splice(idx, 1)
        this.setState({list})
      }
      else
      {
        let offlineRemove = JSON.parse(await AsyncStorage.getItem("offlineRemove"))
        if (!offlineRemove) {
          offlineRemove = []
        }
        offlineRemove.push(l)
        let list = this.state.list
        list.splice(idx, 1)
        AsyncStorage.setItem("list", JSON.stringify(list))
        AsyncStorage.setItem("offlineRemove", JSON.stringify(offlineRemove))
        this.setState({list})
      }
    });
  }

  async handleLongPress(l) {
    var value = await AsyncStorage.getItem("list");
    Alert.alert(
      'Delete ' + l.Person.Name,
      'Are you sure you want to delete this person?',
      [
      {text: 'Yes', onPress: () => this.acceptDelete(l)},
      {text: 'No', style: 'cancel'},
      ],
      { cancelable: false }
      )
  }

  renderFlatListItem(item) {
    return (
      <View key={"parentView"+item.Key} style={styles.itemContainer}>
        <Text style={styles.itemText}
              onPress={() => this.handleListItemPress(item.Person.Name, item.Person.Position, item.Key)}
              onLongPress={() => this.handleLongPress(item)}>
              {item.Person.Name + " | " + item.Person.Position}
        </Text>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}
        />
      </View>
     )
  }

  render() {
    let list = this.state.list;
    console.log(this.state.authUser)
    return (
      <View style={styles.container}>
      <StatusBar hidden={true} />
      <Text>Name</Text>
      <TextInput ref= {(el) => { this.emailTo = el; }} onChangeText={(emailTo) => this.setState({emailTo})} value={this.state.emailTo}/>
      <Button title="SEND EMAIL" raised onPress={() => this.sendEmail()}></Button>
      {this.state.authUser.role !== "user" ? (
        <Button title="Add" raised onPress={() => this.handleAdd()}></Button>
      ) : null}
      {
        this.state.list[0] !== undefined ? (<FlatList
          data={this.state.list}
          renderItem={({item}) => this.renderFlatListItem(item)}
        />) : null
      }
      </View>
      );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fa3'
  },
  itemText: {
    lineHeight: 40,
    fontSize: 30,
    textAlign: 'center'
  }
});
