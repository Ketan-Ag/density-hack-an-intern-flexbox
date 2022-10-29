import './PortUserPortfolio.css';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import UserContext from '../../Context/UserContext';
import { useContext } from 'react';

function PortUserPortfolio() {
  const usercontext = useContext(UserContext);
  const {users} = usercontext;
  const [currMarketPrice, setCurrMarketPrice] = useState();
  useEffect(()=>{
    axios.get('/transaction/history')
    .then((response)=>{
      console.log("qwer")
      console.log(response.data[0].final_price);
      response.data.map(transaction => {
        setCurrMarketPrice(transaction.final_price);
      })
    })
  },[])

  
  return (
    <div className='portuserportfolio'>
      <div className="currentmarketprice">
        Current Market price : {currMarketPrice}
      </div>      
      <div className='userportfolio'>
          <table className="table table-info table-striped-columns">
      <thead>
        <tr className="table-info">
          <th scope="col">Username</th>
          <th scope="col">Stocks</th>
          <th scope="col">Fiat $</th>
        </tr>
      </thead>
      <tbody>
        {
          users.map((user) => (
            
              <tr key={user.user_id} className="table-info">
                <td className="table-info">{user.user_name}</td>
                <td className="table-info">{user.stocks}</td>
                <td className="table-info">{user.balance}</td>
        </tr>
          
          ))
        }
      </tbody>
    </table>
      </div>
    </div>
  )
}

export default PortUserPortfolio
