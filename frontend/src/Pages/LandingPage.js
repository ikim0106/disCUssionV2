import React from 'react'
import Login from '../LandingTabs/Login'
import Signup from '../LandingTabs/Signup'
import {Box, Text, Tabs, Tab} from 'grommet'
import {FormEdit, Return} from 'grommet-icons'
import { useHistory } from 'react-router-dom'

   const myStyle = {
      backgroundImage: "url(https://elephant.com.hk/wp-content/uploads/2018/05/CUHK-1.jpg)",
      height: '100vh',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
   }

   const opacityCover = {
      height: '100%',
      width: '100%',
      backgroundSize:'cover',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
   }

const LandingPage = () => {
   const redir = useHistory()
   
   React.useEffect(() => {
      let userJSON = localStorage.getItem('userJSON')
      if(userJSON !== 'undefined' && userJSON !== null) {
         console.log('userJSON', userJSON)
         // redir.push('/discuss')
      }
      else {
         console.log('userJSON', userJSON)
         redir.push('/')
      }
      
   }, [redir])

   return (
   <div style = {myStyle}>
   <div style = {opacityCover}>


   <Box
      direction="column"
      justify="center"
      align="center"
      pad="medium"
      background="none"
      gap="small"
   >
      <Box
         pad="small"
         align="center"
         width="30em"
         border= {{color: "#A020F0", size: "small"}}
         background={{color: 'rgba(255, 255, 255, 0.8)'}}
         round
         gap="small"
      >
         <Text
         // margin='small'
         size='3xl'
         >
            disCUssion
         </Text>
         <Text
         size='medium'
         >
            Log in or sign up to disCUss!
         </Text>
      </Box>
      <Box
         pad="medium"
         align="center"
         width="30em"
         border = {{color: "#FFD700", size: "small"}}
         background={{color: 'rgba(255, 255, 255, 0.8)'}}
         round
         gap="small"
      >
         <Tabs width='25em' margin='small' justify='center' flex="grow">
         <Tab title="Log in" icon={<Return/>}>
            <Box align = 'center' pad="small"><Login/></Box>
         </Tab>
         <Tab title="Sign up" icon={<FormEdit/>}>
            <Box align = 'center' pad="small"><Signup/></Box>
         </Tab>
         </Tabs>
      </Box>
   </Box>         
      </div>
   </div>
   )
}

export default LandingPage