import React from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import {TextInput, Text, Box, Button, Notification} from 'grommet'

const Login = () => {
  const history = useHistory()
  const [email, setEmail] = React.useState('')
  const [pw, setPw] = React.useState('')
  // const [reveal, setReveal] = React.useState(false)
  const [toast, setToast] = React.useState(false)
  const [wrong, setWrong] = React.useState(false)

    React.useEffect(() => {
      return () => {}
    }, [])


  const handleLogin = async () => {
    if(!email || !pw) {
      setToast(true)
    }

    const postConfig = {
      headers: {"Content-type" : "application/json"}
    }

    const loginJSON = await axios
    .post('/api/users/login', {email, pw}, postConfig)
    .then(res => {
      console.log('pog logged in', res) //debug
      if (res.data.is_admin) {
          window.location.replace("https://cloud.mongodb.com/v2/621fb313afbcfd38fccb8e15#metrics/replicaSet/623ff7e41d7bde1b70109259/explorer")
      }
      else {
          history.push('/discuss')
      }
    })
    .catch(error => {
      console.log('error on login', error)
      setWrong(true)
      return
    })
    localStorage.setItem('userJSON', JSON.stringify(loginJSON))
  }

  return (
      <Box width='25em'>
      {toast && (
        <Notification
          toast
          status='warning'
          title="You have not entered all the required fields"
          onClose={() => setToast(false)}
        />
      )}

      {wrong && (
        <Notification
          toast
          status='warning'
          title="You have entered an incorrect email or password"
          onClose={() => setWrong(false)}
        />
      )}
      <Text margin={{top: '1em', bottom: '0.5em'}}>Email  <Text color='red'>*</Text></Text>
      <TextInput
        placeholder={<Text color='grey'>Enter email</Text>}
        value={email}
        size='medium'
        background={'green'}
        onChange={event => setEmail(event.target.value)}
        />

      <Text margin={{top: '1em', bottom: '0.5em'}}>Password  <Text color='red'>*</Text></Text>
      <Box direction = 'row'>
      <TextInput
        placeholder={<Text color='grey'>Enter password</Text>}
        value={pw}
        type='password'
        size='medium'
        onChange={event => setPw(event.target.value)}
        />
      </Box>
      <Box align='center' pad='small'>

      <Text align='center' color= 'red' size = '0.8em'>
        * are required fields
      </Text>
      <Button
        primary
        style={{marginTop: 20}}
        fill='horizontal'
        label='Log me in!'
        onClick={handleLogin}
        >
       </Button>
      </Box>
      </Box>
  )
}

export default Login