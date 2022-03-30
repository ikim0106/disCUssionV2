import React from 'react'
import {TextInput, Text, Box, Button, Notification, FileInput} from 'grommet'
import { CloudUpload, Send, Validate } from 'grommet-icons'

const Signup = () => {
  const [displayName, setDisplayName] = React.useState()
  const [email, setEmail] = React.useState()
  const [code, setCode] = React.useState()
  const [pw, setPw] = React.useState()
  const [secondpw, setSecondpw] = React.useState()
  // const [reveal, setReveal] = React.useState(false)
  const [toast, setToast] = React.useState(false)
  const [pwToast, setPwToast] = React.useState(false)
  const [avatar, setAvatar] = React.useState()

  const hiddenFileInput = React.useRef(null);
  const handleAvatarClick = (event) => {
      hiddenFileInput.current.click()
  }

  const handleSignup = () => {
    if (!email || !pw || !secondpw || !displayName || !code) {
      setToast(true)
    }
    if (pw !== secondpw) {
      setPwToast(true)
    }
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

      {pwToast && !toast && (
        <Notification
          toast
          status='warning'
          title="The passwords do not match"
          onClose={() => setPwToast(false)}
        />
      )}

      <Text margin={{top: '0.7em', bottom: '0.3em'}}>Display name  <Text color='red'>*</Text></Text>
      
      <TextInput
        placeholder={<Text color='grey'>Enter display name</Text>}
        value={displayName}
        size='medium'
        onChange={event => setDisplayName(event.target.value)}
        />
      

      <Text margin={{top: '0.7em', bottom: '0.3em'}}>Email  <Text color='red'>*</Text></Text>
      <Box direction='row' >
      <TextInput
        placeholder={<Text color='grey'>Enter email</Text>}
        value={email}
        size='medium'
        onChange={event => setEmail(event.target.value)}
        />
        <Button active>
        <Box direction='row' alignContent='center' pad='small' width='7.5em'>
          <Text>Send code</Text>
          <Send/>
        </Box>
        </Button>
      </Box>

      <Text margin={{top: '0.7em', bottom: '0.3em'}}>Password  <Text color='red'>*</Text></Text>
      <TextInput
        placeholder={<Text color='grey'>Enter password</Text>}
        value={pw}
        type='password'
        size='medium'
        onChange={event => setPw(event.target.value)}
        />


      <Text margin={{top: '0.7em', bottom: '0.3em'}}>Second password  <Text color='red'>*</Text></Text>
      <Box direction = 'row'>
      <TextInput
        placeholder={<Text color='grey'>Enter second password</Text>}
        value={secondpw}
        type='password'
        size='medium'
        onChange={event => setSecondpw(event.target.value)}
        />
      </Box>

      <Text margin={{top: '0.7em', bottom: '0.3em'}}>Upload avatar </Text>

      <Box direction='row'>
        <Button
          size='medium'
          icon={<CloudUpload/>}
          label='Upload'
          onClick={handleAvatarClick}
        >
        </Button>
        
        <Box style={{display: 'none'}}>
        <FileInput
          name='file'
          ref={hiddenFileInput}
          accept='image/*'
          onChange={(event)=> console.log(event)}
          style={{display: 'none'}}
        />
        </Box>
      </Box>

      <Text margin={{top: '0.7em', bottom: '0.3em'}}>Verification Code  <Text color='red'>*</Text></Text>
      <Box direction = 'row'>
      <TextInput
        placeholder={<Text color='grey'>Enter verification code from email</Text>}
        value={code}
        type='number'
        size='medium'
        onChange={event => setCode(event.target.value)}
        />
      <Button pad='small' active>
        <Box direction='row' align='center' pad='small'>
          <Text>Verify</Text>
          <Validate/>
        </Box>
        </Button>
      </Box>

      <Button
        primary
        style={{marginTop: 20}}
        fill='horizontal'
        label='Log me in!'
        onClick={handleSignup}
        >
       </Button>

      <Box align='center' pad='small'>

      <Text align='center' color= 'red' size = '0.8em'>
        * are required fields
      </Text>
      </Box>
      </Box>
  )
}

export default Signup