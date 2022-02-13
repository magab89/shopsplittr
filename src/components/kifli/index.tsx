import React, { useEffect, useState } from 'react'
import { processKifli } from './processor'
import './kifli.css'
import Table from '../table'

export interface Product {
  name: string
  amount: number
  price: number
}

const names = ['Gabor', 'Dia', 'Peti', 'Csabi', 'Ancsi']

export default function Kifli({ orderConfirmEmail }) {
  const processed = processKifli(orderConfirmEmail).map(item => (
    {
      ...item,
      ...names.reduce((previous, current) => {
        previous[current] = 0
        return previous
      }, {})
    }
  ))

  const [data, setData] = useState(processed)
  const [sum, setSum] = useState({
    name: 'Total', amount: 0, price: 0, Gabor: 0, Dia: 0, Peti: 0, Csabi: 0, Ancsi: 0
  })

  useEffect(() => {
    const newSum = {
      name: 'Total', amount: 0, price: 0, Gabor: 0, Dia: 0, Peti: 0, Csabi: 0, Ancsi: 0
    }
    data.forEach(row => {
      const { price, amount } = row
      for (const [key, value] of Object.entries(row)) {
        switch (key) {
          case 'price':
            if (newSum[key] === undefined) newSum[key] = 0
            newSum[key] += price * amount
            break
          case 'amount':
            if (newSum[key] === undefined) newSum[key] = 0
            newSum[key] += Number(value)
            break
          case 'name':
            break
          default:
            if (newSum[key] === undefined) newSum[key] = 0
            if (value > 0) {
              newSum[key] += price * Number(value)
            }
        }

      }
    })
    setSum(newSum)
  }, [data])

  const updateMyData = (rowIndex, columnId, value) => {
    const newData = data.map((row, index) => {
      if (index === rowIndex) {
        const newValue = row[columnId] + value
        const isPositive = newValue >= 0

        let rowSum = 0
        Object.keys(row).forEach(key => {
          if (names.includes(key)) {
            rowSum += row[key]
          }
        })
        const isTooMuch = rowSum + value > row.amount
        if (isPositive && !isTooMuch) {
          row[columnId] = newValue
        }
      }
      return row
    })
    setData(newData)
  }

  const resetData = () => setData(processed)

  return (<>
      <div>
        <button onClick={resetData}>Reset Table</button>
        <Table
          sum={sum}
          names={names}
          products={data}
          updateMyData={updateMyData}
        />
      </div>
    </>
  )
}
