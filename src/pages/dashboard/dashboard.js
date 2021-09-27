import React, { useEffect, useState } from 'react'
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import "firebase/auth";
import QRCode from "react-qr-code";
import { Grid, Typography, Paper, Avatar, responsiveFontSizes, FormControlLabel, Checkbox } from '@material-ui/core';
import { useHistory, Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import LogoutIcon from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled, alpha } from '@mui/material/styles';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Menu from '@mui/material/Menu';
import AppsIcon from '@mui/icons-material/Apps';
import HomeIcon from '@mui/icons-material/Home';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


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

{/*For dashboard menu*/ }
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
    const [imageAsFile, setImageAsFile] = useState('')

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

            }

            setMenulist(x)
        })
    }, [])

    const handleAdd = () => {
        handleFireBaseUpload(`${dishType}-${menuType}-${dishname}`)
            .then(res => {
                firebase.database().ref('menu').push({
                    name: dishname,
                    cost: price,
                    dishType: dishType,
                    menuType: menuType,
                    image: res
                })
                    .then(res => {
                        setDishname('')
                        setPrice(0)
                        alert('dish added sucessfully')
                    })
                    .catch(err => {

                    })
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

        // Create a reference to the file to delete
        let desertRef = firebase.storage().ref().child(item.image);

        // Delete the file
        desertRef.delete().then(() => {
            // File deleted successfully
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });
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
    {/*For dashboard menu*/ }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const Input = styled('input')({
        display: 'none',
    });

    const handleImageAsFile = (e) => {
        const image = e.target.files[0]
        setImageAsFile(imageFile => (image))
    }

    const handleFireBaseUpload = (dishname) => {
        let promise = new Promise((resolve, reject) => {
            if (imageAsFile === '') {
                console.error(`not an image, the image file is a ${typeof (imageAsFile)}`)
                resolve('no image')
            }
            else {
                firebase.storage().ref(`/images/${dishname}/${imageAsFile.name}`).put(imageAsFile)
                    .then(fireBaseUrl => {
                        resolve(fireBaseUrl._delegate.ref._location.path_)
                    })
                    .catch(err => {
                        reject(err)
                    })
            }
        })

        return promise
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <Typography style={{ textAlign: "center", fontFamily: "nunito" }} variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            DASHBOARD
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
                            <AppsIcon sx={{ mt: 3, mb: 2 }} elevation={5} />
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
                            <MenuItem onClick={() => history.push('/kitchen')} disableRipple>
                                <RestaurantIcon color="primary" />
                                Kitchen
                            </MenuItem>
                            <MenuItem onClick={() => history.push('/menu')} disableRipple>
                                <MenuBookIcon color="primary" />
                                Menu Page
                            </MenuItem>
                            <Divider sx={{ my: 0.5 }} />
                            <MenuItem onClick={() => history.push('/home')} disableRipple>
                                <HomeIcon color="primary" />
                                Home Page
                            </MenuItem>

                        </StyledMenu>
                        {/*...*/}
                    </div>
                </Toolbar>
            </AppBar>
        </Box>


        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-around' }}>

            <Button variant="contained" onClick={() => setQRModal(true)}>Generate QR code</Button>
            <Button variant="contained" onClick={() => setAddModal(true)}>Add dish</Button>

        </div>

        <br />
        <Divider variant="middle" />
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow style={{ backgroundColor: "#1976d2" }}>
                        <TableCell >  <span style={{ fontWeight: "bold", color: "#fff" }}>Name</span></TableCell>
                        <TableCell > <span style={{ fontWeight: "bold", color: "#fff" }}>Cost</span></TableCell>
                        <TableCell > <span style={{ fontWeight: "bold", color: "#fff" }}>Menu Type</span></TableCell>
                        <TableCell > <span style={{ fontWeight: "bold", color: "#fff" }}>Dish Type</span></TableCell>
                        <TableCell > <span style={{ fontWeight: "bold", color: "#fff" }}>Delete</span></TableCell>
                    </TableRow>
                </TableHead>


                <TableBody>
                    {menulist.map((item, index) => {
                        return <TableRow
                            key={item.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell item> <span>{item.name}</span></TableCell >
                            <TableCell item> <span>Rs.{item.cost}</span></TableCell >
                            <TableCell item><span>{item.menuType}</span></TableCell >
                            <TableCell item><span>{item.dishType}</span></TableCell >
                            <TableCell item> <IconButton aria-label="delete" onClick={() => handelDelete(item)}>
                                <DeleteForeverIcon sx={{ color: "red" , fontSize: 30}}/>
                            </IconButton>
                               </TableCell>
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
            <Box sx={style}  >

                <h2 style={{ fontFamily: 'sora', fontSize: '2rem', textTransform: 'capitalize' }}>Create QR Code</h2>
                <div style={{ display: 'flex' }}>
                    <TextField value={tableNo} onChange={(e) => setTableNo(e.target.value)}
                        id="filled-number"
                        label="Table Number"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="filled"
                    />
                    <Button style={{ marginLeft: '1rem' }} variant="contained" onClick={() => handlePrint('receipt')}>Print</Button>
                </div>
                <br />
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
                    <Grid item> <label style={{ fontFamily: 'sora', fontSize: '1rem', textTransform: 'capitalize' }} for="Name">Enter Dish Name: </label></Grid>
                    <Grid item><TextField id="filled-basic" label="Dish Name" variant="filled" value={dishname} onChange={(e) => setDishname(e.target.value)} /></Grid>

                    <Grid item><label style={{ fontFamily: 'sora', fontSize: '1rem', textTransform: 'capitalize' }} for="Name">Enter Price: </label></Grid>
                    <Grid item>   <TextField value={price} onChange={(e) => setPrice(e.target.value)} id="filled-number" label="Enter Cost" type="number" InputLabelProps={{ shrink: true, }} variant="filled" /></Grid>

                    <Grid item> <label style={{ fontFamily: 'sora', fontSize: '1rem', textTransform: 'capitalize' }} for="Menu Type" >Select MenuType: </label></Grid>
                    <Grid item><select style={{ width: '20%', height: '3vh' }} onChange={(e) => setMenuType(e.target.value)}>
                        {initMenuType.map((item, index) => {
                            return <option value={item.value}>{item.text}</option>

                        })}
                    </select></Grid>

                    <Grid item> <label for="Dish Type" style={{ fontFamily: 'sora', fontSize: '1rem', textTransform: 'capitalize' }} for="Menu Type">DishType: </label></Grid>
                    <Grid item><select style={{ width: '20%', height: '3vh' }} onChange={(e) => setDishType(e.target.value)}>
                        {initDishType.map((item, index) => {
                            return <option value={item.value}>{item.text}</option>

                        })}
                    </select></Grid>
                    <Grid item>
                        <label style={{ fontFamily: 'sora', fontSize: '1rem', textTransform: 'capitalize' }} >Upload photo for dish:   </label>
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={handleImageAsFile} />
                            <Button endIcon={<PhotoCamera />} variant="contained" component="span">
                                Upload
                            </Button>
                        </label>

                    </Grid>
                    <Grid item> <Button style={{ width: '30%' }} variant="contained" onClick={() => handleAdd()}>ADD</Button> </Grid>
                    {/* </div> */}
                </Grid>
            </Box>
        </Modal>

    </div>
}

export default Dashboard