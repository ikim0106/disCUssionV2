// import logo from './logo.svg';
import './App.css';
import {Route} from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import ChatPage from './Pages/ChatPage';
import { Grommet } from 'grommet'

const theme = {
  global: {
    colors: {
      brand:'#228BE6'
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
}

function App() {
  return (
    <Grommet theme={theme}>
      <Route exact path = '/' component={LandingPage}/>
      <Route path = '/discuss' component={ChatPage}/>
    </Grommet>
  );
}

export default App;
