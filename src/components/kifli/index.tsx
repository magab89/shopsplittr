import React, { useEffect, useState } from 'react'
import { processKifli } from './processor'
import './kifli.css'
import Table from '../table'

export interface Product {
  name: string
  amount: number
  price: number
  isDone?: boolean
}

const names = ['Gabor', 'Dia', 'Peti', 'Csabi', 'Ancsi']

const initTotal = {
  name: 'Total', amount: 0, price: 0, isDone: false, Gabor: 0, Dia: 0, Peti: 0, Csabi: 0, Ancsi: 0
}

function calculateTotal (data: Product[]) {
  const total = { ...initTotal }

  data.forEach(row => {
    const { price, amount } = row
    for (const [key, value] of Object.entries(row)) {
      switch (key) {
        case 'price':
          if (total[key] === undefined) total[key] = 0
          total[key] += price * amount
          break
        case 'amount':
          if (total[key] === undefined) total[key] = 0
          total[key] += Number(value)
          break
        case 'name':
        case 'isDone':
          break
        default:
          if (total[key] === undefined) total[key] = 0
          if (value > 0) {
            total[key] += price * Number(value)
          }
      }
    }
    let sum = 0
    Object.keys(total).forEach(key => {
      if (names.includes(key)) {
        sum += total[key]
      }
    })
    total.isDone = total.price === sum
  })
  return total
}

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
  const [total, setTotal] = useState(initTotal)

  useEffect(() => {
    setTotal(calculateTotal(data))
  }, [data])

  const addValueToData = (rowIndex, columnId, value) => {
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
          row.isDone = rowSum + value === row.amount
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
          sum={total}
          names={names}
          products={data}
          updateData={addValueToData}
        />
      </div>
    </>
  )
}
