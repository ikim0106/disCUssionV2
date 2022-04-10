import React from 'react'
import {Box, Text, Tip, Layer, Avatar, Button, TextInput, Keyboard} from 'grommet'
import { CircleInformation, Close, Search, Send} from 'grommet-icons'
import { Chat } from '../state/State'
import axios from 'axios'
import ScrollableFeed from 'react-scrollable-feed'
import Embed from 'react-embed'
import io from 'socket.io-client'

const TipContent = ({ message }) => (
  <Box direction="row" align="center">
    <svg viewBox="0 0 22 22" version="1.1" width="22px" height="22px">
      <polygon
        fill="lightgrey"
        points="6 2 18 12 6 22"
        transform="matrix(-1 0 0 1 30 0)"
      />
    </svg>
    <Box background="lightgrey" direction="row" pad="small" round="xsmall">
      <Text>{message}</Text>
    </Box>
  </Box>
)

const endpoint = 'http://localhost:1004'
let socket, temp

const ChatBox = () => {
  const {loggedinUser, setLoggedinUser, selectedChat, setAllChats, setSelectedChat} = Chat()
  const [showProfile, setShowProfile] = React.useState(false)
  const [showGroup, setShowGroup] = React.useState(false)
  const [searchContent, setSearchContent] = React.useState('')
  const [searchResult, setSearchResult] = React.useState()
  const [messages, setMessages] = React.useState([])
  const [newMsg, setNewMsg] = React.useState('')
  const [soc, setSoc] = React.useState(false)

  let userJSON = localStorage.getItem('userJSON')
  userJSON = JSON.parse(userJSON)

  const getURL = async(msg) => {
    let url = msg.match(/\bhttps?:\/\/\S+/gi)
    console.log('url', url[0])
    return url[0]
  }

  const getChat = async() => {
      let reqConfig = {
         headers: {
            Authorization: `Bearer ${userJSON._id}`,
         }
      }
      const {data} = await axios.get('/api/discuss', reqConfig)

      console.log('all chats', data)
      setAllChats(data)

   }

  
  const getHistory = async() => {
    if(!selectedChat || !loggedinUser) 
      return

    let reqConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedinUser._id}`
      }
    }
    const {data} = await axios.get(`/api/messages/${selectedChat._id}`, reqConfig)
    if(!data) {
      throw Error('fetching history failed')
    }
    console.log('fetched history', data)
    setMessages(data)
    socket.emit('connectChat', selectedChat._id)
  }

  React.useEffect(()=> {
    socket = io(endpoint)
    socket.emit('getLoggedInUserID', userJSON)
    socket.on('connection', () => setSoc(true))
  },[])

  React.useEffect(()=> {
    socket.on('gotMessage', (newMessage)=> {
      console.log('temp', temp._id)
      console.log('newMessage', newMessage.send_in[0]._id)
      if(!temp || temp._id !==newMessage.send_in[0]._id)
        console.log('placeholder')
      else {
        setMessages([...messages, newMessage])
      }
    })
  })

  React.useEffect(() => {
      setLoggedinUser(JSON.parse(localStorage.getItem('userJSON')))
      getChat()
      getHistory()
      temp=selectedChat
    }, [selectedChat])

  const sendMessage = async() => {
    if(!newMsg)
    return
    setNewMsg('')
    let reqConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedinUser._id}`
      }
    }
    const {data} = await axios.post('/api/messages', {
      msg: newMsg,
      id: selectedChat._id
    }, reqConfig)
    if(!data) {
      throw Error('sending message failed')
    }
    console.log('monkas2', data)
    // return
    socket.emit('sendMessage', data)
    setMessages([...messages, data])
  }

  const searchUsers = async() => {
    if(!searchContent)
      return

    let reqConfig = {
      headers: {
        Authorization: `Bearer ${loggedinUser._id}`
      }
    }
    const {data} = await axios.get(`/api/users?search=${searchContent}`, reqConfig)

    if(!data) {
      throw Error('something went wrong')
    }
    console.log('data', data)
    setSearchResult(data)
  }

  const addMember = async(user) => {
    console.log(user, selectedChat.users.length)
    let toAddGroupID = selectedChat._id
    let toAddUserID = user._id
    let temp = selectedChat.users
    let flag = 0
    for(let i=0; i<temp.length; i++) {
      if(temp[i]._id === user._id){
        flag=1
        console.log('cb', selectedChat)
        break
      }
    }
    if(flag===1)
      throw Error('user already exists in group')
    else {
      let reqConfig = {
        headers: {
          Authorization: `Bearer ${loggedinUser._id}`
        }
      }
      const {data} = await axios.post('/api/discuss/addToGroup', {toAddGroupID, toAddUserID}, reqConfig)
      console.log('add group', data)
      // window.location.reload(false)
      setSelectedChat(data)
      return
    }
  }

  const getOtherUser = (me, users) => {
    return users[0]._id !== me._id ? users[0].displayName : users[1].displayName
  }

  const getOtherUserAvatar = (me, users) => {
    return users[0]._id !== me._id ? users[0].avatar : users[1].avatar
  }

  const getOtherUserEmail = (me, users) => {
    return users[0]._id !== me._id ? users[0].email : users[1].email
  }

  const isManager = (me, users) => {
    return me._id === users._id
  }

  const removeFromGroup = async(broh) => {
    console.log('broh', broh)
    let toRemoveGroupID = selectedChat._id
    let toRemoveUserID = broh._id

    let reqConfig = {
      headers: {
        Authorization: `Bearer ${loggedinUser._id}`
      }
    }
    const {data} = await axios.post('/api/discuss/removeFromGroup', {toRemoveGroupID, toRemoveUserID}, reqConfig)
    console.log('remove group', data)
    setSelectedChat(data)
    return
  }

  return (
   <Box 
    background="#98ACF8" 
    width='67vw' 
    // responsive={true} 
    height='95vh'
    pad='small'
    // align='center'
    border={{color:'#BEDCFA', size: 'medium'}}
   > 
   <Box
    style={{
      position: 'absolute',
      top: '45%',
      left: '50%',
    }}
   >
     <Text size='xxlarge'>{!selectedChat && ('Select a chat room to start disCUssing!')}</Text>
   </Box>
   <Box direction='row' align='center' width='60vw' height='6vh' margin={{bottom:'small', top:'none'}}>
      {selectedChat && !selectedChat.is_group &&
        (<Avatar size='medium' src={getOtherUserAvatar(loggedinUser, selectedChat.users
      )}/>)}
      {selectedChat && selectedChat.is_group &&
        (<Avatar size='medium' src='https://cdn.iconscout.com/icon/free/png-256/chat-2130787-1794829.png'/>)}
      <Text size='large' margin={{
        left:'small',
        right:'large'
      }}>
        {selectedChat&&(!selectedChat.is_group ? getOtherUser(loggedinUser, selectedChat.users) : selectedChat.name)}
      </Text>
    <Box>
      {selectedChat && selectedChat.is_group && (<Box onClick={() => setShowGroup(true)}>
        <Tip
        dropProps={{ align: { left: 'right' } }}
        content={<TipContent message='Group information'/>}
        plain
        >
        <CircleInformation size='medium'/>
      </Tip></Box>)}
      {selectedChat && !selectedChat.is_group && (<Box onClick={() => setShowProfile(true)}>
        <Tip
        dropProps={{ align: { left: 'right' } }}
        content={<TipContent message='User profile'/>}
        plain
        >
        <CircleInformation size='medium'/>
      </Tip></Box>)}
    </Box>
   </Box>

   {selectedChat && 
   <Box
    background='#F5F5F5'
    round={'small'}
    direction='column'
    justify='end'
    width='auto'
    height='100%'
    pad='small'
   >
     <Box justify='end'>
     <ScrollableFeed>
     <Box direction='column' margin='small'>
       {selectedChat && !selectedChat.is_group && (messages?.map((item, i)=>
       (
        <Box key={item._id}>
        <Box
          pad={{
            top:'small',
            bottom:'small',
            left:'medium',
            right:'medium'
          }}
          alignSelf={item.sender[0]._id===loggedinUser._id ? 'end': 'start'}
          background={item.sender[0]._id===loggedinUser._id ? '#D5F3FE': '#CBC3E3'}
          round={{
            size:'small',
            corner: item.sender[0]._id===loggedinUser._id ? 'top-left': 'top-right'
          }}
          width='fit-content'
          margin='small'
        >
          <Text 
            pad='small'
          >
            {item.message}
          </Text>
        </Box>
        {item.contains_link &&(
          <Box margin={{
            left: 'medium',
            right: 'medium'
          }}>

        <Embed url={item.message.match(/\bhttps?:\/\/\S+/gi)[0]}/>
        </Box>
        )}
        </Box>
      )))}
       {selectedChat && selectedChat.is_group && (messages?.map((item, i)=>
       (
        <Box key={item._id}>
        <Box
          pad={{
            top:'small',
            bottom:'small',
            left:'medium',
            right:'medium'
          }}
          alignSelf={item.sender[0]._id===loggedinUser._id ? 'end': 'start'}
          background={item.sender[0]._id===loggedinUser._id ? '#D5F3FE': '#CBC3E3'}
          round={{
            size:'small',
            corner: item.sender[0]._id===loggedinUser._id ? 'top-left': 'top-right'
          }}
          width='fit-content'
          margin='small'
        >
        {item.sender[0]._id!==loggedinUser._id &&(<Box direction='row'
          align='center'>
          <Avatar src={item.sender[0].avatar}/>
          <Text weight='bolder' margin={{left:'small'}}>{item.sender[0].displayName}</Text>
        </Box>)}
          <Text 
            pad='small'
          >
            {item.message}
          </Text>
        </Box>
        {item.contains_link &&(
          <Box margin={{
            left: 'medium',
            right: 'medium'
          }}>

        <Embed url={item.message.match(/\bhttps?:\/\/\S+/gi)[0]}/>
        </Box>
        )}
        </Box>
      )))}
     </Box>
     </ScrollableFeed>
     </Box>
     <Keyboard onEnter={sendMessage}>
      <TextInput
        placeholder='Enter message'
        margin='small'
        value={newMsg}
        icon={<Send/>}
        onChange={e => setNewMsg(e.target.value)}
      >
      </TextInput>
      </Keyboard>
   </Box>
  }
   {showProfile && (
     <Layer 
      onEsc={()=> setShowProfile(false)}
      onClickOutside={()=> setShowProfile(false)}
      >
        <Box
          direction='column'
          width='30vw'
          height='50vh'
          background='white'
          align='center'
          pad='medium'>
            <Text size='3xl' margin='small'>{getOtherUser(loggedinUser, selectedChat.users)}</Text>
            <Avatar margin='large' size='3xl' src={getOtherUserAvatar(loggedinUser, selectedChat.users)}/>
            <Text size='xlarge' margin='small'>Email: {getOtherUserEmail(loggedinUser, selectedChat.users)}</Text>

        </Box>
     </Layer>
   )}

  {showGroup && selectedChat && loggedinUser && isManager(selectedChat.manager[0], loggedinUser) && (
     <Layer 
      onEsc={()=> setShowGroup(false)}
      onClickOutside={()=> setShowGroup(false)}
      >
        <Box
          direction='column'
          width='auto'
          height='auto'
          background='white'
          align='center'
          pad='medium'>
            <Text size='xlarge' margin='medium'>Group members</Text>
            <Box direction='row'>
            {selectedChat.users.map(user=> (
              <Box border= {{
                color:'grey',
                size:'small'
              }}
                round='medium'
                width='auto'
                key={user._id}
                direction='row'
                align='center'
                justify='between'
                pad={{right:'small', left:'small'}}
                margin='xsmall'
                onClick={()=> removeFromGroup(user)}
                >
                  <Avatar size='small' src={user.avatar}/>
                  <Text size='small' margin='small'>{user.displayName}</Text>
                  <Close size='small'/>
              </Box>
            ))}
            </Box>
                <Box direction='row' width='40vw' margin='small'>    
                  <TextInput
                     placeholder='Add users'
                     value={searchContent}
                     onChange={(e)=> setSearchContent(e.target.value)}
                  />
                  <Button 
                     icon={<Search/>} 
                     reverse={true} 
                     hoverIndicator
                     onClick={searchUsers}
                  />
                </Box>
                  {searchResult?.map(user=> (
                    <Box 
                      direction='row'
                      border={{color: '#b19cd9', size:'small'}} 
                      height='7vh'
                      pad='small'
                      round='small'
                      width='30vw'
                      key={user._id}
                      margin='xsmall'
                      align='center'
                      onClick={() => addMember(user)}
                      background='#ffffed'
                      hoverIndicator={{color:'#f0f0f0'}}
                    >
                      <Avatar src={user.avatar}/>
                      <Box direction='column' margin='small'>
                        <Text weight='bold'>{user.displayName}</Text>
                        <Text size='small'>Email: {user.email}</Text>
                      </Box>
                  </Box>
                  ))}
        </Box>
     </Layer>
   )}
  {showGroup && selectedChat && loggedinUser && !isManager(selectedChat.manager[0], loggedinUser) && (
     <Layer 
      onEsc={()=> setShowGroup(false)}
      onClickOutside={()=> setShowGroup(false)}
      >
        <Box
          direction='column'
          width='30vw'
          height='auto'
          background='white'
          align='center'
          pad='medium'>
            <Text size='xlarge' margin='medium'>Group members</Text>
            <Box direction='column'>
            {selectedChat.users.map(user=> (
              <Box border= {{
                color:'grey',
                size:'small'
              }}
                round='medium'
                width='auto'
                key={user._id}
                direction='row'
                align='center'
                justify='between'
                pad={{right:'small', left:'small'}}
                margin='xsmall'
                >
                  <Avatar size='small' src={user.avatar}/>
                  <Text size='small' margin='small'>{user.displayName}</Text>
              </Box>
            ))}
            </Box>
        </Box>
     </Layer>
   )}
   </Box>
  )
}

export default ChatBox