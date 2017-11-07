import React from 'react';
import { StyleSheet, Text, View, Linking, StatusBar, Alert } from 'react-native';
import { FormLabel, FormInput, Button, List, ListItem } from 'react-native-elements'
import { Details } from './Details'
import { StackNavigator } from 'react-navigation'

export default class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      emailTo: "",
      list : [
      {
        name: 'Amy Farha',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        position: 'CEO'
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        position: "CTO"
      },
      ]
    };
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
      console.log(emailUrl)
      Linking.openURL(emailUrl)
    }
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

  handleListItemPress(name, position) {
    const { navigate } = this.props.navigation;
    navigate('Details', {"name" : name, "position" : position})
  }

  setPosition(name,position) {
    console.log(name,position)
    list = this.state.list;
    for (var i = 0; i < list.length; i++) {
      // console.log(name,list[i].name)
      if (name == list[i].name) {
        list[i].position = position;
      }
    }
    // console.log(list)
  }

  render() {
    // console.log(this.props)    
    let list = this.state.list;
    return (
      <View style={styles.container}>
      <StatusBar hidden={true} />
      <FormLabel>Name</FormLabel>
      <FormInput ref= {(el) => { this.emailTo = el; }} onChangeText={(emailTo) => this.setState({emailTo})} value={this.state.emailTo}/>
    <Button title="SEND EMAIL" raised onPress={() => this.sendEmail()}></Button>


    <List containerStyle={{width: 300}}>
    {
      list.map((l, i) => (
      <ListItem
      roundAvatar
      avatar={{uri:l.avatar_url}}
      key={i}
      title={l.name}
      onPress={() => {this.handleListItemPress(l.name, l.position)}}
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
