import React,{useEffect, useState} from 'react'
import firebase from "firebase/app";
import "firebase/database";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './pages/home/home';
import About from './pages/about/about'
import Delivery from './pages/delivery/delivery';
import Dashboard from './pages/dashboard/dashboard';
import Menu from './pages/menu/menu'
function App() {

const [count, setCount] = useState(0)

useEffect(()=>{
  let staters = [
    {
      name:'dish1',
      cost:'xx.xx'
    },
    {
      name:'dish2',
      cost:'xx.xx'
    }
  ]

  let x = {
    starters:staters
  }
  // firebase.database().ref('menu/').set(x)

  firebase.database().ref('menu/').once('value', (snapshot)=>{
    let databaseVal = snapshot.val();
    console.log('databaseVal',databaseVal)
  })
},[])


  return (
<Router>
<div>
  {/* <nav>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/delivery">delivery</Link>
      </li>
    </ul>
  </nav> */}


  {/* A <Switch> looks through its children <Route>s and
      renders the first one that matches the current URL. */}
  <Switch>

    <Route path="/about">
      <About />
    </Route>

    <Route path="/menu">
      <Menu />
    </Route>

    <Route path="/dashboard">
      <Dashboard />
    </Route>

    <Route path="/delivery">
      <Delivery />
    </Route>

    <Route path="/">
      <Home />
    </Route>

  </Switch>
</div>
</Router>
  );
}

export default App;
