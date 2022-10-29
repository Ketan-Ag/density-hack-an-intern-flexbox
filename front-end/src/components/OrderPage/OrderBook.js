import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import UserContext from '../../Context/UserContext';
import { useState,useContext } from 'react';

function OrderBook() {
    const usercontext = useContext(UserContext);
    const [orderBuy, setOrderBuy] = useState([]);
    const [orderSell, setOrderSell] = useState([]);
    useEffect(()=>{
        axios.get("/book/buy")
        .then(res1 => {
            console.log(res1.data);
            setOrderBuy(res1.data)
        })
        .catch(err => {
            console.log(err);
        });

        axios.get('/book/sell')
        .then(res2 => {
            setOrderSell(res2.data)
        })
        .catch(err => {
            console.log(err);
        });
    },[])

  return (
    <div className='Orderbook'>
        <div className='Order-Book-Buy'>
            <div className='BuyGreen'>Buy</div>
      <table className="table table-bordered border-success">
  <thead>
    <tr >
      <th scope="col" style={{borderBottom:"2px solid green"}}>Quantity</th>
      <th scope="col" style={{borderBottom:"2px solid green"}}>Price</th>
    </tr>
  </thead>
  <tbody>
    {
        orderBuy.map(orderb => (
            <tr>
                <td style={{borderBottom:"1.5px solid green"}}>{orderb.stocks_quantity}</td>
                <td style={{borderBottom:"1.5px solid green"}}>{orderb.max_buying_price}</td>
            </tr>
        ))
    }
  </tbody>
</table>
</div>
<div className="Order-Book-Sell">
<div className='SellRed'>Sell</div>
<table className="table">
  <thead>
    <tr>
      <th scope="col" style={{borderBottom:"2px solid red"}}>Quantity</th>
      <th scope="col" style={{borderBottom:"2px solid red"}}>Price</th>
    </tr>
  </thead>
  <tbody>
    {
        orderSell.map(orders => (
            <tr>
                <td style={{borderBottom:"1.5px solid red"}}>{orders.stocks_quantity}</td>
                <td style={{borderBottom:"1.5px solid red"}}>{orders.min_selling_price}</td>
            </tr>
        ))
    }
  </tbody>
</table>
</div>
    </div>
  )
}

export default OrderBook
