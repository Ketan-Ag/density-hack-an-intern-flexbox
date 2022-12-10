import React from 'react'
import UserContext from '../../Context/UserContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

function OrderBook() {
    const usercontext = useContext(UserContext);
    const {orderBuy, orderSell} = usercontext;

  return (
    <div className='OrderBookContainer'>
        <div className="BackbuttontoPortfolio">
            <Link to="/">&larr; Back</Link>
        </div>
        <div className='Orderbook'>
        <div className='Order-Book-Buy'>
            <div className='BuyGreen'>Buy</div>
      <table className="table table-bordered border-success TableOrderBook">
  <thead>
    <tr >
      <th className='Table-HeaderForPadding' scope="col" style={{borderBottom:"2px solid green"}}>Quantity</th>
      <th className='Table-HeaderForPadding' scope="col" style={{borderBottom:"2px solid green"}}>Price</th>
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
<table className="table TableOrderBook">
  <thead>
    <tr>
      <th className='Table-HeaderForPadding' scope="col" style={{borderBottom:"2px solid red"}}>Quantity</th>
      <th className='Table-HeaderForPadding' scope="col" style={{borderBottom:"2px solid red"}}>Price</th>
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
    </div>
  )
}

export default OrderBook
