import React from 'react'
import UserContext from '../../Context/UserContext';
import { useContext } from 'react';
import { useState } from 'react';
import {toast} from 'react-toastify'
import axios from 'axios';

function BuyOrSell() {
  const usercontext = useContext(UserContext);
  const {users} = usercontext;
  const [transactionType, setTransactionType] = useState();
  const [orderType, setOrderType] = useState("Market");
  const [user, setUser] = useState();
  const [StockAmount, setStockAmount] = useState();
  const [PriceLim, setPriceLim] = useState();
  const changeOrderType = () =>{
    setOrderType(document.getElementById("OrderType").value);
  }
  const changeTransactionType = () =>{
    setTransactionType(document.getElementById("buyorsell").value);
  }
  const changeUser = () =>{
    setUser(document.getElementById("IdforselectUser").value);
  }
  const handleBuySell = () => {
    if(!transactionType) toast.info('Please choose buy or sell.')
    else if(!user) toast.info('Please choose a user for the transaction.')
    else if(orderType === 'Limit' && !PriceLim) toast.info('Please set a price limit for Limit type transactions');
    else if(!StockAmount) toast.info('Please provide a stock amount.')
    else {
      if(transactionType === 'Buy') {
        axios.post('transaction/place/buy', {})
          .then((response) => toast.success('TRansaction Successful'))
          .catch((error) => {
            toast.error('An error occured')
            console.log(error);
          })
      }
    }
  }
  return (
    <div>
      <div className="Buy-OR-Sell">
      <select id='buyorsell' onChange={()=>{changeTransactionType()}} className="form-select" aria-label="Default select example">
        <option selected>Buy OR Sell</option>
        <option value="Buy">Buy</option>
        <option value="Sell">Sell</option>
    </select>
      </div>
      <div className='Select-User'>
      <select id="IdforselectUser" onChange={()=>{changeUser()}} className="form-select" aria-label="Default select example">
        <option selected>Select a User</option>
        {
          users.map(user => <option value={user.user_id}>{user.user_name}</option>
          )
        }
    </select>
      </div>
      <div className="Order-Type">
      <select id="OrderType" onChange={()=>{changeOrderType()}} className="form-select" aria-label="Default select example">
        {/* <option selected>Order Type (Limit / Market)</option> */}
        <option value="Market">Market</option>
        <option value="Limit">Limit</option>
    </select>
      </div>
      <div className='Stock/Price'>
        <div>
      <input className="form-control" type="text" value={StockAmount} onChange={(e) => setStockAmount(e.target.value)}  placeholder="Stock Amount" aria-label="default input example"></input></div>
      <div>
      {orderType === "Limit" ? 
      <input className="form-control" type="text" value={PriceLim} onChange={(e) => setPriceLim(e.target.value)} placeholder="Price" aria-label="default input example">
      </input> : ""}</div>
      
      </div>
      <button onClick={handleBuySell} type="button" className="btn btn-success">Place order</button>
    </div>
  )
}

export default BuyOrSell
