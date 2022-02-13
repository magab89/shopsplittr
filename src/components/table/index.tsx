import React, { useEffect, useMemo, useState } from 'react'
import { useTable } from 'react-table'

const PlusMinus = ({ value, onChange }) => (
  <>
    <button
      onClick={() => onChange(1)}
    >
      plus
    </button>
    <span> {value} </span>
    <button
      onClick={() => onChange(-1)}
    >
      minus
    </button>
  </>
)

const nonPersonCells = [
  'name', 'amount', 'price'
]


export default function Table({ products, sum, people, updateMyData }) {
  console.log(products)
  const data = React.useMemo(
    () => {
      return [...products, sum]
    }, [products, sum]
  )

  const peopleColumns = people.map(person => ({
    Header: person,
    accessor: person
  }))

  const DynamicCell = ({
    column: { id },
    cell: { value: initialValue, column },
    row: { original, index },
    updateMyData
  }) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    if (nonPersonCells.includes(id) || index === data.length - 1) {
      return (
        <span
          style={{
            whiteSpace: 'pre-wrap'
          }}
        >
      {value}
      </span>
      )
    }

    return (
      <span
        style={{
          whiteSpace: 'pre-wrap'
        }}
      >
      <PlusMinus
        value={value}
        onChange={increment => updateMyData(index, id, increment)}
      />
    </span>
    )
  }

  const defaultColumn = useMemo(
    () => ({
      minWidth: 5,
      width: 150,
      maxWidth: 400,
      Cell: DynamicCell
    }),
    [data]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name' // accessor is the "key" in the data
      },
      {
        Header: 'Price',
        accessor: 'price'
      },
      {
        Header: 'Amount',
        accessor: 'amount'
      },
      ...peopleColumns
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      updateMyData
    }
  )

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
                fontWeight: 'bold'
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
                    background: 'papayawhip'
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
