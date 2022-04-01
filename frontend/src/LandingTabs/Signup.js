/*
Resources
1. https://cloudinary.com/documentation/upload_images
2. https://stackoverflow.com/questions/54469133/uploading-image-to-cloudinary-express-js-react-axios-post-request
3. https://stackoverflow.com/questions/67643292/signup-on-reactjs-using-axios
4. https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem
5. https://blog.logrocket.com/using-localstorage-react-hooks/
6. https://stackoverflow.com/questions/64838587/how-to-properly-use-usehistory-from-react-router-dom

Resources 1, 3, 4, and 6 were used as learning material
Some code from the postAvatar function was copied from resource 2 and modified to fit the project
The structure of the axios post call in the handleSignup function was partially copied from resource 5
*/

import React from 'react'
import axios from 'axios'
import {TextInput, Text, Box, Button, Notification, FileInput} from 'grommet'
import { CloudUpload, Send, Validate } from 'grommet-icons'
import { useHistory } from 'react-router-dom'
const konfig = require('../cloudinaryURL.json') //spelled differently to avoid future clashes

let cloudinary = konfig.cloudinaryURL //some json string issue

const Signup = () => {
  let history = useHistory()
  const [displayName, setDisplayName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [code, setCode] = React.useState('')
  const [verified, setVerified] = React.useState(false)
  const [verifiedToast, setVerifiedToast] = React.useState(false)
  const [pw, setPw] = React.useState('')
  const [secondpw, setSecondpw] = React.useState('')
  // const [reveal, setReveal] = React.useState(false)
  const [toast, setToast] = React.useState(false)
  const [correct, setCorrect] = React.useState(false)
  const [pwToast, setPwToast] = React.useState(false)
  const [emailToast, setEmailToast] = React.useState(false)
  const [avatarToast, setAvatarToast] = React.useState(false)
  const [avatar, setAvatar] = React.useState('')
  const [randomNum, setRandomNum] = React.useState()
  const [exists, setExists] = React.useState(false)

  const hiddenFileInput = React.useRef(null);
  const handleAvatarClick = (event) => {
      hiddenFileInput.current.click()
  }

  React.useEffect(() => {
    return () => {}
  }, [])

  let bruh = []
   
   const sendEmail = async () => {
     Math.random()
     bruh.push(Math.floor(Math.random() * 8999) + 1001)
     setRandomNum(bruh[0])
     let re = /\S+@\S+\.\S+/ //regex to test email validity
     // console.log(re.test(email))
     if (!re.test(email) || email === undefined) {
       setEmailToast(true)
       return
     }

     try {
       const config = {
         headers: {
           "Content-type": "application/json",
         }
       }
       let rando = bruh[0].toString()
       console.log('rando', rando)
       console.log('bruh', bruh)
       console.log('data', {
         email,
         rando
       })
       await axios.post('/api/users/verificationEmail', {
         email,
         rando
       }, config)
       console.log(`sent email to ${email}`)
       return
     } catch (err) {
       console.log('failed to send email', err)
     }
   }

   const checkCode = async () => {
      console.log(code, randomNum)
      if(!code || !randomNum) {
        setVerified(false)
        setCorrect(true)
        return
      }
      if(code===randomNum.toString()) {
         setVerified(true)
         setCorrect(false)
      }
      else {
         setVerified(false)
         setCorrect(false)
      }
   }

  const handleSignup = async () => {
    let is_admin = false
    if (!email || !pw || !secondpw || !displayName) {
      setToast(true)
      return
    }
    if (pw !== secondpw) {
      setPwToast(true)
      return
    }
    if(verified !== true) {
      setVerifiedToast(true)
      return
    }
    if(!avatar||avatar==='') setAvatar('https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-avatar-user-experience-flatart-icons-outline-flatarticons.png')

    const postConfig = { //the format of the data in the axios call
      headers: { "Content-type" : "application/json" }
    }

    const signupJSON = await axios
    .post('/api/users/signup', {displayName, is_admin, email, pw, verified, avatar}, postConfig)
    .then(res => {
      console.log('pog new user', res) //debug
      history.push('/discuss')
    })
    .catch(error => {
      console.log('error on signup', error)
      setExists(true)
      return
    })
    localStorage.setItem('userJSON', JSON.stringify(signupJSON))
  }

  const postAvatar = (avatar) => {
    if(avatar.type==='image/jpeg' || avatar.type==='image/png') {
      let imgData = new FormData()
      imgData.append('file', avatar)
      imgData.append('upload_preset', 'disCUssion')
      imgData.append('cloud_name', 'discussion')
      console.log('imgData', imgData)
      let cloudinaryParams = {
        method:'post',
        body: imgData
      }
      console.log('cloudinaryURL', cloudinary)
      fetch(cloudinary, cloudinaryParams)
        .then((response)=> response.json())
        .then(data => {
          // console.log(data.url)
          setAvatar(data.url)
          setAvatarToast(true)
      })
        .catch((err) => {console.log(err)})
      
    }
    else return
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

      {correct && (
        <Notification
          toast
          status='warning'
          title="Your have entered the wrong verification code"
          onClose={() => setCorrect(false)}
        />
      )}

      {verified && (
        <Notification
          toast
          status='normal'
          title="Your email has been verified"
          onClose={() => setCorrect(false)}
        />
      )}

      {emailToast && (
        <Notification
          toast
          status='warning'
          title="Please enter a valid email"
          onClose={() => setEmailToast(false)}
        />
      )}

      {avatarToast && (
        <Notification
          toast
          status='normal'
          title="Avatar successfully uploaded"
          onClose={() => setAvatarToast(false)}
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

      {!pwToast && !toast && verifiedToast && (
        <Notification
          toast
          status='warning'
          title="Your email is not verified"
          onClose={() => setVerifiedToast(false)}
        />
      )}

      {exists && (
        <Notification
          toast
          status='warning'
          title="That email is already in use"
          onClose={() => setExists(false)}
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
        <Button 
          active
          onClick={sendEmail}
        >
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
          onChange={(event)=> postAvatar(event.target.files[0])}
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
      <Button 
        pad='small' 
        active
        onClick={checkCode}
        >
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
        label='Sign me up!'
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