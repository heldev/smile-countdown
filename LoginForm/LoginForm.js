import React, {useState} from 'react';
import {Button, StyleSheet, TextInput} from "react-native";

const LoginForm = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return <>
    <TextInput
        onChangeText={setEmail}
        value={email}
        autoCompleteType="email"
        keyboardType="email-address"
        textContentType="username"
        style={styles.input}/>

    <TextInput
        onChangeText={setPassword}
        value={password}
        autoCompleteType="password"
        textContentType="password"
        secureTextEntry={true}
        style={styles.input}/>

    <Button
        onPress={() => {props.onSubmit({email, password})}}
        title="Sign in"
        style={styles.signIn}/>
  </>
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    fontSize: 30,
    marginBottom: 50
  },
  signIn: {
    backgroundColor: "yellow",
    fontSize: 37,
    borderWidth: 1,
    borderColor: "grey"
  }
})

export default LoginForm
