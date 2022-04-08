import React from 'react'
import {Box} from 'grommet'

const ChatBox = () => {
  return (
   <Box 
    background="brand" 
    width='67vw' 
    responsive={true} 
    height='95vh'
    border={{color:'skyblue', size: 'medium'}}
   >
     {/* <Box pad='small'>
        <Avatar src={userJSON.avatar}/>
      </Box> */}
   </Box>
  )
}

export default ChatBox