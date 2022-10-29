import React, { useEffect, useState } from 'react'
import { ResponsiveLine } from '@nivo/line'
import axios from 'axios';

const MyResponsiveLine = ({ data /* see data tab */ }) => (
  <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: true,
          reverse: false
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'transactions',
          legendOffset: 36,
          legendPosition: 'middle'
      }}
      axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'market price',
          legendOffset: -40,
          legendPosition: 'middle'
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      tooltip={({ point }) => {
        return (
          <div
              style={{
                  background: 'white',
                  padding: '9px 12px',
                  border: '1px solid #ccc',
              }}
          >
              <div>Transaction Number: {point.data.x}</div>
              <div>Market Price: {point.data.y}</div>
          </div>
        )
    }}
  />
)

function PortfolioGraph() {
  
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('/transaction/history')
      .then((response) => setTransactions(response.data.map((obj) => {
        return {
          x: obj.transaction_id,
          y: obj.final_price
        }
      })))
      .catch((error) => console.log(error))
  }, [])
    
  return (
      <MyResponsiveLine data={[{id: 'market price', color: "hsl(289, 70%, 50%)", data: transactions}]} />
  )
}

export default PortfolioGraph