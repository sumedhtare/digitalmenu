import React,{useState, useEffect} from 'react'
import firebase from "firebase/app";
import "firebase/database";

const Kitchen =()=>{ 
  const [ data, setData ] = useState({home:[],table:[]});
 
  useEffect(()=>{
    firebase.database().ref('orders/').on('value', (snapshot) => {
      let databaseVal = snapshot.val();
      let tempData = {...data}
      if(databaseVal.table != undefined){
        let tables = Object.keys(databaseVal.table);
        let tempTable =[]
        for(let i=0; i<tables.length; i++){
          let x = databaseVal.table[tables[i]]
          x.id = tables[i]
          tempTable.push(x)
        }
        tempData.table = tempTable
      }
      if(databaseVal.home != undefined){
        let tables = Object.keys(databaseVal.home);
        let tempTable =[]
        for(let i=0; i<tables.length; i++){
          tempTable.push(databaseVal.home[tables[i]])
        }
        tempData.home = tempTable
      }
      setData(tempData)
      console.log('tempData',tempData)
  })
}, [])

  return (
   <div>
     <h1>Kitchen</h1>
     <h3>Home delivery</h3>
     {data.home.map((item,index)=>{
     return <p>From: {item.customer.name}</p>
     })}

<h3>From Table</h3>
     {data.table.map((item,index)=>{
      return <p>Table no: {item.id}</p>
     })}
   </div>
  )
}

export default Kitchen