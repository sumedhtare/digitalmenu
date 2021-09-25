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
import {TextField} from '@mui/material';


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

const Dashboard = () => {
    const history = useHistory();
    const [dishname, setDishname] = useState('')
    const [price, setPrice] = useState()
    const [menulist, setMenulist] = useState([])
    const [menuType, setMenuType] = useState(initMenuType[0].value)
    const [dishType, setDishType] = useState(initDishType[0].value)
    const [tableNo, setTableNo] = useState('')
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
                </Toolbar>
            </AppBar>
        </Box>


        <div style={{ marginTop: 20 }}>

        <h2 style={{ fontFamily: 'sora', fontSize: '2rem', textTransform: 'capitalize'}}>Create QR Code</h2>
        <input type='text' placeholder='Enter table no' value={tableNo} onChange={(e) => setTableNo(e.target.value)} />
        < button onClick={() => handlePrint('receipt')}>Print</button>
            <br />
            <Grid container justifyContent='center' alignItems='center'>
            {/* <iframe id="receipt" title="Receipt" > */}
                <Paper elevation={8} style={paperStyle} > <QRCode value={tableNo} /></Paper> 
            {/* </iframe> */}
              </Grid>
        </div>
        <br />
        <Divider variant="middle" />
        <div >
            <label for="Name">Dish Name: </label>
            <input type='text' placeholder='Enter Name Here' value={dishname} onChange={(e) => setDishname(e.target.value)} />

            <label for="Name">Enter Price: </label>
            <input type='number' placeholder='price' value={price} onChange={(e) => setPrice(e.target.value)} />

            <label for="Menu Type" >Select MenuType: </label>
            <select onChange={(e) => setMenuType(e.target.value)}>
                {initMenuType.map((item, index) => {
                    return <option value={item.value}>{item.text}</option>

                })}
            </select>

            <label for="Dish Type" >DishType: </label>
            <select onChange={(e) => setDishType(e.target.value)}>
                {initDishType.map((item, index) => {
                    return <option value={item.value}>{item.text}</option>

                })}
            </select>
            <button style={{ backgroundColor: 'green' }} onClick={() => handleAdd()}>Add</button>
        </div>

        <div >
            <span>Name</span>
            <span>Cost</span>
            <span>Menu Type</span>
            <span>Dish Type</span>
            <span>Delete</span>
        </div>
        <br />

        {menulist.map((item, index) => {
            return <div >
                <span>{item.name}</span>
                <span>Rs.{item.cost}</span>
                <span>{item.menuType}</span>
                <span>{item.dishType}</span>
                <button onClick={() => handelDelete(item)}
                    style={{ backgroundColor: 'transparent', border: 0, fontSize: 25, color: 'red', cursor: 'pointer' }}>X</button>
            </div>

        })}

    </div>
}

export default Dashboard