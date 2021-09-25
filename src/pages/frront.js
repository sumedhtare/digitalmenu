import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar,Collapse, CssBaseline, IconButton, Toolbar } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { color, textAlign } from '@mui/system';
const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        backgroundImage: `url(${process.env.PUBLIC_URL + "/assets/frontback.jpeg"})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
    },
    main:{
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Nunito',

    },
    appbar: {
        background: 'transparent',
        boxShadow: 'none',
        fontFamily: "Nunito",
    },
    icon: {
        color: 'black',
        fontSize: "15rem",

    },
    appbarTitle: {
        flexGrow: "1",
        color: "#fff",  
    },
    container: {
        textAlign: 'center',
        fontSize:"2.5rem"
      },

    appbarWrapper: {
        width: '80%',
        margin: '0 auto',
    },
    colorText: {
        color: "#f62626",
    },
    goDown:{
        color: "#f62626",
        fontSize:"4rem",
     
    },



}));
export default function Front() {
    const classes = useStyles();

    return (
        <div  className={classes.root}>
                <CssBaseline />
            <div className={classes.main}>
                <AppBar color="transparent" className={classes.appbar} elevation={0}>
                    <Toolbar className={classes.appbarWrapper}>
                        <h1 className={classes.appbarTitle}>Dine <span className={classes.colorText}>In.</span></h1>
                        <IconButton>
                            <SortIcon className={classes.icon} />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Collapse in={true} {...(true? {timeout:1000}:{})} collapsedHeight={50}>
                <div className={classes.container}>
                    <h1 style={{textAlign:"center"}}>
                       <span  className={classes.appbarTitle}> Welcome to <br/>DINE </span><span className={classes.colorText}> In.</span>
                    </h1>
                    <IconButton sx={{ fontSize: 40 }}> 
                    <ExpandMoreIcon  className={classes.goDown} />
                    </IconButton>
                </div>
                </Collapse>
            </div>
        </div>

    );
}