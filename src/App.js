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
import {makeStyles} from '@material-ui/core/styles';
import Kitchen from './pages/kitchen/kitchen';
import Dashboard from './pages/dashboard/dashboard';
import Menu from './pages/menu/menu'
import Login from './pages/login/login' 
import Header from './components/Header';
import Front from './pages/frront';

const firebaseConfig = {
  apiKey: "AIzaSyBRKL2yLsocLgIN22WzeZpnDhAZuugxFi8",
  authDomain: "digital-menu-4310d.firebaseapp.com",
  databaseURL: "https://digital-menu-4310d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "digital-menu-4310d",
  storageBucket: "digital-menu-4310d.appspot.com",
  messagingSenderId: "531678763244",
  appId: "1:531678763244:web:cf6866ceecc1fb5f59edc9"
};

firebase.initializeApp(firebaseConfig);
const useStyles = makeStyles({
  root: {
    width: '100%'
    // backgroundColor: 'red',
    // color: props => props.color,
  },
});

function App(props) {
  const classes = useStyles(props);
const [count, setCount] = useState(0)

useEffect(()=>{
  let staters = [
    {
      name:'',
      cost:'xx.xx'
    },
    {
      name:'dish2',
      cost:'xx.xx'
    }
  ]

  let x = {
    starters:staters,
  
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
   {/*<Header resName={'demo res'}/>*/}
      
  <Switch>
    <Route path="/menu">
      <Menu />
    </Route>

    <Route path="/dashboard">
      <div className={classes.root}>
      <Dashboard />
      </div>
    </Route>

    <Route path="/kitchen">
      <Kitchen />
    </Route>

    <Route path="/login">
      <Login />
    </Route>

    <Route path="/front">
      <Front/>
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
