import React from 'react'
import UserContext from '../../Context/UserContext';
import { useContext } from 'react';
import { useState } from 'react';

function BuyOrSell() {
  const usercontext = useContext(UserContext);
  const {users} = usercontext;  
  const [orderType, setOrderType] = useState("Market");
  const [StockAmount, setStockAmount] = useState();
  const [PriceLim, setPriceLim] = useState();
  const changeOrderType = () =>{
    setOrderType(document.getElementById("OrderType").value);
  }
  return (
    <div>
      <div className="Buy-OR-Sell">
      <select className="form-select" aria-label="Default select example">
        <option selected>Buy/Sell</option>
        <option value="Buy">Buy</option>
        <option value="Sell">Sell</option>
    </select>
      </div>
      <div className='Select-User'>
      <select id="IdforselectUser" className="form-select" aria-label="Default select example">
        <option selected>Select a User</option>
        {
          users.map(user => <option value={user.user_name}>{user.user_name}</option>
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
      <button type="button" className="btn btn-success">Place order</button>
    </div>
  )
}

export default BuyOrSell
