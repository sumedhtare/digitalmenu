import React, { useEffect, useState } from 'react'
import firebase from "firebase/app";
import "firebase/database";
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { useHistory } from "react-router-dom";
import styledComp from 'styled-components';
import DeleteIcon from '@mui/icons-material/Delete';
const drawerWidth = 240;

const Cart = styledComp.div`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
width: 500px;
background-color: #fff;
border: 2px solid #000;
box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
padding: 32px;
@media screen and (max-width: 1024px) {
    width: 300px;
   }
`

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);


const Menu = () => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const history = useHistory();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const [menulist, setMenulist] = useState([])
    const [myOrders, setMyOrders] = useState({})
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isHome, setIsHome] = useState(false)
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [number, setNumber] = useState('')
    const [filter, setFilter] = useState('')

    useEffect(() => {
        firebase.database().ref('menu/').on('value', (snapshot) => {
            let databaseVal = snapshot.val();
            let x = []
            let xObj = {}
            if (databaseVal) {
                let temp = Object.keys(databaseVal);

                for (let i = 0; i < temp.length; i++) {
                    let obj = { ...databaseVal[temp[i]] }
                    obj.id = temp[i]
                    x.push(obj)
                }

                for (let i = 0; i < x.length; i++) {
                    let dishType = x[i].dishType //non-veg [0]
                    let menuType = x[i].menuType //starters [0]
                    if (xObj[dishType] === undefined) {
                        xObj[dishType] = {}
                    }
                    if (xObj[dishType][menuType] === undefined) {
                        xObj[dishType][menuType] = [x[i]]
                    }
                    else {
                        xObj[dishType][menuType].push(x[i])
                    }
                }

                setMenulist(xObj)
            }
        })

        // console.log('dishType', x.q)
        let x = qryStrToObj();
        if (x.q === 'home') {
            setIsHome(true)
        }
        else {
            setIsHome(false)

        }

    }, [])

    const qryStrToObj = () => {
        let str = window.location.search.substring(1)
        let qryParams = str.split('&')
        let obj = {}
        for (let i = 0; i < qryParams.length; i++) {
            let key = qryParams[i].split('=')[0]
            let val = qryParams[i].split('=')[1]
            obj[key] = val
        }
        return obj
    }


    const handelAdd = (data, myOrders) => {
        let temp = { ...myOrders }
        temp[data.id] = data

        if (temp[data.id].count === undefined) {
            temp[data.id].count = 1
        }
        else {
            temp[data.id].count = temp[data.id].count + 1
        }
        console.log('temp', temp)
        setMyOrders(temp)
    }

    const objectToArray = (obj) => {
        let x = Object.keys(obj)
        let tempArr = []
        for (let i = 0; i < x.length; i++) {
            tempArr.push(obj[x[i]])
        }
        return tempArr
    }

    const handelDelete = (data) => {
        let temp = { ...myOrders }
        if (data.count > 1) {
            temp[data.id].count = temp[data.id].count - 1
        }
        else {
            delete temp[data.id]
        }
        setMyOrders(temp)
    }

    const calculateTotal = (myOrders) => {
        let x = objectToArray(myOrders)
        let total = 0
        for (let i = 0; i < x.length; i++) {
            total = total + x[i].count * parseInt(x[i].cost)
        }
        return total
    }

    const sendOrderFromTable = (myOrders) => {
        let x = qryStrToObj();
        firebase.database().ref('orders/table').update({
            [x.no]: myOrders
        })
            .then(res => {
                alert('your order has been placed. Thank You.')
                setIsModalVisible(false)
                setMyOrders({})
            })
    }

    const sendOrderFromHome = (myOrders) => {
        let tempObj = { ...myOrders }
        tempObj.customer = { name, address, number }
        firebase.database().ref('orders/home').push(tempObj)
            .then(res => {

                alert('your order has been placed. Thank You.')
                setName('');
                setAddress('');
                setNumber('');
                setIsModalVisible(false)
                setMyOrders({})
            })
    }

    const containsText = (text) => { //"sumedh"
        text = text.split('') //['s'.'u','m',....]
        for (let i = 0; i < text.length; i++) {
            if (!isNaN(text[i])) {
                return true
            }
        }
        return false
    }

    const checkValidNumber = (text) => {
        if (isNaN(text)) return false
        text = text.split('')
        console.log('text', text)
        if (text.length === 10) return true
        return false
    }

    const handelSubmitOrder = (myOrders) => {
        if (calculateTotal(myOrders) > 0) {
            if (!isHome) {
                sendOrderFromTable(myOrders)
            }
            else {
                if (name !== '' && number !== '' && address !== '') {
                    // alert('your order has been placed. Thank You.')
                    if (containsText(name)) {
                        alert('name cannot contain number')
                    }
                    else if (!checkValidNumber(number)) {
                        alert('invalid number')
                    }
                    else {
                        sendOrderFromHome(myOrders)
                    }
                }
                else {
                    alert('Please fill the required info properly')
                }
            }
        }
        else {
            alert('Please add dish to your order list')
        }
    }

    const capitalizeFirstLetter = (string) => {
        let x = string.charAt(0).toUpperCase() + string.slice(1);
        x = x.replace('_', ' ')
        return x
    }


    return (

        <div>

            <Box sx={{ display: 'flex' }}>

                <CssBaseline />
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography style={{ textAlign: "center", fontFamily: "nunito" }} variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            Menu Card
                        </Typography>

                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <ShoppingCartIcon onClick={() => setIsModalVisible(!isModalVisible)} />
                        </IconButton>

                    </Toolbar>
                </AppBar>


                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {['Home Page'].map((text, index) => (
                            <ListItem button key={text} onClick={() => history.push(text.toLowerCase())}>
                                <ListItemIcon >
                                    <ArrowBackIosNewIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {['VEG', 'NON-VEG'].map((text, index) => (
                            <ListItem button key={text} onClick={() => {
                                if (filter === text.toLowerCase()) {
                                    setFilter('')
                                } else {
                                    setFilter(text.toLowerCase())
                                }
                            }}>
                                <ListItemIcon>
                                    {index % 2 === 0 ? <RestaurantMenuIcon color="success" /> : <RestaurantMenuIcon sx={{ color: '#b91616 ' }} />}

                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {['Dashboard', 'Kitchen'].map((text, index) => (
                            <ListItem button key={text} onClick={() => history.push(text.toLowerCase())}>
                                <ListItemIcon >
                                    {index % 2 === 0 ? <DashboardCustomizeIcon color="primary" /> : <RestaurantIcon color="primary" />}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>



                <div style={{ margin: 40 }}>
                    {/*<button onClick={() => setIsModalVisible(true)}>View my cart</button>*/}

                    { /*<h1>Menu list</h1>*/}
                    {Object.keys(menulist).map((dish, dishIndex) => { //['veg','non-veg']
                        if (filter === dish || filter === '') {
                            return (
                                <div>
                                    <h2 style={{ fontFamily: 'sora', fontSize: '2rem', textTransform: 'capitalize', color: dish === 'veg' ? 'green' : 'red' }}>{dish}</h2>
                                    <Divider variant="middle" />
                                    {Object.keys(menulist[dish]).map((menu, menuIndex) => { //[starters, main_course, deserts]
                                        return (
                                            <div>
                                                <h3>{capitalizeFirstLetter(menu)}</h3>
                                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                    {menulist[dish][menu].map((item, index) => {
                                                        return <RenderMenu item={item} myOrders={myOrders} handelAdd={handelAdd} />
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }
                    })}

                    {/* </div> */}

                </div>

            </Box>


            <Modal
                open={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {/* <div style={{ display: isModalVisible ? 'block' : 'none', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,.9)', position: 'absolute', top: 0, margin: '100' }}> */}
                <Cart>

                    {/* <button onClick={() => setIsModalVisible(false)} style={{ width: 100 }}>Close</button> */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Grid item xs={3}><h5>Dish</h5></Grid>
                            <Grid item xs={3}><h5>Count</h5></Grid>
                            <Grid item xs={3}><h5>Cost</h5></Grid>
                            <Grid item xs={3}><h5>Remove</h5></Grid>
                        </div>
                        {objectToArray(myOrders).map((item, index) => {
                            return (
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Grid item xs={3}><h5>{item.name}</h5></Grid>
                                    <Grid item xs={3}><h5>{item.count}</h5></Grid>
                                    <Grid item xs={3}><h5>{parseInt(item.cost) * item.count}</h5></Grid>
                                    <Grid item xs={3}> <Button startIcon={<DeleteIcon />} variant="contained" onClick={() => handelDelete(item)}>Delete</Button></Grid>
                                </div>
                            )
                        })}

                        <h4 >Total: {calculateTotal(myOrders)}</h4>

                        {isHome && <div style={{ marginTop: 20, }}>
                            <h4>Please provide required info</h4>
                            <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                            <br />
                            <input type='text' placeholder='Address' style={{ width: '100%' }} value={address} onChange={(e) => setAddress(e.target.value)} />
                            <br />
                            <input type='text' placeholder='Contact no' value={number} onChange={(e) => setNumber(e.target.value)} />
                        </div>}
                        <Button style={{ marginTop: 50 }} variant="contained" onClick={() => handelSubmitOrder(myOrders)}>Place Order</Button>

                    </div>
                </Cart>
            </Modal>
        </div>

    )

}

export default Menu


const RenderMenu = ({ item, myOrders, handelAdd }) => {
    const [imageurl, setImageurl] = useState('')
    useEffect(()=>{
        if(item.image !== undefined){

            firebase.storage().ref().child(item.image).getDownloadURL()
            .then(res=>{
                console.log('image url', res)
                setImageurl(res)
            })
        }
    },[item])

    return <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid grey', borderRadius: 15, margin: '10px 10px 0 10px', padding: 5, justifyContent: 'space-evenly', width: '300px', fontFamily: 'sora' }}>
        {imageurl !== '' && <img src={imageurl} alt='no url' style={{width:'100%',height:"50%",borderRadius: 15,}}/>}
        <p><strong>Name:</strong> {item.name}</p>
        <p><strong>Cost:</strong> Rs.{item.cost}</p>
        <p><strong>Dish Type: </strong>{item.dishType}</p>
        <p><strong>Menu Type: </strong>{item.menuType}</p>
        <Button variant="contained" onClick={() => handelAdd(item, myOrders)}>Add</Button>

        {/*  <button onClick={() => handelAdd(item, myOrders)}>Add</button>*/}
    </div>
}