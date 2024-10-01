import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import EtherToken from './EtherToken';
import Token from './TokenTest';
import FetchERC from './contracts/FetchERC';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    {/* <App /> */}
    {/* <EtherToken/> */}
    <Token/>
    {/* <FetchERC/> */}
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

