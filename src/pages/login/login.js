import React, { useState } from 'react'
import { Grid, Typography, Button, Paper, Avatar, responsiveFontSizes, Link, MenuIcon, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import LockIcon from '@mui/icons-material/Lock';
import firebase from "firebase/app";
import "firebase/auth";
import { useHistory } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
const Login = () => {
  const history = useHistory();
  const paperStyle = { width: 400, padding: 20 }
  const avatarStyle = { backgroundColor: "#14529e" }
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        if (user.email === 'admin@gmail.com') {
          history.push('/dashboard')
        }
        else if(user.email === 'kitchen@gmail.com'){
          history.push('/kitchen')
        }
        // ...
      })
      .catch((error) => {
        console.log('login err', error)
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }


  return (<div style={{
    height: '100vh',
    display: 'flex',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `url("https://images.pexels.com/photos/1819669/pexels-photo-1819669.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")`
  }}>
   
    <Box  sx={{ flexGrow: 1 }}>
      <AppBar color="transparent" position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <HomeIcon sx={{ fontSize: 40 }} onClick={() => history.push('/home')} color="primary" />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>

    <Grid  container justifyContent='center' alignItems='center'>

      <Paper elevation={20} style={paperStyle} >
        <Grid align="center">
          <Avatar style={avatarStyle}><LockIcon /></Avatar>
          <h1 style={{ fontFamily: "Vollkorn", fontSize: 40 }}>Sign In</h1>
        </Grid>
        <TextField label="Username" placeholder="Enter Username" fullWidth required value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField label="Password" placeholder="Password" fullWidth required value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <br />

        <Button
          type="submit"
          fullWidth
          color="primary"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => handleLogin(username, password)}
        >

          Sign In
        </Button> <br /><br />
        {/* <Typography>

          <Link href="#" >
            Forgot password?
          </Link>
        </Typography>
        <Typography >  Don't have an account?
          <Link href="#" variant="body2" >
            {"Sign Up"}
          </Link>
        </Typography> */}

      </Paper>
    </Grid>
  </div>
  );
}

export default Login