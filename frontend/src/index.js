import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter} from 'react-router-dom'
import ChatState from './state/State'
// import { Grommet } from 'grommet'
import App from './App';

// import reportWebVitals from './reportWebVitals';

// console.log('ChatState', ChatState)

ReactDOM.render(
  <BrowserRouter>
    <ChatState>
      <App />
    </ChatState>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
