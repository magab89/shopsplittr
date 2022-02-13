import React, { useEffect, useState } from 'react'
import { ctrlA } from './test-kifl-order'
import { processKifli } from './processor'
import './kifli.css'
import Table from '../table'

export interface Person {
  name: string
  sum: number
}

export interface Product {
  name: string
  amount: number
  price: number
}

interface OrderProps {

}

function list(items: Product[]) {
  return (
    <ul>{
      items.map((item: Product) => <li key={item.name}>{`${JSON.stringify(item)}`}</li>)
    }</ul>
  )
}

const names = ['Gabor', 'Dia', 'Peti', 'Csabi', 'Ancsi']

export default function Kifli(props: OrderProps) {
  const processed = processKifli(ctrlA).map(item => (
    {
      ...item,
      ...names.reduce((previous, current) => {
        previous[current] = 0
        return previous
      }, {})
    }
  ))

  const [data, setData] = useState(processed)
  const [originalData] = useState(data)
  const [sum, setSum] = useState({
    name: 'Total', amount: 0, price: 0, Gabor: 0, Dia: 0, Peti: 0, Csabi: 0, Ancsi: 0
  })

  useEffect(() => {
    const newSum = {
      name: 'Total', amount: 0, price: 0, Gabor: 0, Dia: 0, Peti: 0, Csabi: 0, Ancsi: 0
    }
    data.forEach(row => {
      const price = row.price
      for (const [key, value] of Object.entries(row)) {
        switch (key) {
          case 'price':
            if (newSum[key] === undefined) newSum[key] = 0
            newSum[key] += price
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
    console.log(processed[rowIndex], columnId, value)

    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const newValue = old[rowIndex][columnId] + value >= 0 ? old[rowIndex][columnId] + value : old[rowIndex][columnId]

          return {
            ...old[rowIndex],
            [columnId]: newValue
          }
        }
        return row
      })
    )
  }

  const resetData = () => setData(originalData)

  return (<>
      <div className="kifli">
        {list(data)}
      </div>
      <div>
        <button onClick={resetData}>Reset Data</button>
        <Table
          sum={sum}
          people={names}
          products={data}
          updateMyData={updateMyData}
        />
      </div>
      <div>
        {JSON.stringify(sum)}
      </div>
    </>

  )
}
