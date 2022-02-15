import React, { useEffect, useState } from 'react'

const PlusMinus = ({ value, onChange }) => (
  <>
    <button
      onClick={() => onChange(1)}
    >
      +
    </button>
    <span> {value} </span>
    <button
      onClick={() => onChange(-1)}
    >
      -
    </button>
  </>
)

const nonPersonCells = [
  'name', 'amount', 'price'
]

export const DynamicCell = (props) => {
  const {
    column: { id },
    cell: { value: initialValue },
    row: { index },
    rows,
    updateData
  } = props
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  if (nonPersonCells.includes(id) || index === rows.length - 1) {
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
        onChange={increment => updateData(index, id, increment)}
      />
    </span>
  )
}
