import React, { useEffect, useState } from 'react'
import { Chat } from '../state/State'
import axios from 'axios'

const Discuss = () => {
   // const [rawData, setRawData] = useState([])
   // const getRaw = async () => {
   //    const rawData = await axios.get('/api/getChats')
   //    console.log('data', rawData.data)
   //    setRawData(rawData.data)
   // }

   // useEffect( () => {
   //    getRaw()
   // }, [])
   // const { loggedinUser } = Chat()
   
   return (
      <div>
         {/* {rawData.map((bruv) => (
            <div key={bruv._id}>{bruv.content}</div>
         ))} */}
      </div>
   )
}

export default Discuss