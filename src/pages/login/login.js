import React from 'react'
import { Grid, Typography,Button } from '@material-ui/core';

const Login = ()=>{

    return <Grid container justifyContent='center' alignItems='center'>
            <input type='text' placeholder='Username'/>
            <input type='password' placeholder='Password'/>
            <Button variant="contained">Login</Button>
    </Grid>
}

export default Login