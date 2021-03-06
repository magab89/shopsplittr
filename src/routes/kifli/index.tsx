import React, { useEffect, useState } from 'react'
import { processKifli } from './processor'
import Table from '../../components/table'
import EmailInput from '../../components/input/email'
import { ctrlA } from './orderExample'

export interface Product {
  name: string
  amount: number
  price: number
  isDone?: boolean
}

const names = ['Gabor', 'Dia', 'Peti', 'Csabi', 'Ancsi']

const initTotal = (names: string[]) => {
  const people = {}
  names.forEach(name => {
    people[name] = 0
  })

  return {
    name: 'Total', amount: 0, price: 0, isDone: false, ...people
  }
}

function calculateTotal(data: Product[]) {
  const total = { ...initTotal(names) }

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

export default function Kifli() {
  const [email, setEmail] = useState('')
  const empty: Product[] = []
  const [data, setData] = useState(empty)
  const [total, setTotal] = useState(initTotal(names))

  useEffect(() => {
    if (email) {
      const processed = processKifli(email).map(item => (
        {
          ...item,
          ...names.reduce((previous, current) => {
            previous[current] = 0
            return previous
          }, {})
        }
      ))
      setData(processed)
    }
  }, [email])

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

  const resetData = () => {
    const processed = processKifli(email).map(item => (
      {
        ...item,
        ...names.reduce((previous, current) => {
          previous[current] = 0
          return previous
        }, {})
      }
    ))
    setData(processed)
  }

  function handleLoadData(data) {
    setEmail(data)
  }

  return (<>
      <EmailInput
        onDataLoad={handleLoadData}
        exampleData={ctrlA}
      />
      {email && <div>
        <button onClick={resetData}>Reset Table</button>
        <Table
          sum={total}
          names={names}
          products={data}
          updateData={addValueToData}
        />
      </div>}
    </>
  )
}
