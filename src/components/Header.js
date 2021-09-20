import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Menu, MenuItem, Toolbar, Typography, Button, IconButton} from '@material-ui/core/';
import MenuIcon from '@material-ui/icons/Menu';
import {useHistory} from 'react-router-dom'


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function Header({ resName }) {
    const history = useHistory()
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                            <MenuIcon />
                            {/* Open Menu */}
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            style={{transformOrigin:'bottom'}}
                        >
                            <MenuItem onClick={()=> history.push('/dashboard')}>Dashboard</MenuItem>
                            <MenuItem onClick={()=> history.push('/kitchen')}>Kitchen</MenuItem>
                            <MenuItem onClick={handleClose}>Logout</MenuItem>
                        </Menu>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {resName}
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}
