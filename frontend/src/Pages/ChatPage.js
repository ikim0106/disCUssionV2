import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ChatPage = () => {
   const [rawData, setRawData] = useState([])
   const getRaw = async () => {
      const rawData = await axios.get('/api/getChats')
      console.log('data', rawData.data)
      setRawData(rawData.data)
   }

   useEffect( () => {
      getRaw()
   }, [])
   
   return (
      <div>
         {rawData.map((bruv) => (
            <div key={bruv._id}>{bruv.content}</div>
         ))}
      </div>
   )
}

export default ChatPage