import React, { useMemo } from 'react'
import { useTable } from 'react-table'
import styled from 'styled-components'
import { DynamicCell } from './cell'

const colors = {
  green50: 'rgba(0,128,0,0.5)',
  green: 'rgba(0,128,0,1)',
  orange: 'rgba(255,165,0, 1)',
  orange50: 'rgba(255,165,0, 0.5)',
  white: 'rgba(255,255,255,1)',
  white50: 'rgba(255,255,255,0.5)'
}

const Styles = styled.div`
  padding: 1rem;

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

export default function Table({
  products,
  sum,
  names,
  updateMyData
}) {
  const data = React.useMemo(
    () => {
      return [...products, sum]
    }, [products, sum]
  )

  const peopleColumns = names.map(person => ({
    Header: person,
    accessor: person
  }))

  function getRowBackground(index) {
    if (index === data.length - 1) {
      return 'orange'
    }
    return index % 2 === 0 ? 'rgba(0,0,0,.1)' : 'white'
  }

  const getRowProps = (row) => ({
    style: {
      background: getRowBackground(row.index)
    }
  })

  function isRowAmountDone(row) {
    let sum = 0
    Object.keys(row).forEach(key => {
      if (names.includes(key)) {
        sum += row[key]
      }
    })
    return row.amount === sum
  }

  function isRowPriceDone(row) {
    let sum = 0
    Object.keys(row).forEach(key => {
      if (names.includes(key)) {
        sum += row[key]
      }
    })
    return row.price === sum
  }

  function getCellStyle(cellInfo) {
    const style: any = {}
    if (cellInfo.column.id === 'amount' && isRowAmountDone(cellInfo.row.values)) {
      style.background = cellInfo.row.index % 2 === 0 ? 'rgba(115,189,51,0.98)' : 'rgba(0,128,0,1)'
    }

    if (cellInfo.row.index === data.length - 1 && cellInfo.column.id === 'price') {
      style.background = isRowPriceDone(cellInfo.row.values) ? 'rgba(115,189,51,0.98)' : 'orange'
    }

    if (cellInfo.row.index === data.length - 1 && cellInfo.column.id === 'amount') {
      style.background = isRowPriceDone(cellInfo.row.values) ? 'rgba(115,189,51,0.98)' : 'orange'
    }

    if (cellInfo.row.index !== data.length - 1 && names.includes(cellInfo.column.id) && cellInfo.value > 0) {
      style.background = cellInfo.row.index % 2 === 0 ? 'rgba(246,166,0)' : 'rgb(246,166,0, 0.50)'
    }

    return style
  }

  const getCellProps = (cellInfo) => ({
    style: getCellStyle(cellInfo)
  })

  const defaultColumn = useMemo(
    () => ({
      minWidth: 5,
      width: 150,
      maxWidth: 400,
      Cell: DynamicCell
    }),
    []
  )

  const columns = useMemo(
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
    ], []
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
    <Styles>
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
                    style: column.style
                  }
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
                        style: cell.column.style
                      },
                      getCellProps(cell)
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
    </Styles>
  )
}
