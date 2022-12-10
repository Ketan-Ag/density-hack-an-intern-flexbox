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
      response.data.forEach(transaction => {
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
          <table className="table table-info table-striped-columns PortfolioTable">
      <thead>
        <tr className="table-info">
          <th className='Table-HeaderForPadding' scope="col">Username</th>
          <th className='Table-HeaderForPadding' scope="col">Stocks</th>
          <th className='Table-HeaderForPadding' scope="col">Fiat $</th>
        </tr>
      </thead>
      <tbody>
        {
          users.map((user) => (
            
              <tr key={user.user_id} className="table-info">
                <td className="table-info Table-ElementForPadding">{user.user_name}</td>
                <td className="table-info Table-ElementForPadding">{user.stocks}</td>
                <td className="table-info Table-ElementForPadding">{user.balance}</td>
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
