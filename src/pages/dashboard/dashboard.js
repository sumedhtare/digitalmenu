import React, { useEffect, useState } from 'react'
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import QRCode from "react-qr-code";
import { Grid, Typography, Button, Paper, Avatar, responsiveFontSizes, FormControlLabel, Checkbox } from '@material-ui/core';
import { useHistory, Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import { TextField } from '@mui/material';
import Modal from '@mui/material/Modal';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const initMenuType = [
    {
        value: 'starters',
        text: 'Starters'
    },
    {
        value: 'main_course',
        text: 'Main Course'
    },
    {
        value: 'deserts',
        text: 'Deserts'
    }
]

const initDishType = [
    {
        value: 'veg',
        color: 'green',
        text: 'Veg'
    },
    {
        value: 'non-veg',
        color: 'red',
        text: 'Non-Veg'
    }
]


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const Dashboard = () => {
    const history = useHistory();
    const [dishname, setDishname] = useState('')
    const [price, setPrice] = useState()
    const [menulist, setMenulist] = useState([])
    const [menuType, setMenuType] = useState(initMenuType[0].value)
    const [dishType, setDishType] = useState(initDishType[0].value)
    const [tableNo, setTableNo] = useState('')
    const [qrModal, setQRModal] = useState(false)
    const [addModal, setAddModal] = useState(false)

    const paperStyle = { width: 250, padding: 30 }
    useEffect(() => {

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                var uid = user.uid;
                if (user.email !== 'admin@gmail.com') {
                    history.push('/login')
                }
                // ...
            } else {
                history.push('/login')
                // User is signed out
                // ...
            }
        });

        firebase.database().ref('menu/').on('value', (snapshot) => {
            let databaseVal = snapshot.val();
            let x = []
            if (databaseVal) {
                let temp = Object.keys(databaseVal);

                for (let i = 0; i < temp.length; i++) {
                    let obj = { ...databaseVal[temp[i]] }
                    obj.id = temp[i]
                    x.push(obj)
                }
                console.log('databaseVal', x)

                setMenulist(x)
            }
        })
    }, [])

    const handleAdd = () => {
        firebase.database().ref('menu').push({
            name: dishname,
            cost: price,
            dishType: dishType,
            menuType: menuType
        })
            .then(res => {
                setDishname('')
                setPrice(0)
                alert('dish added sucessfully')
            })
            .catch(err => {

            })
    }

    const handelDelete = (item) => {
        firebase.database().ref('menu').update({
            [item.id]: null
        })
            .then(res => {
                alert('dish deleted sucessfully')
            })
            .catch(err => {

            })
    }

    const handlePrint = (id) => {
        window.print()
        return false
    };

    const handleLogout = () => {
        firebase.auth().signOut()
            .then(res => {
                history.push('/login')
            })
    }

    return <div >
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
                    <Typography style={{ textAlign: "center", fontFamily: "nunito" }} variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        DASHBOARD
                    </Typography>
                    <IconButton
                        size="large"
                        edge="start"
                        flexGrow= "2"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <RestaurantIcon sx={{ mt: 3, mb: 2 }} onClick={() => history.push('/kitchen')} />
                    </IconButton >
                </Toolbar>
            </AppBar>
        </Box>


        <div style={{ marginTop: 20, display:'flex', justifyContent:'space-around' }}>

            <Button variant="contained" onClick={() => setQRModal(true)}>Generate QR code</Button>
            <Button variant="contained" onClick={() => setAddModal(true)}>Add dish</Button>
          
        </div>

        <br />
        <Divider variant="middle" />
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
          <TableRow>
        <TableCell >  <span>Name</span></TableCell>
        <TableCell > <span>Cost</span></TableCell>
        <TableCell > <span>Menu Type</span></TableCell>
        <TableCell > <span>Dish Type</span></TableCell>
        <TableCell > <span>Delete</span></TableCell>
        </TableRow>
        </TableHead>
       
       
        <TableBody> 
        {menulist.map((item, index) => {
            return  <TableRow
            key={item.name}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
                <TableCell  item> <span>{item.name}</span></TableCell >
                <TableCell  item> <span>Rs.{item.cost}</span></TableCell >
                <TableCell  item><span>{item.menuType}</span></TableCell >
                <TableCell  item><span>{item.dishType}</span></TableCell >
                <TableCell  item> <button onClick={() => handelDelete(item)}
                    style={{ backgroundColor: 'transparent', border: 0, fontSize: 25, color: 'red', cursor: 'pointer' }}>X</button></TableCell>
                    </TableRow>
        
        })}
  </TableBody>
      </Table>
    </TableContainer>


        <Modal
            open={qrModal}
            onClose={() => setQRModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <h2 style={{ fontFamily: 'sora', fontSize: '2rem', textTransform: 'capitalize' }}>Create QR Code</h2>
                <input type='text' placeholder='Enter table no' value={tableNo} onChange={(e) => setTableNo(e.target.value)} />
                < button onClick={() => handlePrint('receipt')}>Print</button>
                <br />
                <Grid container justifyContent='center' alignItems='center'>
                    {/* <iframe id="receipt" title="Receipt" > */}
                    <Paper elevation={8} style={paperStyle} > <QRCode value={tableNo} /></Paper>
                    {/* </iframe> */}
                </Grid>
            </Box>
        </Modal>


        <Modal
            open={addModal}
            onClose={() => setAddModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Grid container spacing={2} direction='column'>
            {/* <div style={{display:'flex', flexDirection:'column'}}> */}
            <Grid item> <label for="Name">Dish Name: </label></Grid>
            <Grid item><input type='text' placeholder='Enter Name Here' value={dishname} onChange={(e) => setDishname(e.target.value)} /></Grid>

            <Grid item><label for="Name">Enter Price: </label></Grid>
            <Grid item><input type='number' placeholder='price' value={price} onChange={(e) => setPrice(e.target.value)} /></Grid>

            <Grid item> <label for="Menu Type" >Select MenuType: </label></Grid>
            <Grid item><select onChange={(e) => setMenuType(e.target.value)}>
                {initMenuType.map((item, index) => {
                    return <option value={item.value}>{item.text}</option>

                })}
            </select></Grid>

            <Grid item> <label for="Dish Type" >DishType: </label></Grid>
            <Grid item><select onChange={(e) => setDishType(e.target.value)}>
                {initDishType.map((item, index) => {
                    return <option value={item.value}>{item.text}</option>

                })}
            </select></Grid>
            <Grid item> <button style={{ backgroundColor: 'green' }} onClick={() => handleAdd()}>Add</button></Grid>
        {/* </div> */}
        </Grid>
            </Box>
        </Modal>

    </div>
}

export default Dashboard