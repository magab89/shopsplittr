import React, { useEffect, useState } from 'react'
import { processKifli } from './processor'
import './kifli.css'
import Table from '../table'
import styled from 'styled-components'

const Styles = styled.div`
  padding: 1rem;

  .user {
    background-color: blue;
    color: white;
  }

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

export interface Person {
  name: string
  sum: number
}

export interface Product {
  name: string
  amount: number
  price: number
}

function list(items: Product[]) {
  return (
    <ul>{
      items.map((item: Product) => <li key={item.name}>{`${JSON.stringify(item)}`}</li>)
    }</ul>
  )
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
    setData(old =>
      old.map((row, index) => {
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
    )
  }

  const resetData = () => setData(processed)

  function isRowAmountDone (row) {
    let sum = 0
    Object.keys(row).forEach(key => {
      if (names.includes(key)) {
        sum += row[key]
      }
    })
    return row.amount === sum
  }

  function isRowPriceDone (row) {
    let sum = 0
    Object.keys(row).forEach(key => {
      if (names.includes(key)) {
        sum += row[key]
      }
    })
    return row.price === sum
  }

  function getCellStyle (cellInfo) {
    const style: any = {}
    if (cellInfo.column.id === 'amount' && isRowAmountDone(cellInfo.row.values)) {
      style.background = cellInfo.row.index % 2 === 0 ? 'rgba(115,189,51,0.98)' : 'green'
    }

    if (cellInfo.row.index === data.length && cellInfo.column.id === 'price') {
      style.background = isRowPriceDone(cellInfo.row.values) ? 'rgba(115,189,51,0.98)' : 'orange'
    }

    if (cellInfo.row.index === data.length && cellInfo.column.id === 'amount') {
      style.background = isRowPriceDone(cellInfo.row.values) ? 'rgba(115,189,51,0.98)' : 'orange'
    }

    return style
  }

  function getRowBackground (index) {
    if (index === data.length) {
      return 'orange'
    }
    return index % 2 === 0 ? 'rgba(0,0,0,.1)' : 'white'
  }

  return (<>
      <div>
        <button onClick={resetData}>Reset Table</button>
        <Styles>
          <Table
            sum={sum}
            people={names}
            products={data}
            updateMyData={updateMyData}
            getHeaderProps={column => ({})}
            getColumnProps={column => ({})}
            getRowProps={row => ({
              style: {
                background: getRowBackground(row.index),
              },
            })}
            getCellProps={cellInfo => ({
              style: getCellStyle(cellInfo)
            })}
          />
        </Styles>
      </div>
      <div>
        {JSON.stringify(sum)}
      </div>
    </>

  )
}
