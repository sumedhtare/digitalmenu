import React, { useEffect, useState } from 'react'
import firebase from "firebase/app";
import "firebase/database";

const Menu = () => {

    const [menulist, setMenulist] = useState([])
    const [myOrders, setMyOrders] = useState({})
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isHome, setIsHome] = useState(false)
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [number, setNumber] = useState('')

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

                setMenulist(xObj)
            }
        })

        // console.log('dishType', x.q)
        let x = qryStrToObj();
        if(x.q === 'home'){
            setIsHome(true)
        }
        else{
            setIsHome(false)

        }

    }, [])

    const qryStrToObj=()=>{
        let str = window.location.search.substring(1)
       let qryParams = str.split('&')
       let obj ={}
       for(let i=0; i<qryParams.length; i++){
           let key = qryParams[i].split('=')[0]
           let val = qryParams[i].split('=')[1]
           obj[key] = val
       }
       return obj
    }
   

    const handelAdd = (data, myOrders) => {
        let temp = {...myOrders}
        temp[data.id] = data
        
        if(temp[data.id].count === undefined){
            temp[data.id].count = 1
        }
        else{
            temp[data.id].count = temp[data.id].count + 1
        }
        console.log('temp',temp)
        setMyOrders(temp)
    }

    const objectToArray=(obj)=>{
        let x = Object.keys(obj)
        let tempArr = []
        for(let i=0; i<x.length; i++){
            tempArr.push(obj[ x[i] ])
        }
        return tempArr
    }

    const handelDelete =(data)=>{
        let temp = {...myOrders}
        if(data.count > 1){
            temp[data.id].count = temp[data.id].count - 1
        }
        else{
            delete temp[data.id]
        }
        setMyOrders(temp)
    }

    const calculateTotal =(myOrders)=>{
        let x = objectToArray(myOrders)
        let total = 0
        for(let i=0; i<x.length; i++){
            total = total + x[i].count * parseInt(x[i].cost)
        }
        return total
    }

    const sendOrderFromTable=(myOrders)=>{
        let x = qryStrToObj();
        firebase.database().ref('orders/table').update({
            [x.no]:myOrders
        })
        .then(res =>{
            alert('your order has been placed. Thank You.')
        })
    }

    const sendOrderFromHome=(myOrders)=>{
        let tempObj ={...myOrders}
        tempObj.customer = {name,address,number}
        firebase.database().ref('orders/home').push(tempObj)
        .then(res =>{
            alert('your order has been placed. Thank You.')
        })
    }
    
    const handelSubmitOrder =(myOrders)=>{
        if(calculateTotal(myOrders) > 0){
        if(!isHome){
            sendOrderFromTable(myOrders)
        }
        else{
            if(name !== '' && number !== '' && address !== ''){
                // alert('your order has been placed. Thank You.')
                sendOrderFromHome(myOrders)
            }
            else{
                alert('Please fill the required info properly')
            }
        }
    }
    else{
        alert('Please add dish to your order list') 
    }
    }



    return (
        <div style={{ padding: 15 }}>
            <button onClick={() => setIsModalVisible(true)}>View my cart</button>

            <h1>Menu list</h1>
            {Object.keys(menulist).map((dish, dishIndex) => { //['veg','non-veg']
                return (
                    <div>
                        <h2>{dish}</h2>
                        {Object.keys(menulist[dish]).map((menu, menuIndex) => { //[starters, main_course, deserts]
                            return (
                                <div>
                                    <h3>{menu}</h3>
                                    <div style={{display:'flex', flexWrap:'wrap'}}>
                                    {menulist[dish][menu].map((item, index) => {
                                        return (<div style={{ display: 'flex', flexDirection: 'column', border: '1px solid grey', borderRadius: 15, margin: '10px 10px 0 10px', padding: 5, justifyContent: 'space-evenly', width:'300px' }}>
                                            <p style={{ backgroundColor: 'red' }}>name: {item.name}</p>
                                            <p>cost: Rs.{item.cost}</p>
                                            <p>Dish Type: {item.dishType}</p>
                                            <p>Menu Type: {item.menuType}</p>
                                            <button onClick={() => handelAdd(item, myOrders)}>Add</button>
                                        </div>)
                                    })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            })}

            <div style={{ display: isModalVisible ? 'block' : 'none', width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,.9)', position: 'absolute', top: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection:'column', alignItems:'center' }}>

                    <button onClick={() => setIsModalVisible(false)} style={{width:100}}>Close</button>
                    <div style={{width:'50%'}}>
                    {objectToArray(myOrders).map((item,index)=>{
                        return (
                            <div style={{display:'flex', flexDirection:'row',margin:'10px, 10px, 0, 10px', color:'#FFF', justifyContent:'space-between'}}>
                                <h5>{item.name}</h5>
                                <h5>{item.count}</h5>
                                <h5>{parseInt(item.cost)*item.count}</h5>
                                <button onClick={()=>handelDelete(item)}>Delete</button>
                                </div>
                        )
                    })}

                    <h4 style={{color:'#FFF'}}>Total: {calculateTotal(myOrders)}</h4>

                    {isHome && <div style={{marginTop:20, color:'#FFF'}}>
                        <h4>Please provide required info</h4>
                        <input type='text' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)}/>
                        <br/>
                        <input type='text' placeholder='Address' style={{width:'100%'}}  value={address} onChange={(e) => setAddress(e.target.value)}/>
                        <br/>
                        <input type='text' placeholder='Contact no'  value={number} onChange={(e) => setNumber(e.target.value)}/>
                    </div>}

                    <button style={{marginTop:50}} onClick={()=>handelSubmitOrder(myOrders)}>Place order</button>

                     </div>
                </div>
            </div>

        </div>
    )

}

export default Menu