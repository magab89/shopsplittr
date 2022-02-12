import React from 'react'
import { copyPaste } from './test-kifl-order'
import { processKifli } from './processor'
import './kifli.css'
import { useTable } from 'react-table'

export interface Product {
  name: string
  amount: number
  price: number
}

interface OrderProps {

}

function list (items: Product[]) {
  return (
    <ul>{
      items.map((item: Product) => <li key={item.name}>{`${item.name}, ${item.price}, ${item.amount}`}</li>)
    }</ul>
  )
}

interface TableeProps {
  products: Product[]
}

function Tableee (props: TableeProps) {
  const data = React.useMemo(
    () => [...props.products], []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Price',
        accessor: 'price',
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
    <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
      <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th
              {...column.getHeaderProps()}
              style={{
                borderBottom: 'solid 3px red',
                background: 'aliceblue',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              {column.render('Header')}
            </th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody {...getTableBodyProps()}>
      {rows.map(row => {
        prepareRow(row)
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map(cell => {
              return (
                <td
                  {...cell.getCellProps()}
                  style={{
                    padding: '10px',
                    border: 'solid 1px gray',
                    background: 'papayawhip',
                  }}
                >
                  {cell.render('Cell')}
                </td>
              )
            })}
          </tr>
        )
      })}
      </tbody>
    </table>
  )
}

export default function Kifli(props: OrderProps) {
  const processed = processKifli(copyPaste)

  return ( <>
      <div className='kifli'>
        {list(processed)}
      </div>
      <div>
        <Tableee
          products={processed}
        />
      </div>
  </>

  )
}
