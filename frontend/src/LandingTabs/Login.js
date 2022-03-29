import React from 'react'
import {TextInput, Text, Box, Button} from 'grommet'

const Login = () => {
  const [email, setEmail] = React.useState('')
  const [pw, setPw] = React.useState('')

  const loginHandler = () => {

  }

  return (
      <Box width='25em'>
      <Text margin={{top: '1em', bottom: '0.5em'}}>Email  <Text color='red'>*</Text></Text>
      <TextInput
        placeholder="Email"
        value={email}
        size='medium'
        onChange={event => setEmail(event.target.value)}
        />

      <Text margin={{top: '1em', bottom: '0.5em'}}>Password  <Text color='red'>*</Text></Text>
      <TextInput
        placeholder="Password"
        value={pw}
        size='medium'
        onChange={event => setPw(event.target.value)}
        />
      <Button
        
        width='50%'
        style={{marginTop: 20}}
        onClick={loginHandler}
        >
            Log me in!
       </Button>
      </Box>
  )
}

export default Login