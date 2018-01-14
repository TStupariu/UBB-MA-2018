import React, { Component } from 'react';
import { View, Button, TextInput, ToastAndroid, Switch, Text } from 'react-native';
import * as firebase from "firebase";

class LoginForm extends Component {
    
    state = { email: 'a@a.ro', password: 'password', error: '', loading: false, name: '', role: '', switchValue: false }

    constructor(props) {
        super(props)
        screen: LoginForm    
        this.ref = firebase.database().ref("/users");
    }

    onLoginPress() {
        this.setState({ error: '', loading: true });
        const { email, password } = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => { 
                this.setState({ error: '', loading: false })
                const { navigate } = this.props.navigation;
                navigate('Main', {'user_email' : email})
            })
            .catch(() => {
                this.setState({ error: 'Authentication failed on login.', loading: false });
                ToastAndroid.show('Log in failed!', ToastAndroid.SHORT);
            });
    }

    onSignupPress() {
        this.setState({ error: '', loading: true });
        const { email, password } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => { 
                let role = this.state.switchValue === false ? "user" : "admin"
                this.setState({ error: '', loading: false, role: role })
                this.ref.push({'name' : this.state.name, 'role' : role, 'email' : this.state.email })
                const { navigate } = this.props.navigation;
                navigate('Main', {'user_email' : email})
            })
            .catch(() => {
                this.setState({ error: 'Register failed.', loading: false });
                ToastAndroid.show(this.state.error, ToastAndroid.SHORT);
        });
    }

    switchToggle() {
        console.log
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                    <TextInput 
                        style={{ flex: 1 }}
                        label='Email Address'
                        placeholder='you@domain.com'
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                    />
                    <TextInput 
                        style={{ flex: 1 }}
                        label='Password'
                        autoCorrect={false}
                        placeholder='*******'
                        secureTextEntry
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                    />
                    <TextInput 
                        style={{ flex: 1 }}
                        label='Name'
                        placeholder='Name'
                        value={this.state.name}
                        onChangeText={name => this.setState({ name })}
                    />
                    <Text style={{ flex: 1 }}>Is Admin:</Text>
                    <Switch
                        style={{ flex: 1 }}
                        value={this.state.switchValue}
                        onValueChange={() => {
                            let val = !this.state.switchValue
                            this.setState({switchValue: val})}
                        }
                    />
                    <Button title="Log in" 
                        style={{ flex: 1 }}
                        onPress={() => {this.onLoginPress()}}
                    />
                    <Button title="Sign Up"
                        style={{ flex: 1 }} 
                        onPress={() => {this.onSignupPress()}}
                    />
            </View>
        );
    }
}

export default LoginForm;