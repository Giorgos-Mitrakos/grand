import React from 'react';
import './App.css';
import Layout from './containers/Layout.js';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store';
import { Helmet } from 'react-helmet';


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Helmet>
            <title>Grand Mobile Accessories</title>
            <meta name="description" content="Εμπόριο συσκευών κινητής τηλεφωνίας.Φτιάξε τη θήση σου.Κινητά, tablet, laptop, υπολογιστές, gaming, εικόνα-ήχος, gadgets, αναλώσιμα και είδη γραφείου, προγράμματα και υπηρεσίες, φωτισμός, ιατρικά είδη." />
            <meta name="theme-color" content="#000000" />
          </Helmet>
          <Layout />
        </div>
      </BrowserRouter>
    </Provider>


  );
}

export default App;