// import logo from './logo.svg';
import './App.css';
import {Route} from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import Discuss from './Pages/Discuss';
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
      <Route path = '/discuss' component={Discuss}/>
    </Grommet>
  );
}

export default App;
