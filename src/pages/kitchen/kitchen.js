import React, { useState, useEffect } from 'react'
import firebase from "firebase/app";
import "firebase/database";
import { Grid, Typography,Button } from '@material-ui/core';
import { ModalContainer } from './kitchen.style';
import {objToArr} from '../../functions/utils'
const Kitchen = () => {
  const [data, setData] = useState({ home: [], table: [] });

  useEffect(() => {
    firebase.database().ref('orders/').on('value', (snapshot) => {
      let databaseVal = snapshot.val();
      let tempData = { ...data }
      if (databaseVal.table != undefined) {
        let tables = Object.keys(databaseVal.table);
        let tempTable = []
        for (let i = 0; i < tables.length; i++) {
          let x = databaseVal.table[tables[i]]
          x.id = tables[i]
          tempTable.push(x)
        }
        tempData.table = tempTable
      }
      if (databaseVal.home != undefined) {
        let tables = Object.keys(databaseVal.home);
        let tempTable = []
        for (let i = 0; i < tables.length; i++) {
          let x = databaseVal.home[tables[i]]
          x.id = tables[i]
          tempTable.push(x)
        }
        tempData.home = tempTable
      }
      setData(tempData)
      console.log('tempData', tempData)
    })
  }, [])

  return (<div style={{ padding: 20 }}>
    <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start">
      <h1>Kitchen</h1>
      <h3>Home delivery ({data.home?.length})</h3>

      <Grid spacing={2} xs={12} container direction='row'>
        {data.home.map((item, index) => {
          return <Grid item xs={12} sd={6} md={4}><DeliveryModal item={item} /></Grid>
        })}

      </Grid>
      <h3>From Table</h3>
      <Grid spacing={2} xs={12} container direction='row'>
        {data.table.map((item, index) => {
          return <Grid item xs={12} sd={6} md={4}><TableModal item={item} /></Grid>
        })}

      </Grid>
    </Grid>
  </div>
  )
}

export default Kitchen

const DeliveryModal = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false)
  const handleClick = () => {
    setShowDetails(!showDetails)
  }
  return <ModalContainer onClick={handleClick}>
    <FormText placeholder={'ID'} text={item.id} />
    <FormText placeholder={'From'} text={item.customer.name} noWrap />
    <FormText placeholder={'Address'} text={item.customer.address} />
    <FormText placeholder={'Number'} text={item.customer.number} />
    {<div style={{ height: showDetails ? 'auto' : 0, overflow: 'hidden' }}>
      <Typography style={{fontWeight:'bold'}}>Order</Typography>
      {objToArr(item).map((item,index)=>{
        return <FormText placeholder={index + 1} text={`${item.name} x ${item.count}`} />
      })}
      <Button variant="contained" size='small' color='primary' onClick={()=>console.log('ID',item.id)}>Completed</Button>
    </div>}
  </ModalContainer>
}

const TableModal = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false)
  const handleClick = () => {
    setShowDetails(!showDetails)
  }
  return <ModalContainer onClick={handleClick}>
    <FormText placeholder={'Table no'} text={item.id} />
    {<div style={{ height: showDetails ? 'auto' : 0, overflow: 'hidden' }}>
      <Typography style={{fontWeight:'bold'}}>Order</Typography>
      {objToArr(item).map((item,index)=>{
        return <FormText placeholder={index + 1} text={`${item.name} x ${item.count}`} />
      })}
      <Button variant="contained" size='small' color='primary' onClick={()=>console.log('ID',item.id)}>Completed</Button>
    </div>}
  </ModalContainer>
}

const FormText = ({ placeholder, text, noWrap = false }) => {
  return <Typography style={{ fontWeight: 'bold' }} noWrap={noWrap}>{placeholder}: <span style={{ fontWeight: 'normal' }}>{text}</span></Typography>
}