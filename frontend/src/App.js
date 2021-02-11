import React from 'react';
import './App.css';
import Layout from './containers/Layout.js';
import {BrowserRouter} from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store';


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">       
          <Layout/>
        </div>
      </BrowserRouter>
    </Provider>
    
    
  );
}

export default App;