import React,{useEffect, useState} from 'react'
import firebase from "firebase/app";
import "firebase/database";

const Dashboard = ()=>{

    const [dishname, setDishname] = useState('')
    const [price, setPrice] = useState(0)
    const [menulist, setMenulist] = useState({starters:[]})

    useEffect(()=>{
        firebase.database().ref('menu/').on('value', (snapshot)=>{
            let databaseVal = snapshot.val();
            let x = []

           let temp = Object.keys(databaseVal.starters);

           for(let i=0; i<temp.length; i++){
               let obj = {}
               obj.id = temp[i]
               obj.name = databaseVal.starters[temp[i]].name
               obj.cost = databaseVal.starters[temp[i]].cost
               x.push(obj)
           }
           console.log('databaseVal',x)

            setMenulist({starters:x})
          })
    },[])

    const handleAdd =()=>{
        firebase.database().ref('menu/starters').push({
            name: dishname,
            cost: price
        })
        .then(res=>{
            setDishname('')
            setPrice(0)
            alert('dish added sucessfully')
        })
        .catch(err=>{

        })
    }

    const handelDelete =(item)=>{
        firebase.database().ref('menu/starters').update({
           [item.id]: null
        })
        .then(res=>{
            alert('dish deleted sucessfully')
        })
        .catch(err=>{

        })
    }

    return <div>
        <h1>Dashboard</h1>
        <input type='text' placeholder='Dish name' value={dishname} onChange={(e)=>setDishname(e.target.value)}/>
        <input type='number' placeholder='price' value={price} onChange={(e)=>setPrice(e.target.value)}/>
        <button onClick={()=>handleAdd()}>Add</button>
        
        <br/>

        {menulist.starters.map((item,index)=>{
            return <div>
                <p>name: {item.name}   cost: {item.cost}</p> 
                <button onClick={()=>handelDelete(item)}>Delete</button>
                </div>
        })}
    </div>
}

export default Dashboard