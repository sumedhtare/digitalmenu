import React ,{useState} from 'react'
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
const Home =()=>{
    const [shouldScan, setShouldScan] = useState(false)
    const [ data, setData ] = React.useState('Not Found');
    const history = useHistory()

    const handleData =(data)=>{
        console.log('handleData', data)
        setData(data.text)
        history.push('/menu?q=table&no='+data.text)
    }

    return (
        <div>
           <Front />
           <div id="place-to-visit" style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly', margin:'100px 0 100px 0'}}>
           {/* <h1>Home page</h1> */}
     <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="Dine in"
        height="140"
        image="../../assets/scanner.jpeg"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Scan table
        </Typography>
        <Typography variant="body2" color="text.secondary">
        You can dine in by scanning.................
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={()=>setShouldScan(true)} size="small">Scan Table</Button>
      </CardActions>
    </Card>

            <br/>
            <br/>
            <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="Dine in"
        height="140"
        image="../../assets/scanner.jpeg"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
         Deliverry
        </Typography>
        <Typography variant="body2" color="text.secondary">
        You can order for delivery....................
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={()=>history.push('/menu?q=home')} size="small">Home Delivery</Button>
      </CardActions>
    </Card>

            {shouldScan && <div>
             <BarcodeScannerComponent
             width={300}
             height={300}
             onUpdate={(err, result) => {
               if (result) handleData(result)
             }}
           />
           <h3>{data}</h3>
           </div>} 
           </div>
        </div>
    )

}

export default Home
