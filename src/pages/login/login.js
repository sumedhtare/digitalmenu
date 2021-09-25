import React from 'react'
import { Grid, Typography, Button, Paper, Avatar, responsiveFontSizes, Link,MenuIcon, TextField,FormControlLabel, Checkbox} from '@material-ui/core';
import LockIcon from '@mui/icons-material/Lock';

const Login = () => {

    const paperStyle = { padding: 20, height: "90vh", width: 400, margin: "175px 75px" }
    const avatarStyle = { backgroundColor: "#14529e" }

    return (<Grid container style={{ minHeight: "100vh" }}>

        <Grid item>
            <img src="https://images.pexels.com/photos/1819669/pexels-photo-1819669.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                style={{ width: "90%", height: "100%", objectFit: "cover" }}
            />
        </Grid>

        <Paper elevation={20} style={paperStyle} >
            <Grid align="center">
                <Avatar style={avatarStyle}><LockIcon /></Avatar>
                <h1 style={{fontFamily: "Vollkorn", fontSize: 40}}>Sign In</h1>
            </Grid>
            <TextField label="Username" placeholder="Enter Username" fullWidth required />
            <TextField label="Password" placeholder="Password" fullWidth required />
            <br/>
            <br/>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <br/><br/>
            <Button
              type="submit"
              fullWidth
              color="primary"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >

              Sign In
            </Button> <br/><br/>
                <Typography>
             
                <Link href="#" >
                  Forgot password?
                </Link>
                </Typography>
                <Typography >  Don't have an account? 
                <Link href="#" variant="body2" >
                  {"Sign Up"}
                </Link>
            </Typography>
           
        </Paper>
    </Grid>
    );
}

export default Login