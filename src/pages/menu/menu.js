import React, { useEffect, useState } from 'react'
import firebase from "firebase/app";
import "firebase/database";

const Menu = () => {

    const [menulist, setMenulist] = useState([])
    const [myOrders, setMyOrders] = useState([])
const[isModalVisible, setIsModalVisible] = useState(false)
    useEffect(() => {
        firebase.database().ref('menu/').on('value', (snapshot) => {
            let databaseVal = snapshot.val();
            let x = []
            let xObj = {}
            if (databaseVal) {
                let temp = Object.keys(databaseVal);

                for (let i = 0; i < temp.length; i++) {
                    let obj = { ...databaseVal[temp[i]] }
                    obj.id = temp[i]
                    x.push(obj)
                }
                console.log('databaseVal', x)

                for (let i = 0; i < x.length; i++) {
                    let dishType = x[i].dishType //non-veg [0]
                    let menuType = x[i].menuType //starters [0]
                    if (xObj[dishType] === undefined) {
                        xObj[dishType] = {}
                    }
                    if (xObj[dishType][menuType] === undefined) {
                        xObj[dishType][menuType] = [x[i]]
                    }
                    else {
                        xObj[dishType][menuType].push(x[i])
                    }
                }
                console.log('dishType', xObj)

                setMenulist(xObj)
            }
        })
    }, [])

    const handelAdd = (data, myOrders) => {
        let temp = [...myOrders]
        temp.push(data)
        console.log('myOrders', temp)
        setMyOrders(temp)
    }

    return (
        <div style={{ padding: 15 }}>
            <button onClick={()=>setIsModalVisible(true)}>View my cart</button>

            <h1>Menu list</h1>
            {Object.keys(menulist).map((dish, dishIndex) => { //['veg','non-veg']
                return (
                    <div>
                        <h2>{dish}</h2>
                        {Object.keys(menulist[dish]).map((menu, menuIndex) => { //[starters, main_course, deserts]
                            return (
                                <div>
                                    <h3>{menu}</h3>
                                    {menulist[dish][menu].map((item, index) => {
                                        return (<div style={{ display: 'flex', flexDirection: 'row', border: '1px solid grey', borderRadius: 15, margin: '10px 10px 0 10px', padding: 5, justifyContent: 'space-evenly' }}>
                                            <p style={{ backgroundColor: 'red' }}>name: {item.name}</p>
                                            <p>cost: Rs.{item.cost}</p>
                                            <p>Dish Type: {item.dishType}</p>
                                            <p>Menu Type: {item.menuType}</p>
                                            <button onClick={() => handelAdd(item, myOrders)}>Add</button>
                                        </div>)
                                    })}
                                </div>
                            )
                        })}
                    </div>
                )
            })}

<div style={{display:isModalVisible ? 'block' : 'none', width:'100vw', height: '100vh', backgroundColor:'rgba(0,0,0,.9)', position:'absolute', top:0}}>
<div style={{display:'flex', justifyContent:'center'}}>

<button onClick={()=>setIsModalVisible(false)}>Close</button>
{/* add your code here */}
</div>
</div>
        </div>
    )

}

export default Menu