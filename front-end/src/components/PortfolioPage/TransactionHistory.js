import React, { useEffect } from 'react'
import UserContext from '../../Context/UserContext';
import { useContext } from 'react';
import axios from 'axios';
import { useState } from 'react';

function TransactionHistory() {
    const usercontext = useContext(UserContext);
    const {users} = usercontext;
    const [Transactionss, setTransactionss] = useState([])
   useEffect(()=>{
    axios.get('/transaction/history')
    .then((response)=>{
        setTransactionss(response.data)
    })
    .catch(err => {
        console.log(err);
    });

    
   },[])
  return (
    <div>
      <table className="table">
  <thead>
    <tr>
      <th scope="col">Transaction Id</th>
      <th scope="col">Buyer</th>
      <th scope="col">Buyer Id</th>
      <th scope="col">Stocks Quantity</th>
      <th scope="col">Seller</th>
      <th scope="col">Seller Id</th>
    </tr>
  </thead>
  <tbody>
    {
        Transactionss.map(transaction => (
            <tr>
                <th scope="row">{transaction.transaction_id}</th>
                    {
                        users.map(user => (
                            user.user_id == transaction.buyer_id ? <td>{user.user_name}</td> : ""
                        ))
                    }
                <td>{transaction.buyer_id}</td>
                <td>{transaction.stocks_quantity}</td>
                {
                    users.map(user => (
                        user.user_id == transaction.seller_id ? <td>{user.user_name}</td> : ""
                    ))
                }
                <td>{transaction.seller_id}</td>
            </tr>
        ))
    }
  </tbody>
</table>
    </div>
  )
}

export default TransactionHistory
