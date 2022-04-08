// import React from 'react'
// import { Sidebar, Avatar, Box } from 'grommet'


const Leftbar = () => {
  // const [search, setSearch] = React.useState('')
  // const [searchedUsers, setSearchedUsers] = React.useState([])
  // const [loadingSearch, setLoadingSearch] = React.useState(false)
  // const [loadingStuff, setLoadingStuff] = React.useState()

  let userJSON = localStorage.getItem('userJSON')
  userJSON = JSON.parse(userJSON)
  // console.log('jibai knn', userJSON)

  return (<div>Leftbar</div>)
}

export default Leftbar