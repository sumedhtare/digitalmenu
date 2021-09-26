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
import { styled, alpha } from '@mui/material/styles';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Menu from '@mui/material/Menu';
import AppsIcon from '@mui/icons-material/Apps';
import HomeIcon from '@mui/icons-material/Home';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

 {/*For Appbar  menu*/}
 const StyledMenu = styled((props) => (
  <Menu
      elevation={0}
      anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
      }}
      transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
      }}
      {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
          theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
      boxShadow:
          'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
          padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
          '& .MuiSvgIcon-root': {
              fontSize: 18,
              color: theme.palette.text.secondary,
              marginRight: theme.spacing(1.5),
          },
          '&:active': {
              backgroundColor: alpha(
                  theme.palette.primary.main,
                  theme.palette.action.selectedOpacity,
              ),
          },
      },
  },
}));

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
   {/*For Kitchen menu*/ }
   const [anchorEl, setAnchorEl] = React.useState(null);
   const open = Boolean(anchorEl);
   const handleClick = (event) => {
       setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
       setAnchorEl(null);
   };


  return (<div style={{ padding: 20 }}>
   <Box sx={{ flexGrow: 1 }}>
            <AppBar /*color="transparent" elevation={0}*/ position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <LogoutIcon sx={{ mt: 3, mb: 2 }} onClick={() => handleLogout()} />
                    </IconButton >
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <Typography style={{ textAlign: "center", fontFamily: "nunito" }} variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                         Kitchen
                        </Typography>
                        {/*For dashboard menu*/}
                        <IconButton
                            id="demo-customized-button"
                            aria-controls="demo-customized-menu"
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            variant="contained"
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={handleClick}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            <AppsIcon sx={{ mt: 3, mb: 2 }} elevation={5}/>
                        </IconButton>
                    
                        <StyledMenu
                            id="demo-customized-menu"
                            MenuListProps={{
                                'aria-labelledby': 'demo-customized-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => history.push('/dashboard')} disableRipple>
                                <DashboardCustomizeIcon color="primary"/>
                                DashBoard
                            </MenuItem>
                            <MenuItem onClick={() => history.push('/menu')} disableRipple>
                                <MenuBookIcon color="primary"/>
                                Menu Page
                            </MenuItem>
                            <Divider  sx={{ my: 0.5 }} />
                            <MenuItem onClick={() => history.push('/home')}  disableRipple>
                                <HomeIcon color="primary"/>
                                Home Page
                            </MenuItem>
                           
                        </StyledMenu>
                        {/*...*/}
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