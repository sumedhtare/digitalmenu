import React, { useState, useEffect } from 'react'
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { useHistory } from "react-router-dom";
import { Grid, Typography } from '@material-ui/core';
import { ModalContainer } from './kitchen.style';
import { objToArr } from '../../functions/utils'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';

const Kitchen = () => {
  const [data, setData] = useState({ home: [], table: [] });
  const history = useHistory()
  useEffect(() => {


    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        console.log('kitchen', user)
        if (user.email === 'kitchen@gmail.com' || user.email === 'admin@gmail.com') {
          console.log('success')
        }
        else {
          history.push('/login')
        }
        // ...
      } else {
        history.push('/login')
        // User is signed out
        // ...
      }
    });


    firebase.database().ref('orders/').on('value', (snapshot) => {
      let databaseVal = snapshot.val();
      console.log('databaseVal', databaseVal)
      let tempData = { ...data }
      if (databaseVal.table != undefined) {
        let tables = Object.keys(databaseVal.table);
        let tempTable = []
        for (let i = 0; i < tables.length; i++) {
          let x = databaseVal.table[tables[i]]
          x.id = tables[i]
          tempTable.push(x)
        }
        tempData.table = tempTable
      }
      if (databaseVal.home != undefined) {
        let tables = Object.keys(databaseVal.home);
        let tempTable = []
        for (let i = 0; i < tables.length; i++) {
          let x = databaseVal.home[tables[i]]
          x.id = tables[i]
          tempTable.push(x)
        }
        tempData.home = tempTable
      }
      setData(tempData)
      console.log('tempData', tempData)
    })
  }, [])

  const handleLogout = () => {
    firebase.auth().signOut()
      .then(res => {
        history.push('/login')
      })
  }


  return (<div style={{ padding: 20 }}>
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
         <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
          <Typography style={{ textAlign: "center", fontFamily: "nunito" }} variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Kitchen
          </Typography>
          <IconButton
           variant="contained"
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={() => handleLogout()}
          >
            <LogoutIcon sx={{ mt: 3, mb: 2 }} elevation={5} />
          </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </Box>

    <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start">
      <h3 style={{ fontFamily: 'sora', fontSize: '1.5rem', textTransform: 'capitalize'}}>Home delivery ({data.home?.length})</h3>
      <Grid spacing={2} xs={12} container direction='row'>
        {data.home.map((item, index) => {
          return <Grid item xs={12} sd={6} md={4}><DeliveryModal item={item} /></Grid>
        })}
      </Grid>
      
      <h3 style={{ fontFamily: 'sora', fontSize: '1.5rem', textTransform: 'capitalize'}}>From Table</h3>
      <Grid spacing={2} xs={12} container direction='row'>
        {data.table.map((item, index) => {
          return <Grid item xs={12} sd={6} md={4}><TableModal item={item} /></Grid>
        })}

      </Grid>
    </Grid>
  </div>
  )
}

export default Kitchen

const DeliveryModal = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false)

  const handleClick = () => {
    setShowDetails(!showDetails)
  }

  const handleDelete = (id) => {
    firebase.database().ref('orders/home').update({
      [id]: null
    })
      .then(res => {
        alert('your order has been cleared')
      })
  }

  return <ModalContainer onClick={handleClick}>
    <FormText placeholder={'ID'} text={item.id} />
    <FormText placeholder={'From'} text={item.customer.name} noWrap />
    <FormText placeholder={'Address'} text={item.customer.address} />
    <FormText placeholder={'Number'} text={item.customer.number} />
    {<div style={{ height: showDetails ? 'auto' : 0, overflow: 'hidden' }}>
      <Typography style={{ fontWeight: 'bold' }}>Order</Typography>
      {objToArr(item).map((item, index) => {
        return <FormText placeholder={index + 1} text={`${item.name} x ${item.count}`} />
      })}
      <Button variant="contained" size='small' color='primary' onClick={() => handleDelete(item.id)}>Completed</Button>
    </div>}
  </ModalContainer>
}

const TableModal = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false)

  const handleClick = () => {
    setShowDetails(!showDetails)
  }

  const handleDelete = (id) => {
    firebase.database().ref('orders/table').update({
      [id]: null
    })
      .then(res => {
        alert('your order has been cleared')
      })
  }

  return <ModalContainer onClick={handleClick}>
    <FormText placeholder={'Table no'} text={item.id} />
    {<div style={{ height: showDetails ? 'auto' : 0, overflow: 'hidden' }}>
      <Typography style={{ fontWeight: 'bold' }}>Order</Typography>
      {objToArr(item).map((item, index) => {
        return <FormText placeholder={index + 1} text={`${item.name} x ${item.count}`} />
      })}
      <Button variant="contained" size='small' color='primary' onClick={() => handleDelete(item.id)}>Completed</Button>
    </div>}
  </ModalContainer>
}

const FormText = ({ placeholder, text, noWrap = false }) => {
  return <Typography style={{ fontWeight: 'bold' }} noWrap={noWrap}>{placeholder}: <span style={{ fontWeight: 'normal' }}>{text}</span></Typography>
}