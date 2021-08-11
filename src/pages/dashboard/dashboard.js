import React, { useEffect, useState } from 'react'
import firebase from "firebase/app";
import "firebase/database";

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

    return <div>
        <h1>Dashboard</h1>
        <input type='text' placeholder='Dish name' value={dishname} onChange={(e) => setDishname(e.target.value)} />
        <input type='number' placeholder='price' value={price} onChange={(e) => setPrice(e.target.value)} />

        <select onChange={(e) => setMenuType(e.target.value)}>
            {initMenuType.map((item, index) => {
                return <option value={item.value}>{item.text}</option>

            })}
        </select>

        <select onChange={(e) => setDishType(e.target.value)}>
            {initDishType.map((item, index) => {
                return <option value={item.value}>{item.text}</option>

            })}
        </select>

        <button onClick={() => handleAdd()}>Add</button>

        <br />

        {menulist.map((item, index) => {
            return <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <p style={{backgroundColor:'red'}}>name: {item.name}</p>
                <p>cost: {item.cost}</p>
                <p>Dish Type: {item.dishType}</p>
                <p>Menu Type: {item.menuType}</p>

                <button onClick={() => handelDelete(item)} 
                style={{backgroundColor:'transparent', border:0, fontSize:25, color:'red', cursor:'pointer'}}>X</button>
            </div>
        })}
    </div>
}

export default Dashboard