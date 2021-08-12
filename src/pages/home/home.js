import React from 'react'
import { Link } from "react-router-dom";

const Home =()=>{

    return (
        <div>
            <h1>Home page</h1>

            <Link to="/menu?q=tabel&n=4">Scan Table</Link>
            <br/>
            <br/>
            <Link to="/menu?q=home">HomeDelevery</Link>
        </div>
    )

}

export default Home
