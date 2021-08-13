import React, { useEffect, useState } from 'react'
import firebase from "firebase/app";
import "firebase/database";
import './dashboard.css';
import QRCode from "react-qr-code";
import { Link } from 'react-router-dom';

const initMenuType = [
    {
        value: 'starters',
        text: 'starters'
    },
    {
        value: 'main_course',
        text: 'main_course'
    },
    {
        value: 'deserts',
        text: 'deserts'
    }
]

const initDishType = [
    {
        value: 'veg',
        text: 'veg'
    },
    {
        value: 'non-veg',
        text: 'non-veg'
    }
]

const Dashboard = () => {

    const [dishname, setDishname] = useState('')
    const [price, setPrice] = useState()
    const [menulist, setMenulist] = useState([])
    const [menuType, setMenuType] = useState(initMenuType[0].value)
    const [dishType, setDishType] = useState(initDishType[0].value)
    const [tableNo, setTableNo] = useState('')
    useEffect(() => {
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

                setMenulist(x)
            }
        })
    }, [])

    const handleAdd = () => {
        firebase.database().ref('menu').push({
            name: dishname,
            cost: price,
            dishType: dishType,
            menuType: menuType
        })
            .then(res => {
                setDishname('')
                setPrice(0)
                alert('dish added sucessfully')
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
    }

    const handlePrint = (id) => {
      window.print()
      return false
      };

    return <div class="container" >
        <div>
            <h2 class="title">DashBoard</h2>
        </div>

        <div style={{ marginTop: 20 }}>
            {/* <iframe id="receipt" title="Receipt" > */}
                <QRCode value={tableNo} />
            {/* </iframe> */}
            <br />
            <input type='text' placeholder='Enter table no' value={tableNo} onChange={(e) => setTableNo(e.target.value)} />
            <button onClick={()=>handlePrint('receipt')}>Print</button>
        </div>

        <div class="container responsive">
            <div class="col-12 padding margin border-box">
                <div class="col-4">
                    <label for="Name">Dish Name: </label>
                    <input type='text' placeholder='Enter Name Here' value={dishname} onChange={(e) => setDishname(e.target.value)} />
                </div>
                <div class="col-3">
                    <label for="Name">Enter Price: </label>
                    <input type='number' placeholder='price' value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div class="col-2">
                    <label for="Menu Type" >Select MenuType: </label>
                    <select onChange={(e) => setMenuType(e.target.value)}>
                        {initMenuType.map((item, index) => {
                            return <option value={item.value}>{item.text}</option>

                        })}
                    </select>
                </div>
                <div class="col-2">
                    <label for="Dish Type" >DishType: </label>
                    <select onChange={(e) => setDishType(e.target.value)}>
                        {initDishType.map((item, index) => {
                            return <option value={item.value}>{item.text}</option>

                        })}
                    </select>
                </div>
                <div class="col-1">
                    <button style={{ backgroundColor: 'green' }} onClick={() => handleAdd()}>Add</button>
                </div>
            </div>
        </div>

        <div class="container responsive">
            <div class="row">
                <div class="container col-12">
                    <div class="col-4">
                        <span>Name</span>
                    </div>
                    <div class="col-2">
                        <span>Cost</span>
                    </div>
                    <div class="col-2">
                        <span>Menu Type</span>
                    </div>
                    <div class="col-2">
                        <span>Dish Type</span>
                    </div>
                    <div class="col-2">
                        <span>Delete</span>
                    </div>
                </div>
            </div>
        </div>
        <br />

        {menulist.map((item, index) => {
            return <div class="container responsive">
                <div class="row">

                    <div class="col-4">
                        <span>{item.name}</span>
                    </div>
                    <div class="col-2">
                        <span>Rs.{item.cost}</span>
                    </div>


                    <div class="col-2">
                        <span>{item.menuType}</span>
                    </div>
                    <div class="col-2">
                        <div class="dish">
                            <span>{item.dishType}</span>
                        </div>
                    </div>
                    <div class="col-2">
                        <button onClick={() => handelDelete(item)}
                            style={{ backgroundColor: 'transparent', border: 0, fontSize: 25, color: 'red', cursor: 'pointer' }}>X</button>
                    </div>

                </div>
            </div>

        })}

    </div>
}

export default Dashboard