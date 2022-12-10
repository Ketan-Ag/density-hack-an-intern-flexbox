import React from 'react'
import UserContext from '../../Context/UserContext';
import { useContext } from 'react';
import { useState } from 'react';
import {toast} from 'react-toastify'
import axios from 'axios';

function BuyOrSell() {
  const usercontext = useContext(UserContext);
  const {users, orderBuy, updateAll} = usercontext;
  const [transactionType, setTransactionType] = useState();
  const [orderType, setOrderType] = useState("Market");
  const [user, setUser] = useState();
  const [StockAmount, setStockAmount] = useState();
  const [PriceLim, setPriceLim] = useState();
//   const [data, setData] = useState({});
let data = {};
let checkBalance;
let checkPrice;
let checkNoOfStocks;
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
        if(orderType === "Limit"){
            users.map((userind) => {
                if(userind.user_id == parseInt(user)){
                    console.log(userind.user_name);
                    checkBalance = userind.balance;
                }
            })
            if(checkBalance >= StockAmount*PriceLim){
                    data = {
                                buyer_id: user,
                                max_buying_price: (orderType === 'Limit' ? PriceLim : -1),
                                stocks_quantity: StockAmount
                            }
                    axios.post('transaction/place/buy', data)
                    .then(() => {
                        toast.success('Transaction Successful')
                        updateAll()
                    })
                    .catch((error) => {
                        toast.error(error.response.data.msg)
                        console.log(error);
                    });
            }
            else{
                    toast.error("Insufficient Balanace");
            }
        }
        else if(orderType === "Market"){
            users.map((userind2) => {
                if(userind2.user_id == parseInt(user)){
                    console.log(userind2.user_name);
                    checkBalance = userind2.balance;
                }
            })
            checkPrice = orderBuy[0].max_buying_price;
            orderBuy.map(orderbuy => {
                if(checkPrice < orderbuy.max_buying_price){
                    checkPrice = orderbuy.max_buying_price;
                }
            })
            if(checkBalance >= StockAmount*checkPrice){
                data = {
                                buyer_id: user,
                                max_buying_price: orderType === 'Limit' ? PriceLim : -1,
                                stocks_quantity: StockAmount
                            }
                    axios.post('transaction/place/buy', data)
                    .then(() => {
                        toast.success('Order Placed')
                        updateAll()
                    })
                    .catch((error) => {
                        toast.error(error.response.data.msg)
                        console.log(error);
                    });
            }
            else{
                toast.error("Insufficient Balance");
            }
        }
      }
      else {
        
            users.map((userind3) => {console.log(userind3, user)
                if(userind3.user_id == parseInt(user)){
                    checkNoOfStocks = userind3.stocks;
                }
            })
            if(StockAmount <= checkNoOfStocks){console.log(StockAmount,checkNoOfStocks);
                data = {
                            seller_id: user,
                            min_selling_price: orderType === 'Limit' ? PriceLim : -1,
                            stocks_quantity: StockAmount
                        }
                axios.post('transaction/place/sell', data)
                .then(() => {
                    toast.success('Order Placed')
                    updateAll()
                })
                .catch((error) => {
                    toast.error('An error occured')
                    console.log(error);
                })
            }
        else{console.log(StockAmount,checkNoOfStocks);
            toast.error("Insufficient Number of Stocks")
            }
        
      }
    }

  }
  return (
    <div className='BUY-OR-SELL'>
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
      <input className="form-control Stock-Amount-Input" type="text" value={StockAmount} onChange={(e) => setStockAmount(e.target.value)}  placeholder="Stock Amount" aria-label="default input example"></input></div>
      <div>
      {orderType === "Limit" ? 
      <input className="form-control Price-Limit-Input" type="text" value={PriceLim} onChange={(e) => setPriceLim(e.target.value)} placeholder="Price" aria-label="default input example">
      </input> : ""}</div>
      
      </div>
      <button onClick={handleBuySell} type="button" className="btn btn-success Place-Order-Button">Place order</button>
    </div>
  )
}

export default BuyOrSell
