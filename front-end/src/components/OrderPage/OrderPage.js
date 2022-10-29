import React from 'react'
import BuyOrSell from './BuyOrSell'
import OrderBook from './OrderBook'
import './OrderPage.css';

function OrderPage() {
  return (
    <div className='oderPage'>
        <div className="OrderBook">
            <OrderBook />
        </div>
        <div className="buyORSELL">
            <BuyOrSell />
        </div>
    </div>
  )
}

export default OrderPage
