import React from 'react'
import {Box, Text} from 'grommet'
import { Chat } from '../state/State'

const ChatBox = () => {
  const {loggedinUser, setLoggedinUser, selectedChat, allChats, setAllChats, setSelectedChat} = Chat()
   const getOtherUser = (me, users) => {
      // me=JSON.parse(me)
      // console.log('other user is', me)
      // return 'sex'
      return users[0]._id !== me._id ? users[0].displayName : users[1].displayName
   }

  return (
   <Box 
    background="brand" 
    width='67vw' 
    responsive={true} 
    height='95vh'
    border={{color:'skyblue', size: 'medium'}}
   >
     {selectedChat&&(!selectedChat.is_group ? getOtherUser(loggedinUser, selectedChat.users) : selectedChat.name)}
   </Box>
  )
}

export default ChatBox