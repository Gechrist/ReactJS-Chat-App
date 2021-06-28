import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route } from "react-router-dom";
import Join from './components/join.js';
import Chat from './components/chat.js';

const App = () => {

  return(
          <BrowserRouter>
            <Route path = '/' exact component={Join}/>
            <Route path ='/chat' exact component={Chat}/>
          </BrowserRouter>
)};

export default App;
