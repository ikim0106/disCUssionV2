import React, { useEffect, useState } from 'react'
import { Sidebar, Avatar, Nav, Box } from 'grommet'
import Leftbar from '../components/Leftbar'
import ChatList from '../components/ChatList'
import ChatBox from '../components/ChatBox'
// import {useHistory} from 'react-router-dom'
// import { Chat } from '../state/State'
// import axios from 'axios'


const Discuss = () => {
   // let userJSON = localStorage.getItem('userJSON')
   // userJSON = JSON.parse(userJSON)
   // console.log('jibai knn', userJSON)
   return (
   <div style={{width: '100%'}}>
      <Box
         align='center'>
         <Leftbar/>
      </Box>
      <Box
         flex
         direction='row'
         justify='evenly'
         width='100%'
         height='90vh'
         >
         <ChatList/>
         <ChatBox/>
      </Box>
   </div>
   )
}

export default Discuss