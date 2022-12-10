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
      <table className="table Transaction-History-Table">
  <thead>
    <tr>
      <th className='Table-HeaderForPadding' scope="col">Transaction Id</th>
      <th className='Table-HeaderForPadding' scope="col">Buyer</th>
      <th className='Table-HeaderForPadding' scope="col">Buyer Id</th>
      <th className='Table-HeaderForPadding' scope="col">Stocks</th>
      <th className='Table-HeaderForPadding' scope="col">Seller</th>
      <th className='Table-HeaderForPadding' scope="col">Seller Id</th>
    </tr>
  </thead>
  <tbody>
    {
        Transactionss.map(transaction => (
            <tr>
                <th className='Table-ElementForPadding' scope="row">{transaction.transaction_id}</th>
                    {
                        users.map(user => (
                            user.user_id === transaction.buyer_id ? <td>{user.user_name}</td> : ""
                        ))
                    }
                <td className='Table-ElementForPadding'>{transaction.buyer_id}</td>
                <td className='Table-ElementForPadding'>{transaction.stocks_quantity}</td>
                {
                    users.map(user => (
                        user.user_id === transaction.seller_id ? <td>{user.user_name}</td> : ""
                    ))
                }
                <td className='Table-ElementForPadding'>{transaction.seller_id}</td>
            </tr>
        ))
    }
  </tbody>
</table>
    </div>
  )
}

export default TransactionHistory
