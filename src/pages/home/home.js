import React, { useState } from 'react'
import { Link } from "react-router-dom";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";
import { useHistory } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Front from '../frront'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Grid } from '@material-ui/core';
import img from '../../assets/scanner.jpeg';
import image from '../../assets/delivery.jpeg';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Home = () => {
  const [shouldScan, setShouldScan] = useState(false)
  const [data, setData] = React.useState('Not Found');
  const history = useHistory()
  const handleData = (data) => {
    console.log('handleData', data)
    setData(data.text)
    history.push('/menu?q=table&no=' + data.text)
  }

  return (
    <div style={{backgroundImage: `url(${process.env.PUBLIC_URL + "/assets/frontback.jpeg"})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'}} >
      <Front />
      <div id="place-to-visit" style={{padding:'20px 0 20px 0'}}>
        <Grid container spacing={2}  justifyContent='center' alignItems='center'>
        {/* <h1>Home page</h1> */}
        <Grid item xs={12} sm={6} md={4} justifyContent='center' style={{display:'flex'}}>
        <Card >
          <CardMedia
            component="img"
            alt="Dine in"
            height="140"
            image={img}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Scan table
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hello!! No need to go to the counter. Order your food by scanning the QR code on the table. Have a great day!!
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={() => setShouldScan(true)} size="small">Scan Table</Button>
          </CardActions>
        </Card>
        </Grid>
       
        <Grid item xs={12} md={4} sm={6} justifyContent='center' style={{display:'flex'}}>
        <Card >
          <CardMedia
            component="img"
            alt="Dine in"
            height="140"
            image={image}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Delivery
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hello! For "Home Delivery" click the below button and enjoy the delicious food at your own place. Have a great day!!
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={() => history.push('/menu?q=home')} size="small">Home Delivery</Button>
          </CardActions>
        </Card>
        </Grid>
        </Grid>
      </div>

      <Modal
        open={shouldScan}
        onClose={() => setShouldScan(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <BarcodeScannerComponent
            width={300}
            height={300}
            onUpdate={(err, result) => {
              if (result) handleData(result)
            }}
          />
          <h3>{data}</h3>
        </Box>

      </Modal>
    </div>
  )

}

export default Home
