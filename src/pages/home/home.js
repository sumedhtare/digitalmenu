import React ,{useState} from 'react'
import { Link } from "react-router-dom";
import BarcodeScannerComponent from "react-webcam-barcode-scanner";

const Home =()=>{
    const [shouldScan, setShouldScan] = useState(false)
    const [ data, setData ] = React.useState('Not Found');

    const handleData =(data)=>{
        console.log('handleData', data)
        setData(data.text)
        window.push('/menu?q=table&no='+data.text)
    }
    
    return (
        <div>
            <h1>Home page</h1>

           <button onClick={()=>setShouldScan(true)}>Scan Table</button>
            <br/>
            <br/>
            <Link to="/menu?q=home">HomeDelevery</Link>

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
    )

}

export default Home
