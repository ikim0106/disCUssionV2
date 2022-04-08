import React, { useState } from 'react'
import {Box, Avatar, Button, Accordion, AccordionPanel, Layer, Text, TextInput, Notification} from 'grommet'
import { Add, Search, Edit} from 'grommet-icons'
import axios from 'axios'

const ChatList = () => {

   const [showProfile, setShowProfile] = React.useState(false)
   const [newPw, setNewPw] = React.useState('')
   const [newPwToast, setNewPwToast] = React.useState(false)
   let userJSON = localStorage.getItem('userJSON')
   userJSON = JSON.parse(userJSON)
   // console.log('jibai knn', userJSON)
   
   const updatePw = async() => {
      const postConfig = {
         headers: {"Content-type" : "application/json"}
      }

      let id = userJSON._id
      let newPassword = newPw

      if(!newPassword) {
         setNewPwToast(true)
         return
      }

      await axios.post('/api/users/changePassword', {id, newPassword}, postConfig)
   }

  return (
   <Box height='100vh' width='30vw'>
   <Box 
    background="brand" 
    width='30vw' 
    responsive={true} 
    height='8vh'
    border={{color:'skyblue', size: 'medium'}}
   >
     <Box pad='small' direction='row' alignContent='stretch'>
        <Box direction='row'>
         <Accordion>
            <AccordionPanel label={<Avatar src={userJSON.avatar}/>}>
               <Box pad="medium" background="light-1">
                  <Button plain={true} label='Log out'/>
               </Box>
               <Box pad="medium" background="light-1">
                  <Button 
                  plain={true} 
                  label='View profile'
                  onClick={()=> setShowProfile(true)}
                  />
               </Box>
            </AccordionPanel>
         </Accordion>
         
        </Box>

        <Box direction='row' margin={{left: 'auto', right: '0'}}>
         <Box
            align='center'
            width='5vw'
            direction='row'>
            <Button icon={<Add/>} reverse={true} hoverIndicator tip='New group'/>
         </Box>
         <Box
            align='center'
            width='5vw'
            direction='row'>
            <Button icon={<Search/>} reverse={true} hoverIndicator tip='Search users'/>
         </Box>
      </Box>
      </Box>
      
   </Box>     
            
   <Box 
      style = {{
         position:'absolute',
         zIndex: '-1'
      }}
      background='skyblue'
      width='30vw'
      height='95vh'/>

      { showProfile && <Layer
         onEsc={()=> setShowProfile(false)}
         onClickOutside={()=> setShowProfile(false)}
      >
         <Box
            direction='column'
            width='30vw'
            height='50vh'
            align='center'
            pad='medium'
         >
         <Text size='3xl' margin='small'>{userJSON.displayName}</Text>
         <Avatar size='3xl' src={userJSON.avatar}/>
         <Text size='xlarge' margin='large'>Email: {userJSON.email}</Text>
         <Box direction='row'>  
            <TextInput
               placeholder="New password"
               type='password'
               value={newPw}
               onChange={event => setNewPw(event.target.value)}
            />
               <Button
                  active
                  color='black'
                  onClick={updatePw}
                  icon={<Edit/>}
                  >
               </Button>

            
         </Box>
         </Box>
      </Layer>
      }
      {newPwToast && (
        <Notification
          toast
          status='warning'
          title="Please provide a password"
          onClose={() => setNewPwToast(false)}
        />
      )}
   </Box>
  )
}

export default ChatList