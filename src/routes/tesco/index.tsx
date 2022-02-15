import { processTescoEmail, TescoProduct } from './processor'
import EmailInput from '../../components/input/email'
import React, { useEffect, useState } from 'react'
import { ctrlA } from './orderExample'
import styled from 'styled-components'
import Table from '../../components/table'
import { Product } from '../kifli'

const FlexDiv = styled.div`
  margin: 5px;
  padding: 5px;
  display: flex;
  background-color: gray;
  align-items: stretch;
`
const ListContainer = styled.div`
  background-color: azure;
  border: black solid 1px;
  margin: 5px;
  padding: 5px;
  flex-grow: 1;
`

const Button = styled.button`
  display: flex;
  margin: 2px;
  justify-items: center;
`

function List({ data }) {
  function format (product: TescoProduct) {
    if (product.total) {
      return product.isByKilo ?
        `${product.name} - ${product.amount} kg - ${product.total} forint` :
        `${product.name} - ${product.amount} db - ${product.total} forint`
    } else {
      return product.isByKilo ?
        `${product.name} - ${product.amount} kg` :
        `${product.name} - ${product.amount} db`
    }
  }

  return (
    <ul>
      {data.map(d => (<li key={d.name}>{format(d)}</li>))}
    </ul>
  )
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

  console.log(total)
  return total
}

export default function Tesco() {
  const [processed, setProcessed] = useState({ products: [], notAvailableProducts: [] })

  const empty: Product[] = []
  const [data, setData] = useState(empty)
  const [total, setTotal] = useState(initTotal(names))

  function handleLoadData(email) {
    if (!email) {
      console.log('no data')
      setProcessed({ products: [], notAvailableProducts: [] })
      setData(empty)
      return
    }
    const processed = processTescoEmail(email)
    setProcessed(processed)
    setData(processed.products.map(item => (
      {
        ...item,
        ...names.reduce((previous, current) => {
          previous[current] = 0
          return previous
        }, {})
      }
    )))
  }

  useEffect(() => {
    setTotal(calculateTotal(data))
  }, [data])

  const addValueToData = (rowIndex, columnId, value) => {
    console.log({rowIndex, columnId, value})

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

  return (
    <div>
      <FlexDiv>
        <p>Copy paste your "Szállítólevél" below </p>
      </FlexDiv>

      <EmailInput
        onDataLoad={handleLoadData}
        exampleData={ctrlA}
      />

      {processed.products.length > 0 && <div>
        <Table
          sum={total}
          names={names}
          products={data}
          updateData={addValueToData}
        />
      </div>}

      <FlexDiv>
        <ListContainer>
          <h3>Products:</h3>
          <List data={processed.products}/>
        </ListContainer>
        <ListContainer>
          <h3>Not Available Products:</h3>
          <List data={processed.notAvailableProducts}/>
        </ListContainer>
      </FlexDiv>

    </div>
  )
}
