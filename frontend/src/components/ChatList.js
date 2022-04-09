import React from 'react'
import {InfiniteScroll, Spinner, Box, Avatar, Button, Accordion, AccordionPanel, Layer, Text, TextInput, Notification, Tip} from 'grommet'
import { Add, Search, Edit, Close} from 'grommet-icons'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import {Chat} from '../state/State'

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

const ChatList = () => {
   const {loggedinUser, setLoggedinUser, selectedChat, allChats, setAllChats, setSelectedChat} = Chat()
   const history = useHistory()
   const [noSearch, setNoSearch] = React.useState(false)
   const [searchContent, setSearchContent] = React.useState('')
   const [searchLabel, setSearchLabel] = React.useState(false)
   const [showProfile, setShowProfile] = React.useState(false)
   const [newPw, setNewPw] = React.useState('')
   const [newPwToast, setNewPwToast] = React.useState(false)
   const [loading, setLoading] = React.useState(false)
   const [groupLayer, setGroupLayer] = React.useState(false)
   const [searchResult, setSearchResult] = React.useState([])
   const [groupName, setGroupName] = React.useState('')
   const [groupToast, setGroupToast] = React.useState(false)
   const [tags, setTags] = React.useState([])
   const [tagToast, setTagToast] = React.useState(false)
   const [memberToast, setmMemberToast] = React.useState(false)

   let userJSON = localStorage.getItem('userJSON')
   userJSON = JSON.parse(userJSON)
   // setLoading(false)

   const createGroup = async()=> {
      let reqConfig = {
         headers: {
            Authorization: `Bearer ${userJSON._id}`,
         }
      }
      if(!groupName){
         setGroupToast(true)
         return
      }
      if(tags.length<2) {
         setmMemberToast(true)
         return
      }
      console.log('tags', tags)
      let stuff = JSON.stringify(tags.map((user)=>user._id))
      const {data} = await axios.post('/api/discuss/makeGroup', {
         name: groupName,
         loggedinUser: loggedinUser,
         users: stuff
      }, reqConfig)
      console.log('returnData', data)
      if(!data) {
         console.log('error creating group chat')
         throw Error('error creating group chat')
      }
      setAllChats([data, ...allChats])
      setGroupLayer(false)
   }

   const removeMember = async(user)=> {
      setTags(tags.filter((elem) => elem._id !== user._id))
      console.log('remove user', user)
   }

   const addMember = async(user)=> {
      if(tags.includes(user)){
         setTagToast(true)
         console.log(tags)
         return
      }
      setTags([...tags, user])
      console.log(tags)
   }
   
   const handleClick = async(chat) => {
      console.log('clicked chat', chat)
      setSelectedChat(chat)
   }

   const getOtherUser = (me, users) => {
      // me=JSON.parse(me)
      // console.log('other user is', me)
      return users[0]._id !== me._id ? users[0].displayName : users[1].displayName
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

   React.useEffect(() => {
      setLoggedinUser(JSON.parse(localStorage.getItem('userJSON')))
      getChat()
   }, [])
   

   const clickedUser = async(otherUserId) => {
      setLoading(true)
      console.log('clicked user', otherUserId)
      setSearchLabel(false)
      let reqConfig = {
         headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userJSON._id}`,
         }
      }
      const {data} = await axios.post('/api/discuss', {otherUserId}, reqConfig)
      // if(!allChats.find((e) => e._id===data._id)) setAllChats([data, ...allChats])
      if(!data) {
         console.log('err lmao')
         setLoading(false)
         throw Error('error fetching chat')
      }
      // setChat(data)
      localStorage.setItem('currentChat', JSON.stringify(data[0]))
      // console.log('returned chat', data)
      setSelectedChat(data[0] || data)
      getChat()
      setLoading(false)
   }

   const searchUsers = async() => {
      setLoading(true)
      if(!searchContent) {
         setNoSearch(true)
         setLoading(false)
         return
      }
      let reqConfig = {
         headers: {
            Authorization: `Bearer ${userJSON._id}`,
         }
      }
      console.log('wtf', reqConfig.headers.Authorization)

      const {data} = await axios.get(`/api/users?search=${searchContent}`, reqConfig)
      if(!data) {
         setLoading(false)
         throw Error('something went wrong')
      }
      console.log('search', data)
      setSearchResult(data)
      setLoading(false)
   }

   const logout = async() => {
      console.log('logout')
      localStorage.removeItem('userJSON')
      history.push('/')
   }
   
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
   <Box height='97vh' width='30vw'>
   <Box 
    background="brand" 
    width='30vw' 
    responsive={true} 
    height='8vh'
    border={{color:'skyblue', size: 'medium'}}
   >
     <Box pad='small' direction='row' alignContent='stretch'>
        <Box direction='row' 
         style = {{
            position:'absolute',
            zIndex: '1'
         }}>
         <Accordion>
            <AccordionPanel label={<Avatar src={userJSON.avatar}/>}>
               <Box pad="medium" background="light-1">
                  <Button 
                     plain={true} 
                     label='Log out'
                     onClick={logout}
                     />
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
            <Tip
               dropProps={{ align: { left: 'right' } }}
               content={<TipContent message='New group'/>}
               plain>
               <Button 
                  icon={<Add/>} 
                  reverse={true} 
                  onClick={()=> setGroupLayer(true)}
                  />
            </Tip>
         </Box>
         <Box
            align='center'
            width='5vw'
            direction='row'>
               <Tip
                  dropProps={{ align: { left: 'right' } }}
                  content={<TipContent message='Search users'/>}
                  plain
               >
            <Button 
               icon={<Search/>} 
               reverse={true} 
               hoverIndicator
               onClick={() => setSearchLabel(true)}
               />
               </Tip>
         </Box>
      </Box>
      </Box>
      
   </Box>     
            
   <Box 
      style = {{
         position:'absolute',
         zIndex: '0'
      }}
      background='skyblue'
      width='30vw'
      margin={{top:'8vh'}}
      height='87vh'
      overflow='overlay'>
         <InfiniteScroll items={allChats}>         
         {((item)=>
            <Box 
               pad='small'
               flex={false}
               border={{
                  color:'grey',
                  size:'small',
                  side:'bottom'
               }}
               margin='xsmall'
               key={item._id}
               direction='row'
               align='center'
               onClick={()=>handleClick(item)}
            >
               {!item.is_group && (
                  <Avatar size='large' src={item.users[0].avatar}> </Avatar>
               )}
               {item.is_group && (
                  <Avatar size='large' src='https://cdn.iconscout.com/icon/free/png-256/chat-2130787-1794829.png'> </Avatar>
               )}
               <Text color='Black' size='large' margin='small'>
                  {!item.is_group ? getOtherUser(loggedinUser, item.users) : item.name}
               </Text>
            </Box>
         )}
         </InfiniteScroll>
      </Box>

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
      {groupLayer && (
         <Layer
            onEsc={()=> setGroupLayer(false)}
            onClickOutside={()=> setGroupLayer(false)}
         >
            <Box align='center' height='80vh' pad='small'>
               <Text size='large'>New group</Text>
               <Box direction='row' width='30vw' margin='small' >    
                  <TextInput
                     placeholder='Group name'
                     value={groupName}
                     onChange={(e)=> setGroupName(e.target.value)}
                  />
               </Box>
               <Box direction='row' width='30vw' margin='small'>    
                  <TextInput
                     placeholder='Search users'
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
               <Box direction='row'>
               {tags.map(user=>(
                  <Box
                     border={{
                        color:'grey',
                        size:'small'
                     }}
                     round='medium'
                     key={user._id}
                     direction='row'
                     align='center'
                     margin='xsmall'
                     pad={{right:'small', left:'small'}}
                     onClick={()=> removeMember(user)}
                  >
                     <Avatar size='small' src={user.avatar}/>
                     <Text size='small' margin='small'>{user.displayName}</Text>
                     <Close size='small'/>
                  </Box>
               ))}
               </Box>
                  {!loading && (
                     searchResult?.map(user=> (
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
                     ))
                  )}
            </Box>
            <Box pad='small'>
               <Button primary label='Create group'
                  onClick={createGroup}
               />
            </Box>
         </Layer>
      )}
      {searchLabel && (
         <Layer
            onEsc={()=> setSearchLabel(false)}
            onClickOutside={()=> setSearchLabel(false)}
            >
               <Box height='80vh' width='40vw' direction='column' align='center' pad='medium'>
                  <Text size='large'>Search users</Text>
                  <Box direction='row' width='30vw' margin='small'>    
                     <TextInput
                        placeholder='Search users'
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
                  {!loading && (
                     searchResult?.map(user=> (
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
                           onClick={() => clickedUser(user._id)}
                           background='#ffffed'
                           hoverIndicator={{color:'#f0f0f0'}}
                        >
                           <Avatar src={user.avatar}/>
                           <Box direction='column' margin='small'>
                              <Text weight='bold'>{user.displayName}</Text>
                              <Text size='small'>Email: {user.email}</Text>
                           </Box>
                        </Box>
                     ))
                  )}
               </Box>
         </Layer>
      )}
      {newPwToast && (
        <Notification
          toast
          status='warning'
          title="Please provide a password"
          onClose={() => setNewPwToast(false)}
        />
      )}

      {noSearch && (
        <Notification
          toast
          status='warning'
          title="Please provide something to search"
          onClose={() => setNoSearch(false)}
        />
      )}

      {loading && (
         <Layer>
            <Box background={{color: 'white', opacity:'0.7'}} 
            width='20vh' height='20vh' align='center' alignContent='center' pad='large'>
               <Spinner size='xlarge'/>
            </Box>
         </Layer>
      )}

      {groupToast && (
        <Notification
          toast
          status='warning'
          title="Please provide a group name"
          onClose={() => setGroupToast(false)}
        />
      )}

      {tagToast && (
        <Notification
          toast
          status='warning'
          title="You have already added that user"
          onClose={() => setTagToast(false)}
        />
      )}

      {memberToast && (
        <Notification
          toast
          status='warning'
          title="You must select two or more users"
          onClose={() => setmMemberToast(false)}
        />
      )}
      
   </Box>
  )
}

export default ChatList