import React from 'react'
import { copyPaste } from './test-kifl-order'
import { processKifli } from './processor'
import './kifli.css'

export interface Product {
  name: string
  amount: number
  price: number
}

interface OrderProps {

}

function list (items: any) {
  return (
    <ul>{
      items.map((item: any) => <li key={item.name}>{`${item.name}, ${item.price}, ${item.amount}`}</li>)
    }</ul>
  )
}

export default function Kifli(props: OrderProps) {
  const processed = processKifli(copyPaste)
  return ( <>
      <div className='kifli'>
        {list(processed)}
      </div>
      <div>
        IDE jön majd minden
      </div>
  </>

  )
}
