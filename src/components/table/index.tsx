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

export default function Table({
  products,
  sum,
  people,
  updateMyData,
  getHeaderProps,
  getColumnProps,
  getRowProps,
  getCellProps,
}) {
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
    <table {...getTableProps()}>
      <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th
              // Return an array of prop objects and react-table will merge them appropriately
              {...column.getHeaderProps([
                {
                  className: column.className,
                  style: column.style,
                },
                getColumnProps(column),
                getHeaderProps(column),
              ])}
            >
              {column.render('Header')}
            </th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody {...getTableBodyProps()}>
      {rows.map((row, i) => {
        prepareRow(row)
        return (
          // Merge user row props in
          <tr {...row.getRowProps(getRowProps(row))}>
            {row.cells.map(cell => {
              return (
                <td
                  // Return an array of prop objectsF and react-table will merge them appropriately
                  {...cell.getCellProps([
                    {
                      className: cell.column.className,
                      style: cell.column.style,
                    },
                    getColumnProps(cell.column),
                    getCellProps(cell),
                  ])}
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
