import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';
import HomeScreen from './Components/HomeScreen.js';
import { Fragment } from 'react';

function App() {
  return (
    <Fragment>
        <HomeScreen/>
    </Fragment>
  );
}

export default App;
