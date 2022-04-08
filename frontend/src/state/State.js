/*
References:
1. https://reactjs.org/docs/hooks-reference.html
2. https://reactjs.org/docs/context.html
3. https://frontarm.com/james-k-nelson/usecontext-react-hook/
4. https://blog.logrocket.com/using-localstorage-react-hooks/
*/

import React from 'react'
import {useHistory} from 'react-router-dom'

const Context = React.createContext()
const ChatState = ({children}) => {
   const [loggedinUser, setLoggedinUser] = React.useState()
   const redir = useHistory()
   
   React.useEffect(() => {
      let userJSON = localStorage.getItem('userJSON')
      if(userJSON !== 'undefined' && userJSON !== null) {
         console.log('userJSON', userJSON)
         JSON.parse(userJSON)
         setLoggedinUser(userJSON)
         redir.push('/discuss')
      }
      else {
         // console.log('redir', redir)
         redir.push('/')
      }
      
   }, [redir])
   // console.log('wtf', children)
   return (<Context.Provider value={{loggedinUser, setLoggedinUser}}>{children}</Context.Provider>)
}

export const Chat = () => {
   const lmao = React.useContext(Context)
   console.log('lmao', lmao)
   return lmao
}

export default ChatState