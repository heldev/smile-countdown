import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import LoginForm from "./LoginForm/LoginForm";
import Countdown from "./Countdown/Countdown";
import {
  getGenericPassword,
  getInternetCredentials,
  setGenericPassword,
  setInternetCredentials
} from "react-native-keychain";


const App = () => {
  const [session, setSession] = useState({})


  useEffect(() => {
    restoreSession().then(restoredSession => {
      if (restoredSession !== undefined) {
        setSession(restoredSession)
      }
    }).catch(e => console.warn(`Can't restore a session ${e}`))
  }, [])


  return (
    <View style={styles.container}>
      {
        session.has_errors === false
            ? <Countdown session={session}/>
            : <LoginForm onSubmit={credentials => {
              signInWithNewCredentials(credentials).then(setSession).catch(console.warn)
            }} />
      }
    </View>
  )
}

const restoreSession = async () => {
  const storedSession = await getGenericPassword()

  if (storedSession !== false) {
    console.info('Found existing session')

    return JSON.parse(storedSession.password)

  } else {
    const credentials = await getInternetCredentials("smiledirectclub.com")
    if (credentials !== false) {

      return signIn(credentials.username, credentials.password)
    }
  }
}

const signInWithNewCredentials = async (credentials) => {
  const {email, password} = credentials
  const session = await signIn(email, password)

  if (session.has_errors === false) {
    if (await setInternetCredentials("smiledirectclub.com", email, password) === false) {
      console.warn(`Failed to save the credentials for ${email}`)
    }
  }

  return session
}

const signIn = async (email, password) => {
  const session = await sendLogin(email, password, await fetchCsrf());

  if (session.has_errors === false) {
    if (await setGenericPassword("session", JSON.stringify(session)) === false) {
      console.warn("Failed to persist the session")
    }
  }

  return session
}

const fetchCsrf = async () => {
  const response = await fetch('https://smiledirectclub.com/login/')
  const html = await response.text()

  return /name='csrfmiddlewaretoken'\s+value='(\w+)'/.exec(html)[1]
}

const sendLogin = async (email, password, csrfToken) => {
  const response = await fetch('https://smiledirectclub.com/login/', prepareRequest(csrfToken, email, password))

  return {
    ...await response.json(),
    ...extractSession(response.headers)
  }
}

const prepareRequest = (csrfToken, email, password) => {
  return {
    method: 'POST',
    headers: prepareHeaders(csrfToken),
    body: prepareForm(email, password)
  }
}

const prepareHeaders = (csrfToken) => new Headers({
  'Cookie': `csrftoken=${csrfToken}`,
  'X-CSRFToken': csrfToken,
  'Referer': 'https://smiledirectclub.com/login/'
})

const prepareForm = (email, password) => {
  const loginForm = new FormData();
  loginForm.append('username', email);
  loginForm.append('password', password);
  loginForm.append('remember_me', true);

  return loginForm;
}

const extractSession = (headers) => {
  const [, sessionId, sessionTtl] = /sessionid=(\w+); .+ Max-Age=(\d+);/.exec(headers.get('set-cookie'));
  return {sessionId, sessionTtl}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})

export default App;
