import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import useWindowPosition from '../hook/useWindowPosition';



const placeToVisit= ()=> {
    const classes = UseStyles();

//   const checked = useWindowPosition('header');
  return (
    <div className={classes.root} id="place-to-visit">
      {/* <ImageCard place={places[1]} checked={checked} />
      <ImageCard place={places[0]} checked={checked} /> */}
    </div>
  );
}

export default placeToVisit


const UseStyles = makeStyles((theme) => ({
    root: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
      },
    },
  }));